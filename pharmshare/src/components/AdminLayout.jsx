import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUser } from '../services/api';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [lightMode, setLightMode] = useState(() => {
        return localStorage.getItem('admin_light_mode') === 'true';
    });

    useEffect(() => {
        setUser(getUser());
    }, []);

    useEffect(() => {
        localStorage.setItem('admin_light_mode', lightMode);
    }, [lightMode]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path ? 'admin-nav-item active' : 'admin-nav-item';

    return (
        <div className={`admin-layout ${lightMode ? 'light-mode' : ''}`}>
            {/* Sidebar Admin */}
            <aside className="admin-sidebar">
                {/* Logo + Badge */}
                <div className="admin-brand">
                    <div className="admin-brand-icon">
                        <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="48" rx="12" fill="url(#admin-grad)" />
                            <path d="M12 24h24M24 12v24" stroke="white" strokeWidth="4" strokeLinecap="round"/>
                            <defs>
                                <linearGradient id="admin-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#10b981" />
                                    <stop offset="1" stopColor="#059669" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <div>
                        <div className="admin-brand-name">PharmShare</div>
                        <div className="admin-brand-role">Administration</div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="admin-sidebar-nav">
                    <Link to="/admin" className={isActive('/admin') && !location.pathname.includes('/admin/') ? 'active admin-nav-item' : 'admin-nav-item'}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                        </svg>
                        Vue Globale
                    </Link>
                    <Link to="/admin/pharmacies" className={isActive('/admin/pharmacies')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
                        </svg>
                        Valider Inscriptions
                    </Link>
                    <Link to="/admin/logs" className={isActive('/admin/logs')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                            <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                        </svg>
                        Logs & Sécurité
                    </Link>
                </nav>

                {/* Footer sidebar */}
                <div className="admin-sidebar-footer">
                    <div className="admin-user-info">
                        <div className="admin-user-avatar">
                            {user?.nom?.substring(0, 2).toUpperCase() || 'SA'}
                        </div>
                        <div>
                            <div className="admin-user-name">{user?.nom || 'Super Admin'}</div>
                            <div className="admin-user-role">Super Administrateur</div>
                        </div>
                    </div>
                    <button 
                        onClick={() => setLightMode(!lightMode)} 
                        className="admin-logout-btn" 
                        title={lightMode ? "Passer au thème sombre" : "Passer au thème clair"} 
                        style={{ marginRight: '0.75rem', color: lightMode ? '#f59e0b' : '#6ee7b7' }}
                    >
                        {lightMode ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                        )}
                    </button>
                    <button onClick={handleLogout} className="admin-logout-btn" title="Déconnexion">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                    </button>
                </div>
            </aside>

            {/* Contenu principal */}
            <main className="admin-main">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
