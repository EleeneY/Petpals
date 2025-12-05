import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import { PATHS } from './constants/Navigation'; 
import LoginPage from './pages/LoginPage'; 

const App = () => {
    const location = useLocation();
    const showHeader = location.pathname !== '/login'; 

    return (
        <div className="App">
            {showHeader && <Header />} 

            <main>
                <Routes>
                    {PATHS.map((pathItem) => (
                        <Route 
                            key={pathItem.link}
                            path={pathItem.link} 
                            element={
                                pathItem.label === "My Pets" || pathItem.label === "Post New Pet" ? (
                                    <ProtectedRoute>{pathItem.element}</ProtectedRoute>
                                ) : (
                                    pathItem.element
                                )
                            }
                        />
                    ))}
                    
                    <Route path="/login" element={<LoginPage />} />

                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>
        </div>
    );
};

export default App;