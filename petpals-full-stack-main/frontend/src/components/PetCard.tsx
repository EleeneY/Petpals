import { PetData, PetStatus } from '../types/Pet.ts';

interface PetCardProps {
    pet: PetData;
    isMyPet: boolean; 
    onStatusChange?: (petId: string, newStatus: PetStatus) => void;
    onCardClick: (pet: PetData) => void;
}

const cardStyles = {
    card: "pet-card",
    placeholder: "placeholder-img",
    statusButton: "status-button",
    matched: "matched",
    pending: "pending",
    cardStatus: "card-status"
};

const PetCard = ({ pet, isMyPet, onStatusChange, onCardClick }: PetCardProps) => {
    
    const showStatusManagement = isMyPet && onStatusChange;

    const nextStatus: PetStatus = pet.status === 'matched' ? 'pending' : 'matched';
    
    const handleStatusChange = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onStatusChange) {
            onStatusChange(pet.petId, nextStatus);
        }
    };
    
    const handleCardClick = () => {
        if (!showStatusManagement) { 
             onCardClick(pet);
        }
    };

    return (
        <div className="pet-card" onClick={handleCardClick}> 
            <img 
                src={pet.picture} 
                alt={`Picture of ${pet.name}`} 
                className="pet-image"
            />
            <div className="pet-card-content">
                <h3>{pet.name}</h3>
                <p>Age: {pet.age}</p>
            </div>
          
            {showStatusManagement && (
                <>
                    <p className={cardStyles.cardStatus} style={{ color: pet.status === 'matched' ? '#4CAF50' : '#ff9800' }}>
                        {pet.status === 'matched' ? 'Matched' : 'Pending Match'}
                    </p>

                    <button
                        className={`${cardStyles.statusButton} ${pet.status === 'matched' ? cardStyles.pending : cardStyles.matched}`}
                        onClick={handleStatusChange}
                    >
                        {pet.status === 'matched' ? 'set pending' : 'set matched'}
                    </button>
                </>
            )}
        </div>
    );
};

export default PetCard;