import { useState, useEffect } from 'react';
import { getBalance, updateBalance } from '../services/api';
import './Balance.css';
import { toast } from 'react-hot-toast';

const Balance = () => {
    const [loading, setLoading] = useState(true);
    const [balanceData, setBalanceData] = useState({ dettes: [], creances: [] });
    const [selectedItem, setSelectedItem] = useState(null); 

    const loadBalance = async () => {
        try {
            const data = await getBalance();
            setBalanceData(data);
        } catch (err) {
            console.error('Erreur chargement balance:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBalance();
    }, []);

    // Mise à jour locale pour que le statut change INSTANTANÉMENT
    const handleCompense = async (id) => {
        if (!window.confirm("Confirmez-vous avoir reçu la compensation pour ce dépannage ?")) return;
        
        try {
            const res = await updateBalance(id);
            if (res.success) {
                toast.success("Échange marqué comme compensé !");
                
                // On met à jour l'état local immédiatement sans attendre loadBalance
                setBalanceData(prev => ({
                    ...prev,
                    creances: prev.creances.map(c => c.id === id ? { ...c, statut: 'compense' } : c),
                    dettes: prev.dettes.map(d => d.id === id ? { ...d, statut: 'compense' } : d)
                }));
            } else {
                toast.error("Erreur : " + res.message);
            }
        } catch (err) {
            toast.error("Erreur de connexion : " + err.message);
        }
    };

    const formatMoney = (val) => {
        return new Intl.NumberFormat('fr-FR').format(val || 0) + ' F';
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // Calcul dynamique du solde sur les items NON COMPENSÉS (ni statut 'compense', ni payés)
    const totalDettesActive = balanceData.dettes.filter(d => 
        String(d.statut).toLowerCase() !== 'compense' && String(d.statut_paiement).toLowerCase() !== 'paye'
    ).reduce((sum, item) => sum + parseFloat(item.total_valeur), 0);

    const totalCreancesActive = balanceData.creances.filter(c => 
        String(c.statut).toLowerCase() !== 'compense' && String(c.statut_paiement).toLowerCase() !== 'paye'
    ).reduce((sum, item) => sum + parseFloat(item.total_valeur), 0);

    const TableSection = ({ title, data, type }) => (
        <div className="balance-history-card">
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>{title}</h2>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table className="balance-table">
                    <thead>
                        <tr>
                            <th>N° & PRODUIT</th>
                            <th>DATE</th>
                            <th>STATUT</th>
                            <th style={{ textAlign: 'right' }}>VALEUR</th>
                            <th style={{ textAlign: 'center' }}>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length > 0 ? data.map((item) => {
                            const isCompense = String(item.statut).toLowerCase() === 'compense' || String(item.statut_paiement).toLowerCase() === 'paye';
                            return (
                                <tr key={item.id} style={{ opacity: isCompense ? 0.6 : 1, transition: 'all 0.3s ease' }}>
                                    <td>
                                        <span className="id-link" style={{ color: isCompense ? 'var(--text-secondary)' : '#ef4444' }}>#{item.id}</span>
                                        <div style={{ marginTop: '0.25rem', color: 'var(--text-primary)', fontWeight: 600 }}>{item.produit_nom}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Partenaire : {item.partenaire_nom}</div>
                                    </td>
                                    <td style={{ color: 'var(--text-secondary)' }}>{formatDate(item.date_creation)}</td>
                                    <td>
                                        {isCompense ? (
                                            <span className="status-pill" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'inline-block', minWidth: '95px', textAlign: 'center' }}>
                                                COMPENSÉ
                                            </span>
                                        ) : (
                                            <span className="status-pill" style={{ 
                                                backgroundColor: type === 'dette' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                                                color: type === 'dette' ? '#ef4444' : '#10b981',
                                                display: 'inline-block',
                                                minWidth: '95px',
                                                textAlign: 'center'
                                            }}>
                                                {type === 'dette' ? 'À RENDRE' : 'À RECEVOIR'}
                                            </span>
                                        )}
                                    </td>
                                    <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
                                        {formatMoney(item.total_valeur)}
                                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 400 }}>Qté: {item.quantite}</div>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                                            <button 
                                                onClick={() => setSelectedItem(item)}
                                                style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer' }}
                                                title="Voir détails"
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                            </button>
                                            
                                            {/* Si pas compense, le bouton de validation apparait */}
                                            {type === 'creance' && !isCompense && (
                                                <button 
                                                    onClick={() => handleCompense(item.id)}
                                                    style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer' }}
                                                    title="Confirmer la réception"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                                </button>
                                            )}

                                            {/* Si compense, on met juste une petite coche coche de validation statique */}
                                            {isCompense && (
                                                <span style={{ color: '#10b981', fontWeight: 'bold' }} title="Déjà réglé">✓</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        }) : (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Aucun échange trouvé.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );

    return (
        <div className="dashboard-container" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Modal Détail */}
            {selectedItem && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="card" style={{ width: '450px', padding: '2rem', background: 'var(--card-bg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h3 style={{ margin: 0 }}>Détails du Dépannage</h3>
                            <button onClick={() => setSelectedItem(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.5rem' }}>&times;</button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.8rem' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Produit :</div>
                                <div style={{ fontWeight: 700 }}>{selectedItem.produit_nom} (Qté: {selectedItem.quantite})</div>
                            </div>
                            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.8rem' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pharmacie Partenaire :</div>
                                <div style={{ fontWeight: 700 }}>{selectedItem.partenaire_nom}</div>
                            </div>
                            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.8rem' }}>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Coordonnées Partenaire :</div>
                                <div style={{ fontWeight: 600 }}>📞 {selectedItem.partenaire_telephone || 'N/A'}</div>
                                <div style={{ fontSize: '0.85rem' }}>📍 {selectedItem.partenaire_adresse}, {selectedItem.partenaire_ville}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Valeur Estimée :</div>
                                <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.2rem' }}>{formatMoney(selectedItem.total_valeur)}</div>
                            </div>
                        </div>
                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }} onClick={() => setSelectedItem(null)}>Fermer</button>
                    </div>
                </div>
            )}

            <div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>Balance de l'Entraide</h1>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
                    Gérez vos dettes matérielles et l'équilibre de l'entraide entre confrères.
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', width: '100%' }}>
                <div className="card" style={{ borderLeft: '4px solid #ef4444', height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Dettes EN COURS (À RENDRE)</span>
                    <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ef4444' }}>{formatMoney(totalDettesActive)}</span>
                </div>
                <div className="card" style={{ borderLeft: '4px solid #10B981', height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Créances EN COURS (À RECEVOIR)</span>
                    <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#10B981' }}>{formatMoney(totalCreancesActive)}</span>
                </div>
                <div className="card" style={{ borderLeft: '4px solid #6366f1', height: '100px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Équilibre Réel (Net)</span>
                    <span style={{ fontSize: '1.8rem', fontWeight: 800, color: (totalCreancesActive - totalDettesActive) >= 0 ? '#10B981' : '#ef4444' }}>
                        {(totalCreancesActive - totalDettesActive) > 0 ? '+' : ''}{formatMoney(totalCreancesActive - totalDettesActive)}
                    </span>
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '4rem', textAlign: 'center' }}>Chargement...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    <TableSection title="Mes Dettes (Je dois RENDRE ces produits)" data={balanceData.dettes} type="dette" />
                    <TableSection title="Mes Créances (On me doit RÉCUPÉRER ces produits)" data={balanceData.creances} type="creance" />
                </div>
            )}
        </div>
    );
};

export default Balance;
