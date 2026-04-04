import { useState, useEffect } from 'react';
import { getToken } from '../services/api';
import toast from 'react-hot-toast';

const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost/Pharmshare/api'
    : 'https://pharmshare.alwaysdata.net/api';

async function adminFetch(endpoint, options = {}) {
    const token = getToken();
    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...(options.headers || {})
        }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error || `Erreur ${res.status}`);
    return data;
}

const AdminDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const loadStats = async () => {
            try {
                const res = await adminFetch('/admin/stats.php');
                setData(res.data);
            } catch (err) {
                console.error('Erreur chargement stats admin:', err);
                toast.error("Erreur de chargement des statistiques");
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    const handlePharmaAction = async (pharmacyId, actionStr) => {
        if (actionStr === 'delete' && !window.confirm("Êtes-vous sûr de vouloir supprimer DÉFINITIVEMENT cette pharmacie ? Toutes les données liées seront perdues.")) {
            return;
        }

        try {
            await adminFetch('/admin/pharmacies.php', {
                method: 'POST',
                body: JSON.stringify({ pharmacie_id: pharmacyId, action: actionStr })
            });
            toast.success(`Action ${actionStr} effectuée avec succès`);
            
            // Recharger les données pour refléter les changements
            const res = await adminFetch('/admin/stats.php');
            setData(res.data);
        } catch (err) {
            toast.error(err.message || "Erreur lors de l'opération");
        }
    };

    if (loading) {
        return (
            <div className="admin-loading">
                <div className="admin-spinner"></div>
                <p>Chargement du tableau de bord administrateur...</p>
            </div>
        );
    }

    const stats = data?.stats || {};
    const pharmacies = data?.pharmacies || [];
    const logs = data?.recent_logs || [];

    const statCards = [
        {
            label: 'Pharmacies Enregistrées',
            value: stats.total_pharmacies ?? 0,
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                </svg>
            ),
            color: '#10b981',
            bg: 'rgba(16,185,129,0.1)',
        },
        {
            label: 'Utilisateurs Actifs',
            value: stats.total_users ?? 0,
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
            color: '#10b981',
            bg: 'rgba(16,185,129,0.1)',
        },
        {
            label: 'Échanges Réalisés',
            value: stats.total_echanges ?? 0,
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="17 1 21 5 17 9" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><polyline points="7 23 3 19 7 15" /><path d="M21 13v2a4 4 0 0 1-4 4H3" />
                </svg>
            ),
            color: '#f59e0b',
            bg: 'rgba(245,158,11,0.1)',
        },
        {
            label: 'Annonces Actives',
            value: stats.total_annonces ?? 0,
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
            ),
            color: '#ef4444',
            bg: 'rgba(239,68,68,0.1)',
        },
        {
            label: 'Demandes en Attente',
            value: stats.demandes_en_attente ?? 0,
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
            ),
            color: '#34d399',
            bg: 'rgba(52,211,153,0.1)',
        },
        {
            label: 'Pharmacies Actives',
            value: stats.pharmacies_actives ?? 0,
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            ),
            color: '#06b6d4',
            bg: 'rgba(6,182,212,0.1)',
        },
    ];

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const d = new Date(dateStr);
        return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const formatLogDetails = (detailsStr) => {
        if (!detailsStr) return '-';
        try {
            const data = JSON.parse(detailsStr);
            let result = [];
            
            if (data.annonce_id) result.push(`Annonce N°${data.annonce_id}`);
            if (data.demande_id) result.push(`Demande N°${data.demande_id}`);
            if (data.produit_nom) result.push(`Produit : ${data.produit_nom}`);
            if (data.nouveau_statut) result.push(`Statut : ${data.nouveau_statut.toUpperCase()}`);
            if (data.montant) result.push(`Montant : ${parseFloat(data.montant).toLocaleString('fr-FR')} FCFA`);
            if (data.type) result.push(`Type : ${data.type}`);
            
            return result.length > 0 ? result.join(' • ') : detailsStr;
        } catch (e) {
            // Si ce n'est pas un JSON valide, on l'affiche tel quel
            return detailsStr;
        }
    };

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <div className="admin-header">
                <div className="admin-header-left">
                    <div className="admin-badge">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                        </svg>
                        Super Administrateur
                    </div>
                    <h1 className="admin-title">Tableau de Bord Global</h1>
                    <p className="admin-subtitle">Supervision de la plateforme PharmShare • Côte d'Ivoire</p>
                </div>
                <div className="admin-header-right">
                    <div className="admin-date">
                        {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="admin-stats-grid">
                {statCards.map((card, i) => (
                    <div className="admin-stat-card" key={i} style={{ '--card-color': card.color, '--card-bg': card.bg }}>
                        <div className="admin-stat-icon">{card.icon}</div>
                        <div className="admin-stat-info">
                            <div className="admin-stat-value">{card.value.toLocaleString('fr-FR')}</div>
                            <div className="admin-stat-label">{card.label}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div className="admin-tabs">
                <button
                    className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                    Aperçu Pharmacies
                </button>
                <button
                    className={`admin-tab ${activeTab === 'logs' ? 'active' : ''}`}
                    onClick={() => setActiveTab('logs')}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                    Logs d'Audit
                </button>
            </div>

            {/* Table Pharmacies */}
            {activeTab === 'overview' && (
                <div className="admin-table-wrapper">
                    <div className="admin-table-header">
                        <h3>Liste des Pharmacies</h3>
                        <span className="admin-count-badge">{pharmacies.length} pharmacies</span>
                    </div>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Pharmacie</th>
                                <th>Localisation</th>
                                <th>N° Agrément</th>
                                <th>Responsable</th>
                                <th>Utilisateurs</th>
                                <th>Échanges</th>
                                <th>Statut</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pharmacies.length === 0 ? (
                                <tr><td colSpan="7" className="admin-empty">Aucune pharmacie enregistrée</td></tr>
                            ) : pharmacies.map((ph) => (
                                <tr key={ph.id}>
                                    <td>
                                        <div className="admin-pharma-name">
                                            <div className="admin-avatar">{ph.nom?.substring(0, 2).toUpperCase()}</div>
                                            <span>{ph.nom}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="admin-location">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                            {ph.ville}{ph.quartier ? `, ${ph.quartier}` : ''}
                                    </span>
                                </td>
                                <td><span style={{ fontFamily: 'monospace', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', color: '#10b981' }}>{ph.licence_numero || 'Non Renseigné'}</span></td>
                                <td>{ph.responsable || '-'}</td>
                                <td><span className="admin-pill blue">{ph.nb_users}</span></td>
                                <td><span className="admin-pill purple">{ph.nb_echanges}</span></td>
                                <td>
                                    <span className={`admin-status ${ph.p_actif === 1 ? 'active' : 'inactive'}`} style={ph.p_actif === 0 ? {color: '#ef4444'} : {}}>
                                        {ph.p_actif === 1 ? '● Active' : '○ Bloquée'}
                                    </span>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                                        {ph.p_actif === 1 ? (
                                            <button onClick={() => handlePharmaAction(ph.id, 'block')} title="Bloquer" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)', padding: '0.3rem', borderRadius: '0.4rem', cursor: 'pointer' }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                            </button>
                                        ) : (
                                            <button onClick={() => handlePharmaAction(ph.id, 'unblock')} title="Débloquer" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', padding: '0.3rem', borderRadius: '0.4rem', cursor: 'pointer' }}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>
                                            </button>
                                        )}
                                        <button onClick={() => handlePharmaAction(ph.id, 'delete')} title="Supprimer" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', padding: '0.3rem', borderRadius: '0.4rem', cursor: 'pointer' }}>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Logs d'audit */}
            {activeTab === 'logs' && (
                <div className="admin-table-wrapper">
                    <div className="admin-table-header">
                        <h3>Journal d'Audit (Dernières Actions)</h3>
                        <span className="admin-count-badge">{logs.length} entrées</span>
                    </div>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Utilisateur</th>
                                <th>Pharmacie</th>
                                <th>Action</th>
                                <th>Détails</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 ? (
                                <tr><td colSpan="5" className="admin-empty">Aucun log disponible</td></tr>
                            ) : logs.map((log, i) => (
                                <tr key={i}>
                                    <td className="admin-date-cell">{formatDate(log.created_at)}</td>
                                    <td>{log.user_nom || '-'}</td>
                                    <td>{log.pharmacie_nom || '-'}</td>
                                    <td>
                                        <span className="admin-action-badge">{log.action}</span>
                                    </td>
                                    <td className="admin-details-cell" title={formatLogDetails(log.details)}>
                                        {formatLogDetails(log.details)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
