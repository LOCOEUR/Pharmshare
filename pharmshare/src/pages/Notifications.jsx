import { useCallback, useState, useEffect } from 'react';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../services/api';
import './Dashboard.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadNotifications = useCallback(async () => {
        try {
            const data = await getNotifications();
            if (data && data.notifications) {
                setNotifications(data.notifications.map(n => ({
                    id: n.id,
                    title: n.titre,
                    message: n.message,
                    time: n.date_creation ? new Date(n.date_creation).toLocaleString('fr-FR') : 'Récemment',
                    type: n.type || 'info',
                    read: !!parseInt(n.lu)
                })));
            }
        } catch (err) {
            console.error('Erreur chargement notifications:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadNotifications();
    }, [loadNotifications]);

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationRead(id);
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, read: true } : n
            ));
            window.dispatchEvent(new Event('refresh-stats'));
        } catch (err) {
            console.error('Erreur marquage lu:', err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllNotificationsRead();
            setNotifications(notifications.map(n => ({ ...n, read: true })));
            window.dispatchEvent(new Event('refresh-stats'));
        } catch (err) {
            console.error('Erreur marquage tout lu:', err);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'request':
            case 'demande':
                return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
            case 'alert':
            case 'alerte':
                return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
            case 'success':
                return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
            default:
                return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800 }}>Notifications</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>Restez informé des activités importantes.</p>
                </div>
                <button
                    className="btn btn-outline"
                    onClick={handleMarkAllAsRead}
                    style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
                >
                    Tout marquer comme lu
                </button>
            </div>

            <div className="notifications-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {notifications.length > 0 ? (
                    notifications.map(notif => (
                        <div
                            key={notif.id}
                            className="notification-card"
                            onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                            style={{
                                backgroundColor: notif.read ? 'transparent' : 'var(--bg-card)',
                                border: '1px solid var(--border)',
                                borderRadius: '1rem',
                                padding: '1.25rem',
                                display: 'flex',
                                gap: '1rem',
                                transition: 'all 0.2s',
                                cursor: notif.read ? 'default' : 'pointer',
                                opacity: notif.read ? 0.8 : 1
                            }}
                        >
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                backgroundColor: 'var(--app-bg)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                {getIcon(notif.type)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                    <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>{notif.title}</h4>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{notif.time}</span>
                                </div>
                                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>{notif.message}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', opacity: 0.5 }}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                        <p>Aucune notification pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
