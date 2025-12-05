
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    doc,
    updateDoc,
    getDoc,
    DocumentData,
    QuerySnapshot,
} from 'firebase/firestore';
import { db } from './firebase'; 
import { PetData, PetType, PetStatus} from '../frontend/src/types/Pet';

const PETS_COLLECTION = 'pets';

const mapDocumentToPetData = (doc: DocumentData & { id: string }): PetData => {
    const data = doc.data() as Omit<PetData, 'petId'>;
    return {
        ...data,
        petId: doc.id,
    } as PetData;
};

export const fetchPets = async (
    type?: PetType, 
    fosterDuration?: number, 
    location?: string,
    fosterStartDateStr?: string
): Promise<PetData[]> => {
    try {
        const petsCollectionRef = collection(db, PETS_COLLECTION);
        let q = query(petsCollectionRef, where('status', '==', 'pending')); 

        if (type) {
            q = query(q, where('type', '==', type));
        }

        const snapshot: QuerySnapshot<DocumentData> = await getDocs(q);
        
        let filteredPets: PetData[] = snapshot.docs.map(doc => ({
            ...doc.data(),
            petId: doc.id
        } as PetData));
        
        if (fosterDuration !== undefined) {
             filteredPets = filteredPets.filter(p => p.fosterDuration <= fosterDuration);
        }
        
        if (location) {
             filteredPets = filteredPets.filter(p => 
                p.pickupLocation.toLowerCase().includes(location.toLowerCase())
             );
        }

        if (fosterStartDateStr) {
            const userDate = new Date(fosterStartDateStr);
            const oneMonthBefore = new Date(userDate);
            oneMonthBefore.setMonth(userDate.getMonth() - 1);
            const oneMonthAfter = new Date(userDate);
            oneMonthAfter.setMonth(userDate.getMonth() + 1);

            filteredPets = filteredPets.filter(p => {
                const petStartDate = new Date(p.fosterStartDate);
                return petStartDate >= oneMonthBefore && petStartDate <= oneMonthAfter;
            });
        }

        return filteredPets;
    } catch (error) {
        console.error("Error fetching pets from Firestore:", error);
        return [];
    }
};

export const addPet = async (petData: Omit<PetData, 'petId' | 'status'> & { ownerId: string }): Promise<PetData | null> => {
    try {
        const fullPetData = { ...petData, status: 'pending' as PetStatus };
        const petsCollectionRef = collection(db, PETS_COLLECTION);
        const docRef = await addDoc(petsCollectionRef, fullPetData);
        
        const newPetDoc = await getDoc(docRef);
        
        return mapDocumentToPetData(newPetDoc); 
    } catch (error) {
        console.error("Error processing pet post:", error);
        return null;
    }
};

export const fetchMyPets = async (ownerId: string): Promise<PetData[]> => {
    try {
        const petsCollectionRef = collection(db, PETS_COLLECTION);
        const q = query(petsCollectionRef, where('ownerId', '==', ownerId));

        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => ({
            ...doc.data(),
            petId: doc.id
        } as PetData));
    } catch (error) {
        console.error("Error fetching my pets from Firestore:", error);
        return [];
    }
};

export const updatePetStatus = async (
    petId: string, 
    status: PetStatus, 
    currentUserId: string
): Promise<PetData | null> => {
    if (status !== 'matched' && status !== 'pending') {
         throw new Error('Invalid status value.');
    }

    try {
        const docRef = doc(db, PETS_COLLECTION, petId);
        const docSnapshot = await getDoc(docRef);

        if (!docSnapshot.exists()) {
            throw new Error('Pet not found.');
        }
        
        const petOwnerId = docSnapshot.data()?.ownerId;
        
        if (petOwnerId !== currentUserId) {
             throw new Error('Forbidden: You do not own this pet.');
        }
        
        await updateDoc(docRef, { status: status });

        return mapDocumentToPetData(await getDoc(docRef));

    } catch (error) {
        console.error("Error updating pet status in Firestore:", error);
        throw error;
    }
};