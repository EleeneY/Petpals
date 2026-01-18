import React, { useState, useEffect, useCallback } from 'react';
import PetCard from '../components/PetCard.tsx'; 
import { PetData, PetType } from '../types/Pet.ts'; 
import PetDetailModal from '../components/PetDetailModal.tsx';

const API_URL = 'http://localhost:8080/api/pets'; 

interface FilterState {
    type: PetType | '';
    fosterStartDate: string
    fosterDuration: string;
    location: string;
}

const FindPetsPage = () => {
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState<PetData | null>(null);

    const [filters, setFilters] = useState<FilterState>({
        type: '',
        fosterStartDate: '',
        fosterDuration: '',
        location: ''
    });
    const [availablePets, setAvailablePets] = useState<PetData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPets = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        const params = new URLSearchParams();
        if (filters.type) params.append('type', filters.type);
        if (filters.fosterDuration && !isNaN(parseInt(filters.fosterDuration))) {
             params.append('fosterDuration', filters.fosterDuration);
        }
        if (filters.fosterStartDate) params.append('fosterStartDate', filters.fosterStartDate);
        if (filters.location) params.append('location', filters.location);
        
        const url = `${API_URL}?${params.toString()}`;

        try {
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Failed to fetch pet listings from the server.');
            }
            
            const data: PetData[] = await response.json();
        
            setAvailablePets(data);

        } catch (err) {
            console.error("Fetch Error:", err);
            setAvailablePets([]);
        } finally {
            setIsLoading(false);
        }
    }, [filters]); 

    useEffect(() => {
        fetchPets(); 
    }, []); 

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [id.replace('filter-', '')]: value,
        }));
    };
    
    const handleSearchClick = () => {
        fetchPets();
    };
    
    const handlePetCardClick = (pet: PetData) => {
        setSelectedPet(pet);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedPet(null);
    };


    return (
        <div id="FindPets" className="page">
            <h2>Find Pets</h2>
            <div className="find-pets-form single-row-layout">
                
                <div className="filter-item">
                    <label htmlFor="pet-type">Type</label>
                    <select id="filter-type" value={filters.type} onChange={handleFilterChange}>
                        <option value="">All</option>
                        <option value="Dog">Dog</option>
                        <option value="Cat">Cat</option>
                    </select>
                </div>
         
                <div className="filter-item">
                    <label htmlFor="filter-fosterStartDate">Foster Start Date</label>
                    <input
                        type="date"
                        id="filter-fosterStartDate"
                        value={filters.fosterStartDate}
                        onChange={handleFilterChange}
                    />
                </div>
                
                <div className="filter-item">
                    <label htmlFor="duration">Foster Duration (days)</label>
                    <input
                        type="number"
                        id="filter-fosterDuration"
                        placeholder="e.g. 30"
                        value={filters.fosterDuration}
                        onChange={handleFilterChange}
                    />
                </div>

                <div className="filter-item">
                    <label htmlFor="location">Location</label>
                    <input
                        type="text"
                        id="filter-location"
                        placeholder="e.g. New York City"
                        value={filters.location}
                        onChange={handleFilterChange}
                    />
                </div>
                
                <div className="search-button-container-inline">
                    <button 
                        onClick={handleSearchClick} 
                        disabled={isLoading} 
                        className="search-button-small"
                    >
                        {isLoading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </div>
            
            <div className="pet-listing">
                {isLoading && <p>Loading pets...</p>}
                
                {error && <p style={{color: 'red'}}>Error: {error}</p>}

                {!isLoading && !error && availablePets.length > 0 ? (
                    availablePets.map(pet => (
                        <PetCard 
                            key={pet.petId} 
                            pet={pet} 
                            isMyPet={false}
                            onCardClick={handlePetCardClick} 
                        />
                    ))
                ) : (
                    !isLoading && !error && <p>No Related Pets Found</p>
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

export default FindPetsPage;
