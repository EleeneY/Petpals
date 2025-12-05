import React from 'react';
import { PetData } from '../types/Pet.ts';

interface PetDetailModalProps {
    pet: PetData;
    onClose: () => void;
}

const PetDetailModal: React.FC<PetDetailModalProps> = ({ pet, onClose }) => {
    if (!pet) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                
                <button className="modal-close-button" onClick={onClose}>
                    &times;
                </button>
                
                <img 
                    src={pet.picture} 
                    alt={`Picture of ${pet.name}`} 
                    className="modal-pet-image"
                />

                <div className="modal-details">
                    <h2>{pet.name}</h2>
                    <p><strong>Age:</strong> {pet.age}</p>
                    <p><strong>Gender:</strong> {pet.gender}</p>
                    <p><strong>Primary Breed:</strong> {pet.primaryBreed}</p>
                    <p><strong>Health:</strong> {pet.healthCondition}</p>
                    <p><strong>Foster Start:</strong> {pet.fosterStartDate}</p>
                    <p><strong>Foster Duration:</strong> {pet.fosterDuration} days</p>
                    <p><strong>Location:</strong> {pet.pickupLocation}</p>
                    <p><strong>Phone:</strong> {pet.phoneNumber}</p>
                </div>
            </div>
        </div>
    );
};

export default PetDetailModal;