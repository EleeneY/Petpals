import localPetImage from '../assets/IMG_3030.jpg'; 

const PET_IMAGE_URL = localPetImage;

const HomePage = () => (
    <div id="Home" className="page active">
        <h2>Home</h2>
        <div className="home-layout">
            <div className="pet-grid">
                <img 
                    src={PET_IMAGE_URL} 
                    style={{ 
                        width: '100%', 
                        height: 'auto', 
                        borderRadius: '8px', 
                        objectFit: 'cover',
                        minHeight: '200px'
                    }}
                />
            </div>
            <div className="welcome-panel">
                <h2 className="welcome-heading">Welcome to PetPals!</h2>
                <p style={{ fontStyle: 'italic', color: '#666', marginTop: '-10px' }}>Pet Boarding & Short-Term Experience Platform</p>
            </div>
        </div>
    </div>
);

export default HomePage;
