
import { useCallback, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDashboard, getUser } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [dashData, setDashData] = useState(null);
    const user = getUser();

    const loadDashboard = useCallback(async () => {
        try {
            const data = await getDashboard();
            setDashData(data);
        } catch (err) {
            console.error('Erreur chargement dashboard:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    const pharmacie = dashData?.pharmacie || {};
    const stats = dashData?.stats || {};
    const requests = dashData?.recent_requests || [];
    const alertes = dashData?.alertes || [];

    // Formater le montant en FCFA
    const formatMoney = (val) => {
        return new Intl.NumberFormat('fr-FR').format(val || 0) + ' F';
    };

    const getStatusText = (statut) => {
        const map = { en_attente: 'En Attente', acceptee: 'Approuvé', refusee: 'Rejeté', terminee: 'Terminé', annulee: 'Annulé' };
        return map[statut] || statut;
    };

    const getStatusClass = (statut) => {
        const map = { en_attente: 'pending', acceptee: 'approved', refusee: 'rejected', terminee: 'approved', annulee: 'rejected' };
        return map[statut] || 'pending';
    };


    return (
        <>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                        <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
                        Chargement du tableau de bord...
                    </div>
                </div>
            ) : (
                <>
                    {/* Salutation et actions rapides */}
                    <div className="greeting-section">
                        <div>
                            <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800 }}>Bonjour, {pharmacie.responsable || user?.nom || 'Dr.'}</h1>
                            <p style={{ color: '#94a3b8', margin: '0.5rem 0 0 0' }}>Voici votre aperçu quotidien des stocks et échanges.</p>
                        </div>
                        <div>
                            {['admin', 'pharmacien'].includes(user?.role) && (
                                <button className="btn btn-outline" onClick={() => navigate('/reports')}>
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                    Rapports
                                </button>
                            )}
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/surplus-declaration')}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                Nouvelle Annonce
                            </button>
                        </div>
                    </div>

                    {/* Rangée des cartes de statistiques */}
                    <div className="stats-row">
                        <div className="card">
                            <span className="card-label">Annonces Actives</span>
                            <span className="card-value">{stats.annonces_actives}</span>
                            <span className="card-trend trend-up">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                                {stats.total_produits} produits
                            </span>
                            <div className="card-icon-top">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                            </div>
                        </div>

                        <div className="card">
                            <span className="card-label">Approbations en Attente</span>
                            <span className="card-value">{stats.demandes_en_attente}</span>
                            <span className="card-trend" style={{ color: '#fbbf24' }}>
                                Action Requise
                            </span>
                            <div className="card-icon-top" style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            </div>
                        </div>

                        <div className="card" style={{ borderLeft: '4px solid #10B981' }}>
                            <span className="card-label">ROI / Pertes Évitées</span>
                            <span className="card-value" style={{ color: '#10B981' }}>{formatMoney(stats.economies)}</span>
                            <span className="card-trend" style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                Capital récupéré
                            </span>
                            <div className="card-icon-top" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            </div>
                        </div>
                    </div>

                    {/* Rangée CTA principale */}
                    <div className="cta-row">
                        <div className="card cta-card">
                            <div className="cta-icon-box">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                            </div>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem' }}>Déclarer un Surplus</h3>
                            <p style={{ color: '#94a3b8', margin: '0 0 1.5rem 0', fontSize: '0.9rem', maxWidth: '300px' }}>Listez vos médicaments proches de la péremption pour éviter le gaspillage.</p>
                            <button
                                className="btn"
                                style={{ backgroundColor: 'white', color: '#064E3B', alignSelf: 'flex-start' }}
                                onClick={() => navigate('/surplus-declaration')}
                            >
                                Commencer déclaration
                            </button>
                        </div>

                        <div className="card cta-card search-market-card">
                            <div className="cta-icon-box" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </div>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', color: 'white' }}>Rechercher sur le Marché</h3>
                            <p style={{ color: '#cbd5e1', margin: '0 0 1.5rem 0', fontSize: '0.9rem', maxWidth: '300px' }}>Trouvez des médicaments en rupture auprès de confrères vérifiés.</p>
                            <button
                                className="btn"
                                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', alignSelf: 'flex-start' }}
                                onClick={() => navigate('/market')}
                            >
                                Parcourir la bourse
                            </button>
                        </div>
                    </div>

                    {/* Section inférieure : Tableau et Widgets */}
                    <div className="bottom-grid">
                        {/* Gauche : Tableau */}
                        <div className="card" style={{ padding: '0' }}>
                            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontSize: '1rem' }}>Demandes d'Échange Récentes</h3>
                                <Link to="/requests" style={{ color: 'var(--primary)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600 }}>Voir Tout</Link>
                            </div>
                            <div style={{ padding: '1.5rem 1.5rem 1.5rem 1.5rem' }}>
                                {requests.length > 0 ? (
                                    <table className="custom-table">
                                        <thead>
                                            <tr>
                                                <th>Médicament</th>
                                                <th>Partenaire</th>
                                                <th>Type</th>
                                                <th>Statut</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {requests.map(req => (
                                                <tr key={req.id}>
                                                    <td style={{ fontWeight: 600 }}>{req.med}</td>
                                                    <td style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: req.type === 'Votre Offre' ? '#10B981' : '#60a5fa' }}></div>
                                                        {req.partner}
                                                    </td>
                                                    <td>{req.type}</td>
                                                    <td>
                                                        <span className={`status-badge status-${getStatusClass(req.statut)}`}>
                                                            {getStatusText(req.statut)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem 0' }}>Aucune demande récente</p>
                                )}
                            </div>
                        </div>

                        {/* Droite : Widgets */}
                        <div>
                            <div className="card" style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                    Alertes Prioritaires
                                </h3>

                                {alertes.length > 0 ? alertes.slice(0, 3).map((alerte, i) => (
                                    <div key={i} className={alerte.alerte_type === 'rupture' || alerte.alerte_type === 'stock_faible' ? 'alert-box' : 'info-box'} style={{ marginBottom: '0.5rem' }}>
                                        <div className={alerte.alerte_type === 'rupture' || alerte.alerte_type === 'stock_faible' ? 'alert-content' : 'info-content'}>
                                            <h4>{alerte.alerte_type === 'rupture' ? 'Rupture' : alerte.alerte_type === 'stock_faible' ? 'Stock Faible' : 'Péremption Proche'}</h4>
                                            <p>{alerte.nom} — Stock: {alerte.stock_actuel} (min: {alerte.stock_minimum})</p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="info-box">
                                        <div className="info-content">
                                            <h4>Tout est en ordre ✓</h4>
                                            <p>Aucune alerte prioritaire pour le moment.</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Dashboard;
