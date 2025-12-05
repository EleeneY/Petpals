import React, { useState, useEffect, useCallback } from 'react';
import PetCard from '../components/PetCard.tsx'; 
import PetDetailModal from '../components/PetDetailModal.tsx'; 
import { PetData, PetStatus } from '../types/Pet.ts'; 
import { useAuth } from '../auth/AuthUserProvider';

const MY_PETS_API_URL = 'http://localhost:8080/api/my-pets'; 
const STATUS_API_URL = 'http://localhost:8080/api/pets'; 

const MyPetsPage = () => {
    
    const { user } = useAuth();
    const [myPets, setMyPets] = useState<PetData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState<PetData | null>(null);

    const fetchMyPets = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const idToken = await user.getIdToken();

            const response = await fetch(MY_PETS_API_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${idToken}`, 
                },
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch my pet listings from the database.');
            }
            
            const data: PetData[] = await response.json();
            
            setMyPets(data);

        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchMyPets();
    }, [fetchMyPets]);

    const handleStatusChange = useCallback(async (petId: string, newStatus: PetStatus) => {
        const oldStatus = myPets.find(p => p.petId === petId)?.status;
        setMyPets(prevPets => 
            prevPets.map(pet => 
                pet.petId === petId ? { ...pet, status: newStatus } : pet
            )
        );

        try {
            const idToken = await user.getIdToken();
            const response = await fetch(`${STATUS_API_URL}/${petId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Server failed to update status.');
            }

        } catch (error) {
            setMyPets(prevPets => 
                prevPets.map(pet => 
                    pet.petId === petId ? { ...pet, status: oldStatus as PetStatus } : pet
                )
            );
            alert('Status update failed, please try again.');
        }
    }, [myPets, user]);

    const handlePetCardClick = (pet: PetData) => {
        setSelectedPet(pet);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedPet(null);
    };

    return (
        <div id="MyPets" className="page">
            <h2>My Pets</h2>
        
            <div className="pet-listing">
                {isLoading && <p>Loading your pets...</p>}
                
                {error && <p style={{color: 'red'}}>Error: {error}</p>}

                {!isLoading && !error && myPets.length > 0 ? (
                    myPets.map(pet => (
                        <PetCard 
                            key={pet.petId} 
                            pet={pet} 
                            isMyPet={true}
                            onStatusChange={handleStatusChange}
                            onCardClick={handlePetCardClick}
                        />
                    ))
                ) : (
                    !isLoading && !error && <p>No pets are posted</p>
                )}
            </div>

            {isModalOpen && selectedPet && (
                <PetDetailModal 
                    pet={selectedPet} 
                    onClose={handleModalClose} 
                />
            )}
        </div>
    );
};

export default MyPetsPage;