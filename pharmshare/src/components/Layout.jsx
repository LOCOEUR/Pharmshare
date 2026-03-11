import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getUser, getDashboard } from '../services/api';
import { useSearch } from '../context/SearchContext';
import { useState, useEffect } from 'react';
import realtimeService from '../services/RealtimeService';

const Layout = ({ children, hideSidebar = false }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = getUser();
    const userId = user?.id;
    const currentPath = location.pathname;
    const { searchQuery, setSearchQuery } = useSearch();
    const [notifCount, setNotifCount] = useState(0);

    useEffect(() => {
        if (!userId) return;

        const loadDashboardStats = async () => {
            try {
                const data = await getDashboard();
                setNotifCount(data.stats.notifs_non_lues || 0);
            } catch (err) {
                console.error('Error loading notif count:', err);
            }
        };

        // Chargement initial
        loadDashboardStats();

        // Abonnement au temps réel
        const unsubscribe = realtimeService.subscribe(({ type }) => {
            if (type === 'notification' || type === 'message') {
                // Si on reçoit une notification ou message, on rafraîchit le compteur
                loadDashboardStats();
            }
        });

        // Écouter un événement global pour forcer le rafraîchissement
        const handleRefreshStats = () => loadDashboardStats();
        window.addEventListener('refresh-stats', handleRefreshStats);

        return () => {
            unsubscribe();
            window.removeEventListener('refresh-stats', handleRefreshStats);
        };
    }, [userId]);

    const isActive = (path) => currentPath === path ? 'nav-item active' : 'nav-item';

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            const searchablePaths = ['/market', '/inventory', '/requests'];
            if (!searchablePaths.includes(currentPath)) {
                navigate('/market');
            }
        }
    };

    return (
        <div className={`dashboard-container ${hideSidebar ? 'no-sidebar' : ''}`}>
            {/* Navigation latérale */}
            {!hideSidebar && (
                <aside className="sidebar">
                    <div className="brand">
                        <div className="brand-icon" style={{ background: 'none', width: '32px', height: '32px' }}>
                            <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="48" height="48" rx="12" fill="url(#layout-logo-gradient)" />
                                <path d="M7 24C7 24 12 26 17 21" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                <path d="M41 24C41 24 36 22 31 27" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                <g transform="rotate(45 24 24)">
                                    <rect x="17" y="12" width="14" height="24" rx="7" fill="#065F46" />
                                    <path d="M17 24L31 24L31 19C31 15.134 27.866 12 24 12C20.134 12 17 15.134 17 19L17 24Z" fill="white" />
                                </g>
                                <defs>
                                    <linearGradient id="layout-logo-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#10B981" />
                                        <stop offset="1" stopColor="#059669" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <span>PharmShare</span>
                    </div>

                    <nav className="nav-links">
                        <Link to="/dashboard" className={isActive('/dashboard')}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                            Tableau de Bord
                        </Link>
                        <Link to="/inventory" className={isActive('/inventory')}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                            Inventaire
                        </Link>
                        <Link to="/market" className={isActive('/market')}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            Bourse d'Échange
                        </Link>
                        <Link to="/requests" className={isActive('/requests')}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                            Demandes
                        </Link>

                        {['admin', 'pharmacien'].includes(user?.role) && (
                            <Link to="/reports" className={isActive('/reports')}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
                                Rapports
                            </Link>
                        )}
                    </nav>

                    <div className="sidebar-footer">
                        <Link to="/settings" className={isActive('/settings')}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                            Paramètres
                        </Link>
                        <Link to="/logout" className="nav-item">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            Déconnexion
                        </Link>
                    </div>
                </aside>
            )}

            {/* Zone de contenu principal */}
            <main className="main-content">
                {/* Entête supérieure */}
                <div className="top-header">
                    <div className="search-container">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Rechercher médicament, grossiste..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearchSubmit}
                        />
                    </div>

                    <div className="header-actions">
                        <Link to="/chat" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
                            <svg style={{ cursor: 'pointer' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                        </Link>
                        <Link to="/notifications" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', position: 'relative' }} title="Notifications">
                            <svg style={{ cursor: 'pointer' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                            {notifCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-5px',
                                    right: '-5px',
                                    backgroundColor: '#ef4444',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '18px',
                                    height: '18px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.65rem',
                                    fontWeight: 'bold',
                                    border: '2px solid white'
                                }}>
                                    {notifCount > 9 ? '9+' : notifCount}
                                </span>
                            )}
                        </Link>
                        <Link to="/help" style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
                            <svg style={{ cursor: 'pointer' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                        </Link>
                        <Link to="/settings" className="user-profile" style={{ textDecoration: 'none' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{user?.nom || 'Ma Pharmacie'}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{['admin', 'pharmacien'].includes(user?.role) ? 'Pharmacien Titulaire' : 'Auxilliaire'}</div>
                            </div>
                            <div className="user-avatar" style={{
                                backgroundColor: 'var(--primary-light)',
                                border: '2px solid var(--primary)',
                                fontWeight: 'bold',
                                color: 'var(--primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textTransform: 'uppercase'
                            }}>
                                {user?.nom ? user.nom.substring(0, 2) : 'PH'}
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Contenu de la page */}
                {children}
            </main>
        </div>
    );
};

export default Layout;
