import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthUserProvider';

interface ProtectedRouteProps {
    children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user } = useAuth();
    
    if (user === undefined) {
        return <div>Loading authentication state...</div>; 
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;