import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PATHS } from '../constants/Navigation';
import { useAuth } from '../auth/AuthUserProvider';
import { signOut } from '../auth/auth';
import { auth } from '../firebaseClient';

const Header = () => { 
    const location = useLocation();
    const currentPath = location.pathname;
    const { user } = useAuth();

    const headerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px',
        minHeight: '60px',
        background: 'var(--color-primary)', 
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
        color: 'var(--color-text-light)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderRadius: '0 0 12px 12px'
    };

    const logoStyle: React.CSSProperties = {
        fontSize: '28px',
        fontWeight: 'bold',
        letterSpacing: '0.5px',
        display: 'flex',
        alignItems: 'center',
        color: 'var(--color-text-light)',
    };
    
    const navLinksStyle: React.CSSProperties = {
        display: 'flex',
        gap: '16px',
        fontSize: '1rem',
        flexWrap: 'wrap', 
        justifyContent: 'flex-end',
    };

    const linkBaseStyle: React.CSSProperties = {
        color: 'var(--color-text-light)',
        textDecoration: 'none',
        padding: '8px 15px',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        fontWeight: '600',
        whiteSpace: 'nowrap',
    };

    const linkActiveStyle: React.CSSProperties = {
        ...linkBaseStyle,
        backgroundColor: 'var(--color-accent)',
        color: 'var(--color-text-dark)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    };

    return (
        <header style={headerStyle}>
            <div style={logoStyle}>
                🦴 PetPals ❤️ 
            </div>
            
            <div style={navLinksStyle}>
                {PATHS.map(item => {
                    const isProtected = item.label === "My Pets" || item.label === "Post New Pet";
                    
                    if (isProtected && !user) return null;
                    
                    const isActive = item.link === currentPath;
                    
                    return (
                        <Link 
                            key={item.link}
                            to={item.link} 
                            style={isActive ? linkActiveStyle : linkBaseStyle}
                            onMouseOver={(e) => {
                                if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                            }}
                            onMouseOut={(e) => {
                                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                        >
                            {item.label}
                        </Link>
                    );
                })}
                
                {user ? (
                    <button 
                        onClick={() => signOut(auth)} 
                        style={{
                            ...linkBaseStyle, 
                            backgroundColor: 'var(--color-accent)', 
                            color: 'var(--color-text-dark)',
                            cursor: 'pointer'
                        }}
                    >
                        Sign Out
                    </button>
                ) : (
                    <Link 
                        to="/login"
                        style={currentPath === '/login' ? linkActiveStyle : linkBaseStyle}
                    >
                        Login
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;