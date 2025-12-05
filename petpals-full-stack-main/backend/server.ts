import express, { Request, Response } from 'express';
import cors from 'cors';
import { PetData, PetType, PetStatus } from '../frontend/src/types/Pet'; 
import { 
    fetchPets,
    addPet,
    fetchMyPets,
    updatePetStatus
} from './firebaseUtils'; 

import { authMiddleware, AuthenticatedRequest } from './authMiddleware'; 

import './firebaseAdmin';

const app = express();
const PORT = 8080;

app.use(cors()); 
app.use(express.json()); 

// GET /api/pets
app.get('/api/pets', async (req: Request, res: Response) => {
    const { type, fosterDuration, location, fosterStartDate} = req.query;

    const duration = fosterDuration ? parseInt(fosterDuration as string) : undefined;
    const locationStr = location ? (location as string) : undefined;
    const fosterStartDateStr = fosterStartDate ? (fosterStartDate as string) : undefined;

    try {
        const pets = await fetchPets(type as PetType, duration, locationStr, fosterStartDateStr);
        res.json(pets);
    } catch (error) {
        console.error("Error in /api/pets route:", error);
        res.status(500).json({ message: 'Error fetching pet listings.' });
    }
});

// POST /api/pets
app.post('/api/pets', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const body = req.body;
    const { pictureUrl } = body; 
    
    const ownerId = req.userId; 

    if (!ownerId) {
        return res.status(401).json({ message: 'Unauthorized: User ID not available.' });
    }

    if (!pictureUrl) {
        return res.status(400).json({ message: 'Picture URL is required.' });
    }
    
    try {
        const petDataToSave = {
            picture: pictureUrl,
            name: body.name,
            type: body.type as PetType,
            age: parseInt(body.age),
            gender: body.gender,
            primaryBreed: body.primaryBreed,
            healthCondition: body.healthCondition,
            fosterStartDate: body.fosterStartDate,
            fosterDuration: parseInt(body.fosterDuration),
            phoneNumber: body.phoneNumber,
            pickupLocation: body.pickupLocation,
            ownerId: ownerId, 
        };
        
        const newPet = await addPet(petDataToSave);

        if (newPet) {
            res.status(201).json(newPet);
        } else {
            res.status(500).json({ message: 'Failed to save pet data.' });
        }

    } catch (error) {
        console.error("Error processing pet post:", error);
        res.status(500).json({ message: (error as Error).message || 'Server error during pet posting.' });
    }
});

// GET /api/my-pets
app.get('/api/my-pets', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const ownerId = req.userId;

        if (!ownerId) {
             return res.status(401).json({ message: 'Unauthorized: User ID not available.' });
        }

        const myPets = await fetchMyPets(ownerId); //
        res.json(myPets);
    } catch (error) {
        console.error("Error in /api/my-pets route:", error);
        res.status(500).json({ message: 'Error fetching your pet listings.' });
    }
});

// PUT /api/pets/:petId/status
app.put('/api/pets/:petId/status', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const petId = req.params.petId; 
    const { status } = req.body;
    
    const currentUserId = req.userId;
    
    if (!currentUserId) {
        return res.status(401).json({ message: 'Unauthorized: User ID not available.' });
    }

    try {
        const updatedPet = await updatePetStatus(petId, status as PetStatus, currentUserId); 
        res.json(updatedPet);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'Pet not found.') {
                return res.status(404).json({ message: error.message });
            }
            if (error.message === 'Forbidden: You do not own this pet.') {
                return res.status(403).json({ message: error.message });
            }
            if (error.message === 'Invalid status value.') {
                return res.status(400).json({ message: error.message });
            }
            res.status(500).json({ message: 'Server error during status update.' });
        } else {
            res.status(500).json({ message: 'Unknown error occurred.' });
        }
    }
});


app.listen(PORT, () => {
    console.log(`PetPals API Server is running on http://localhost:${PORT}`);
});