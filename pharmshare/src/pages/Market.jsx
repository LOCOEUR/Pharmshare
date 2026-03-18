import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMarketItems, deleteAnnonce, createRequest, updateAnnonce, getUser } from '../services/api';
import './Dashboard.css';
import './Market.css';
import { useSearch } from '../context/SearchContext';
import { toast } from 'react-hot-toast';
import Skeleton from '../components/Skeleton';
import ProductImage from '../components/ProductImage';

const Market = () => {
    const navigate = useNavigate();
    const currentUser = getUser();
    const currentPharmacyId = currentUser?.pharmacie_id;
    const { searchQuery } = useSearch();
    const [activeFilter, setActiveFilter] = useState('all'); // tout, vente, demande, mes annonces
    const [marketItems, setMarketItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadMarket = useCallback(async () => {
        try {
            const data = await getMarketItems(searchQuery, activeFilter);
            // Mapper les données API vers le format du composant
            const mapped = data.map(a => ({
                id: a.id,
                type: a.type_annonce === 'vente' ? 'sell' : 'request',
                name: a.titre || a.produit_nom || 'Produit',
                quantity: a.quantite,
                price: a.prix_unitaire ? `${new Intl.NumberFormat('fr-FR').format(a.prix_unitaire)} F (Prix Grossiste)` : 'Échange / Négociable',
                expiry: a.date_expiration ? new Date(a.date_expiration).toLocaleDateString('fr-FR', { month: '2-digit', year: 'numeric' }) : 'N/A',
                pharmacy: a.pharmacie_nom,
                location: a.quartier || a.ville,
                posted: a.posted || 'Il y a 2h',
                pharmacie_id: a.pharmacie_id,
                image_url: a.image_url || a.produit_image,
                description: a.description,
                echange_contre: a.echange_contre,
                statut: a.statut,
                numero_lot: a.numero_lot
            }));
            setMarketItems(mapped);
        } catch (err) {
            console.error('Erreur chargement marché:', err);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, activeFilter]);

    useEffect(() => {
        loadMarket();
    }, [loadMarket]);

    const handleDelete = async (id) => {
        if (!window.confirm("Voulez-vous vraiment supprimer cette annonce ?")) return;
        try {
            await deleteAnnonce(id);
            toast.success("Annonce supprimée");
            loadMarket();
        } catch (err) {
            toast.error("Erreur: " + err.message);
        }
    };

    const handleFinishAnnonce = async (id) => {
        if (!window.confirm("Marquer cette annonce comme 'Affaire Conclue' ? Elle ne sera plus proposée aux autres.")) return;
        try {
            await updateAnnonce(id, { statut: 'vendue' });
            toast.success("Annonce marquée comme conclue");
            loadMarket();
        } catch (err) {
            toast.error("Erreur: " + err.message);
        }
    };

    const handleOrder = async (item) => {
        if (!window.confirm(`Confirmer la demande de dépannage pour ${item.quantity} boîtes de ${item.name} ?`)) return;

        try {
            await createRequest({
                annonce_id: item.id,
                destinataire_id: item.pharmacie_id,
                type_demande: 'achat',
                quantite: item.quantity,
                produit_nom: item.name
            });
            toast.success('Demande de dépannage envoyée avec succès !');
        } catch (err) {
            toast.error("Erreur lors de la commande : " + err.message);
        }
    };

    const MarketSkeleton = () => (
        <div className="market-card" style={{ opacity: 0.6 }}>
            <div className="market-card-header">
                <Skeleton type="text" width="70%" height="1.5rem" />
                <Skeleton type="rect" width="60px" height="24px" />
            </div>
            <div className="market-card-body">
                <Skeleton type="text" width="40%" />
                <Skeleton type="text" width="30%" />
                <Skeleton type="text" width="50%" />
            </div>
            <div className="market-card-footer">
                <Skeleton type="rect" width="100%" height="40px" />
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="market-container">
                <div style={{ marginBottom: '2rem' }}>
                    <Skeleton type="text" width="200px" height="2rem" />
                    <Skeleton type="text" width="400px" />
                </div>
                <div className="market-grid">
                    {[1, 2, 3, 4, 5, 6].map(i => <MarketSkeleton key={i} />)}
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Entête du marché */}
            <div className="market-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800 }}>Dépannage Confraternel</h1>
                        <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>Trouvez des médicaments en urgence ou dépannez vos confrères.</p>
                    </div>
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate('/surplus-declaration')}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Créer une Annonce
                    </button>
                </div>

                <div className="market-filters">
                    <button
                        className={`market-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('all')}
                    >
                        Tout
                    </button>
                    <button
                        className={`market-filter-btn ${activeFilter === 'sell' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('sell')}
                    >
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34d399' }}></span>
                        Dépannages
                    </button>
                    <button
                        className={`market-filter-btn ${activeFilter === 'request' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('request')}
                    >
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#60a5fa' }}></span>
                        Demandes
                    </button>
                    <button
                        className={`market-filter-btn ${activeFilter === 'mine' ? 'active' : ''}`}
                        onClick={() => setActiveFilter('mine')}
                        style={{ marginLeft: 'auto', border: '1px solid var(--primary)', color: activeFilter === 'mine' ? 'white' : 'var(--primary)' }}
                    >
                        Mes Annonces
                    </button>
                </div>
            </div>

            {/* Grille du marché */}
            <div className="market-grid">
                {marketItems.map(item => (
                    <div key={item.id} className={`market-card ${item.statut === 'vendue' ? 'sold' : ''}`}>
                        <div className="market-card-header">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <span className={`market-badge ${item.type === 'sell' ? 'badge-sell' : 'badge-request'}`}>
                                    {item.type === 'sell' ? 'Dépannage / Cession' : 'Recherche Urgent'}
                                </span>
                                {item.statut === 'en_negociation' && (
                                    <span className="market-badge badge-negotiation">🤝 Négociation</span>
                                )}
                                {item.statut === 'vendue' && (
                                    <span className="market-badge badge-sold">✅ Conclu</span>
                                )}
                            </div>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.posted}</span>
                        </div>

                        <div className="market-card-body">
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <div className="market-pill-image">
                                    <ProductImage src={item.image_url} alt={item.name} className="market-img" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <span className="market-drug-name">{item.name}</span>
                                        {(activeFilter === 'mine' || String(item.pharmacie_id) === String(currentPharmacyId)) && (
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                style={{ background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', padding: '4px' }}
                                                title="Supprimer l'annonce"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"></path></svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="market-info-row">
                                <span className="market-info-label">Quantité :</span>
                                <span className="market-info-value">{item.quantity} boîtes</span>
                            </div>
                            <div className="market-info-row">
                                <span className="market-info-label">Prix unitaire :</span>
                                <span className="market-info-value" style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{item.price}</span>
                            </div>
                            <div className="market-info-row">
                                <span className="market-info-label">Expiration :</span>
                                <span className="market-info-value">{item.expiry}</span>
                            </div>
                            {item.numero_lot && (
                                <div className="market-info-row">
                                    <span className="market-info-label">N° Lot :</span>
                                    <span className="market-info-value" style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{item.numero_lot}</span>
                                </div>
                            )}

                            <div className="market-pharmacy">
                                <div className="pharmacy-avatar">
                                    {item.pharmacy.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                    <div className="pharmacy-name">{item.pharmacy}</div>
                                    <div className="pharmacy-location">{item.location}</div>
                                </div>
                            </div>
                        </div>

                        <div className="market-card-footer">
                            {(activeFilter === 'mine' || String(item.pharmacie_id) === String(currentPharmacyId)) ? (
                                <div style={{ textAlign: 'center', width: '100%', padding: '0.5rem' }}>
                                    {item.statut === 'vendue' ? (
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                                            ✓ Affaire conclue
                                        </div>
                                    ) : (
                                        <button
                                            className="btn-contact"
                                            style={{ width: '100%', backgroundColor: '#059669', color: 'white' }}
                                            onClick={() => handleFinishAnnonce(item.id)}
                                        >
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                            Marquer comme Conclu
                                        </button>
                                    )}
                                </div>
                            ) : item.statut === 'vendue' ? (
                                <button className="btn-contact" disabled style={{ opacity: 0.5, cursor: 'not-allowed', backgroundColor: '#475569' }}>
                                    Indisponible (Vendu)
                                </button>
                            ) : (
                                <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                                    <button className="btn-contact" style={{ flex: 1 }} onClick={() => navigate(`/chat?partner=${item.pharmacie_id}&annonce=${item.id}`)}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                        Discuter
                                    </button>
                                    <button className="btn-contact" style={{ flex: 1, backgroundColor: '#10b981' }} onClick={() => handleOrder(item)}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                                        Demander dépannage
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {marketItems.length === 0 && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)' }}>
                        {activeFilter === 'mine' ? "Vous n'avez pas encore publié d'annonces." : "Aucune annonce ne correspond à votre recherche."}
                    </div>
                )}
            </div>
        </>
    );
};

export default Market;
