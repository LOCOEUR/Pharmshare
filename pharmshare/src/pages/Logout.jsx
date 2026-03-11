import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Nettoyage des tokens d'authentification s'ils existent
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');

        const timer = setTimeout(() => {
            navigate('/login');
        }, 1500);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#064E3B',
            color: 'white',
            fontFamily: "'Inter', sans-serif"
        }}>
            <div style={{
                marginBottom: '2rem',
                position: 'relative',
                width: '80px',
                height: '80px'
            }}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" opacity="0.25"></circle>
                    <path d="M12 2a10 10 0 0 1 10 10"></path>
                </svg>
                <style>
                    {`
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                    `}
                </style>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>Déconnexion...</h2>
            <p style={{ color: '#6EE7B7' }}>À bientôt sur PharmShare</p>
        </div>
    );
};

export default Logout;
