import React, { useState } from 'react';
import { PetType } from '../types/Pet.ts'; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../firebaseClient';
import { useAuth } from '../auth/AuthUserProvider';

const API_URL = 'http://localhost:8080/api/pets';

interface PetPostFormData {
    pictureFile: File | null;
    name: string;
    type: PetType | '';
    age: string;
    gender: string;
    primaryBreed: string;
    healthCondition: string;
    fosterStartDate: string;
    fosterDuration: string;
    phoneNumber: string;
    pickupLocation: string;
    ownerID : string;
}

async function uploadImageAndGetUrl(file: File): Promise<string> {
    const bucketPath = 'pet_photos/';
    const fileName = `${file.name.replace(/\s/g, '_')}-${Date.now()}`;
    const storageRef = ref(storage, `${bucketPath}${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    
    const pictureUrl = await getDownloadURL(snapshot.ref);
    
    return pictureUrl;
}

const PostNewPetPage = () => {
    const { user } = useAuth();

    const [formData, setFormData] = useState<PetPostFormData>({
        pictureFile: null,
        name: '',
        type: '',
        age: '',
        gender: '',
        primaryBreed: '',
        healthCondition: '',
        fosterStartDate: '',
        fosterDuration: '',
        phoneNumber: '',
        pickupLocation: '',
        ownerID: '',
    });
    
    const [isPosting, setIsPosting] = useState(false);
    const [message, setMessage] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        const fieldName = id.replace('pet-', '');

        setFormData(prev => ({
            ...prev,
            [fieldName as keyof PetPostFormData]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setFormData(prev => ({
            ...prev,
            pictureFile: file,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setIsPosting(true);

        const { pictureFile, ...textData } = formData;
        
        if (!pictureFile) {
            setMessage('Error: Please select a picture file.');
            setIsPosting(false);
            return;
        }

        try {
            const idToken = await user.getIdToken();
            const pictureUrl = await uploadImageAndGetUrl(pictureFile);
            
            const dataToPost = {
                ...textData,
                pictureUrl: pictureUrl,
                ownerId: user.uid,
                age: parseInt(textData.age),
                fosterDuration: parseInt(textData.fosterDuration),
            };

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify(dataToPost),
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to post new pet.');
            }

            const newPet = await response.json();
            setMessage(`Success! Pet "${newPet.name}" posted successfully.`);
            setFormData(prev => ({
                pictureFile: null,
                name: '',
                type: '',
                age: '',
                gender: '',
                primaryBreed: '',
                healthCondition: '',
                fosterStartDate: '',
                fosterDuration: '',
                phoneNumber: '',
                pickupLocation: '',
                ownerID: prev.ownerID,
            }));

        } catch (error) {
            console.error('Posting Error:', error);
            setMessage(`Error: ${(error as Error).message}`);
        } finally {
            setIsPosting(false);
        }
    };


    return (
        <div id="PostNewPet" className="page"> 
            <h2>Post a new pet</h2>
            
            <form onSubmit={handleSubmit} className="pet-form">
                
                <div className="form-row">
                    <label htmlFor="pet-pictureFile">Picture:</label>
                    <input 
                        type="file" 
                        id="pet-pictureFile" 
                        onChange={handleFileChange} 
                        accept="image/*"
                        required 
                    />
                    {formData.pictureFile && <p style={{fontSize: '0.8em', color: '#666'}}>File selected: {formData.pictureFile.name}</p>}
                </div>
                
                <div className="form-row">
                    <label htmlFor="pet-name">Name:</label>
                    <input type="text" id="pet-name" value={formData.name} onChange={handleInputChange} required />
                </div>
                
                <div className="form-row">
                    <label htmlFor="pet-type">Type:</label>
                    <select id="pet-type" value={formData.type} onChange={handleInputChange} required>
                        <option value="">Select Pet Type</option>
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                
                <div className="form-row">
                    <label htmlFor="pet-age">Age:</label>
                    <input type="number" id="pet-age" value={formData.age} onChange={handleInputChange} required />
                </div>
                
                <div className="form-row">
                    <label htmlFor="pet-gender">Gender:</label>
                    <select id="pet-gender" value={formData.gender} onChange={handleInputChange} required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                <div className="form-row">
                    <label htmlFor="pet-primaryBreed">Primary Breed:</label>
                    <input type="text" id="pet-primaryBreed" value={formData.primaryBreed} onChange={handleInputChange} required />
                </div>
                
                <div className="form-row">
                    <label htmlFor="pet-healthCondition">Health Condition:</label>
                    <input type="text" id="pet-healthCondition" value={formData.healthCondition} onChange={handleInputChange} required />
                </div>
                
                <div className="form-row">
                    <label htmlFor="pet-fosterStartDate">Foster Start Date:</label>
                    <input type="date" id="pet-fosterStartDate" value={formData.fosterStartDate} onChange={handleInputChange} required />
                </div>
                
                <div className="form-row">
                    <label htmlFor="pet-fosterDuration">Foster Duration (days):</label>
                    <input type="number" id="pet-fosterDuration" placeholder="days" value={formData.fosterDuration} onChange={handleInputChange} required />
                </div>
                
                <div className="form-row">
                    <label htmlFor="pet-phoneNumber">Phone Number:</label>
                    <input type="text" id="pet-phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required />
                </div>
                
                <div className="form-row">
                    <label htmlFor="pet-pickupLocation">Pickup Location:</label>
                    <input 
                        type="text" 
                        id="pet-pickupLocation" 
                        value={formData.pickupLocation} 
                        onChange={handleInputChange} 
                        placeholder="e.g. New York City"
                        required 
                    />
                </div>

                <button type="submit" className="post-button" disabled={isPosting}>
                    {isPosting ? 'Posting...' : 'Post a new pet'}
                </button>
                
                {message && (
                    <p style={{ marginTop: '10px', color: message.startsWith('Error') ? 'red' : 'green' }}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
};

export default PostNewPetPage;