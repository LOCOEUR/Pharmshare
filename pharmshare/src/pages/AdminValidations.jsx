import { useState, useEffect } from 'react';
import { getToken } from '../services/api';
import './AdminDashboard.css'; /* Réutilise les styles de base */
import toast from 'react-hot-toast';

const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost/Pharmshare/api'
    : 'https://pharmshare.alwaysdata.net/api';

const AdminValidations = () => {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadPending = async () => {
        try {
            const res = await fetch(`${API_BASE}/admin/validations.php`, {
                headers: { 'Authorization': `Bearer ${getToken()}` }
            });
            const data = await res.json();
            if (data.success) {
                setPending(data.data.pending || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPending();
    }, []);

    const handleAction = async (userId, action) => {
        try {
            const res = await fetch(`${API_BASE}/admin/validations.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ user_id: userId, action })
            });
            const data = await res.json();
            if (data.success) {
                toast.success(action === 'approve' ? "Inscription validée !" : "Inscription rejetée.");
                setPending(pending.filter(p => p.id !== userId));
            } else {
                toast.error(data.error);
            }
        } catch (err) {
            toast.error("Erreur serveur");
        }
    };

    if (loading) return <div className="admin-loading"><div className="admin-spinner"></div></div>;

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">Validation des Inscriptions</h1>
                    <p className="admin-subtitle">Acceptez ou refusez l'accès réseau aux nouvelles pharmacies.</p>
                </div>
            </div>

            <div className="admin-table-wrapper">
                <div className="admin-table-header">
                    <h3>Nouvelles demandes en attente</h3>
                    <span className="admin-count-badge">{pending.length} demandes</span>
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Pharmacien</th>
                            <th>Pharmacie Associée</th>
                            <th>N° Agrément</th>
                            <th>Ville</th>
                            <th>Date Demande</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pending.length === 0 ? (
                            <tr><td colSpan="5" className="admin-empty">Aucune demande en attente actuellement.</td></tr>
                        ) : pending.map(req => (
                            <tr key={req.id}>
                                <td>
                                    <div className="admin-pharma-name">
                                        <div className="admin-avatar">{req.nom.substring(0, 2).toUpperCase()}</div>
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{req.nom}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{req.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{req.pharmacie_nom || 'Pharmacie Indépendante'}</td>
                                <td><span style={{ fontFamily: 'monospace', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', color: '#10b981' }}>{req.licence_numero || 'Non Renseigné'}</span></td>
                                <td>{req.ville || '-'}</td>
                                <td className="admin-date-cell">{new Date(req.date_creation).toLocaleDateString('fr-FR')}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                        <button 
                                            onClick={() => handleAction(req.id, 'reject')}
                                            style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s' }}
                                        >
                                            Refuser
                                        </button>
                                        <button 
                                            onClick={() => handleAction(req.id, 'approve')}
                                            style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.4rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.2s' }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                                            Valider
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminValidations;
