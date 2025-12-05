import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
    
    return (
        <>
            <Header /> 
            
            <div className="container">
                <Outlet />
            </div>
        </>
    );
};

export default RootLayout;