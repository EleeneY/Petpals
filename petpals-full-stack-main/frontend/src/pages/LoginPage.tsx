import localPetImage from '../assets/IMG_3030.jpg'; 
import { useAuth } from '../auth/AuthUserProvider';
import { 
    signIn, // Google login
    logInWithEmailPassword, // email login
    signUpWithEmailPassword //email signup
} from '../auth/auth'; 
import { auth } from '../firebaseClient'; 
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PET_IMAGE_URL = localPetImage;

const LoginPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user) {
            navigate('/'); 
        }
    }, [user, navigate]);

    const handleGoogleSignIn = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            await signIn(auth);
        } catch (err) {
            const errorCode = (err as Record<string, string>).code || 'unknown-error';
            setError(formatAuthError(errorCode));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEmailLogIn = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            await logInWithEmailPassword(auth, email, password);
        } catch (err) {
            const errorCode = (err as Record<string, string>).code || 'unknown-error';
            setError(formatAuthError(errorCode));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEmailSignUp = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            await signUpWithEmailPassword(auth, email, password);
        } catch (err) {
            const errorCode = (err as Record<string, string>).code || 'unknown-error';
            setError(formatAuthError(errorCode));
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatAuthError = (code: string): string => {
        switch (code) {
            case 'auth/wrong-password':
                return 'Wrong password. Please try again.';
            case 'auth/user-not-found':
                return 'Email not found. Please sign up first.';
            case 'auth/email-already-in-use':
                return 'This email is already registered.';
            case 'auth/invalid-email':
                return 'Invalid email format.';
            case 'auth/weak-password':
                return 'Password is too weak. It should be at least 6 characters.';
            default:
                return 'Authentication failed. Please check your email and password.';
        }
    };

   if (user) {
        return (
            <div id="Login" className="page" style={{ padding: '40px', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--color-primary)' }}>Login Successful!</h2>
                <p>Redirecting you to the home page...</p>
            </div>
        );
    }
    
    return (
        <div id="Login" className="page active">
            <h1>Login</h1>
                <div className="home-layout">
                    <div className="pet-grid">
                        <img 
                            src={PET_IMAGE_URL} 
                            alt="Pet for boarding"
                            style={{ 
                                width: '100%', 
                                height: 'auto', 
                                borderRadius: '8px', 
                                objectFit: 'cover', 
                                minHeight: '200px' 
                            }}
                        />
                    </div>
                    
                    <div className="welcome-panel login-panel">
                        <h2 className="welcome-heading">PetPals Account</h2>
                        
                        {error && (
                            <p style={{ color: 'red', padding: '10px', border: '1px solid red', borderRadius: '4px', marginBottom: '15px', textAlign: 'left' }}>
                                {error}
                            </p>
                        )}

                        <div className="login-input-group">
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={isSubmitting}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password (min 6 characters)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isSubmitting}
                                required
                            />
                        </div>

                        <div className="auth-button-group">
                            <button 
                                onClick={handleEmailLogIn}
                                disabled={isSubmitting || !email || !password}
                                className="auth-button login-btn"
                            >
                                {isSubmitting ? 'Logging In...' : 'Log In'}
                            </button>
                            <button 
                                onClick={handleEmailSignUp}
                                disabled={isSubmitting || !email || !password}
                                className="auth-button signup-btn"
                            >
                                {isSubmitting ? 'Signing Up...' : 'Sign Up'}
                            </button>
                        </div>
                        
                        <div className="separator"></div>
                        
                        <div style={{ textAlign: 'center' }}> 
                            <button 
                                onClick={handleGoogleSignIn}
                                disabled={isSubmitting}
                                className="auth-button google-btn"
                            >
                                {isSubmitting ? 'Processing...' : 'Sign in with Google'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    );
};

export default LoginPage;