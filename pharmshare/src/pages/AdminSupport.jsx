import { useState } from 'react';
import './AdminDashboard.css';
import toast from 'react-hot-toast';

const MOCK_TICKETS = [
    {
        id: 'T-1049',
        pharmacie: 'Pharmacie Centrenale',
        user: 'Dr. Bakayoko',
        sujet: 'Impossible de valider un paiement Wave',
        date: 'Aujourd\'hui, 14:30',
        statut: 'ouvert',
        priorite: 'haute',
        contenu: 'Bonjour, lorsque je tente d\'accepter la demande #42, l\'API Wave me renvoie une erreur de connexion. Merci de vérifier.',
    },
    {
        id: 'T-1048',
        pharmacie: 'Pharmacie de la Paix',
        user: 'Dr. Kouassi',
        sujet: 'Modification de mon mot de passe',
        date: 'Hier, 09:15',
        statut: 'attente',
        priorite: 'basse',
        contenu: 'Je n\'arrive plus à enregistrer mon nouveau mot de passe dans les paramètres du profil.',
    },
    {
        id: 'T-1047',
        pharmacie: 'Pharmacie Sainte Marie',
        user: 'Dr. Konan',
        sujet: 'Erreur synchronisation inventaire',
        date: 'Hier, 16:42',
        statut: 'resolu',
        priorite: 'moyenne',
        contenu: 'Mon fichier CSV ne veut pas se charger dans l\'outil de surplus.',
    }
];

const AdminSupport = () => {
    const [tickets, setTickets] = useState(MOCK_TICKETS);
    const [activeTicket, setActiveTicket] = useState(null);
    const [reply, setReply] = useState('');

    const handleResolve = () => {
        if (!activeTicket) return;
        setTickets(tickets.map(t => t.id === activeTicket.id ? { ...t, statut: 'resolu' } : t));
        toast.success(`Ticket ${activeTicket.id} marqué comme résolu !`);
        setActiveTicket(null);
        setReply('');
    };

    const handleSendReply = () => {
        if (!reply.trim()) return toast.error('Veuillez écrire un message');
        toast.success('Réponse envoyée au pharmacien !');
        setReply('');
    };

    const getStatusStyle = (statut) => {
        if (statut === 'ouvert') return { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', label: 'Ouvert' };
        if (statut === 'attente') return { bg: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', label: 'En attente' };
        return { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', label: 'Résolu' };
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">Support Technique Utilisateurs</h1>
                    <p className="admin-subtitle">Gérez les requêtes et aidez les pharmacies utilisant le système.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '1.5rem', height: '65vh' }}>
                {/* Liste des tickets (Sidebar) */}
                <div className="admin-table-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div className="admin-table-header" style={{ padding: '1rem' }}>
                        <h3>Tickets Actifs</h3>
                    </div>
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {tickets.map(t => {
                            const status = getStatusStyle(t.statut);
                            return (
                                <div 
                                    key={t.id} 
                                    style={{ 
                                        padding: '1rem', 
                                        borderBottom: '1px solid rgba(255,255,255,0.05)', 
                                        cursor: 'pointer',
                                        background: activeTicket?.id === t.id ? 'rgba(16, 185, 129, 0.05)' : 'transparent',
                                        borderLeft: activeTicket?.id === t.id ? '3px solid #10b981' : '3px solid transparent'
                                    }}
                                    onClick={() => setActiveTicket(t)}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t.id}</span>
                                        <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: status.bg, color: status.color, fontWeight: 'bold' }}>
                                            {status.label}
                                        </span>
                                    </div>
                                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem', color: '#e2e8f0' }}>{t.sujet}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Par {t.user} • {t.pharmacie}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Détail du ticket (Main) */}
                <div className="admin-table-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {activeTicket ? (
                        <>
                            <div className="admin-table-header" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{activeTicket.sujet}</h3>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{activeTicket.id} • Ouvert {activeTicket.date} par <span style={{ color: '#10b981' }}>{activeTicket.user}</span> ({activeTicket.pharmacie})</div>
                                </div>
                                {activeTicket.statut !== 'resolu' && (
                                    <button onClick={handleResolve} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', display: 'flex', gap: '0.5rem' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                                        Marquer Résolu
                                    </button>
                                )}
                            </div>
                            
                            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '1.5rem' }}>
                                    <p style={{ margin: 0, color: '#e2e8f0', lineHeight: 1.6, fontSize: '0.9rem' }}>{activeTicket.contenu}</p>
                                </div>

                                {activeTicket.statut !== 'resolu' && (
                                    <div style={{ marginTop: 'auto' }}>
                                        <textarea 
                                            value={reply}
                                            onChange={(e) => setReply(e.target.value)}
                                            placeholder="Répondre au pharmacien..."
                                            style={{ width: '100%', minHeight: '120px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '1rem', color: 'white', resize: 'vertical', fontFamily: 'inherit', marginBottom: '1rem' }}
                                        ></textarea>
                                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <button onClick={handleSendReply} style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.2s' }}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                                                Envoyer
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" style={{ marginBottom: '1rem', opacity: 0.5 }}>
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                            </svg>
                            <p>Sélectionnez un ticket pour afficher les détails</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminSupport;
