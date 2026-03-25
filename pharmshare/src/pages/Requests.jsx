import { useCallback, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRequests, updateRequestStatus, initWavePayment, verifyWavePayment } from '../services/api';
import Receipt from '../components/Receipt';
import './Dashboard.css';
import './Requests.css';
import { useSearch } from '../context/SearchContext';
import realtimeService from '../services/RealtimeService';
import { toast } from 'react-hot-toast';
import Skeleton from '../components/Skeleton';

const Requests = () => {
    const navigate = useNavigate();
    const { searchQuery } = useSearch();
    const [activeTab, setActiveTab] = useState('received');
    const [requestsList, setRequestsList] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const [showPayment, setShowPayment] = useState(false);
    const [paymentRequest, setPaymentRequest] = useState(null);
    const [wavePhone, setWavePhone] = useState('');
    const [paymentStep, setPaymentStep] = useState(1); // 1: Form, 2: Loading Validation
    const [,setPaymentSession] = useState(null);

    const loadRequests = useCallback(async () => {
        try {
            const data = await getRequests(activeTab, searchQuery);
            const mapped = data.requests.map(d => ({
                id: d.id,
                requester: d.requester || d.recipient || '-',
                recipient: d.recipient || d.requester || '-',
                item: d.produit_nom,
                quantity: d.quantite,
                price: d.prix_unitaire || 0,
                type: d.type_demande === 'echange' ? `Échange${d.echange_contre ? ` contre ${d.echange_contre}` : ''}` : 'Dépannage',
                date: new Date(d.date_creation).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                dateRaw: d.date_creation,
                status: ['acceptee', 'terminee', 'compense'].includes(d.statut) ? 'Approved' : d.statut === 'refusee' ? 'Rejected' : 'Pending',
                rawStatus: d.statut,
                paymentStatus: d.statut_paiement || 'non_paye',
                // Nouvelles infos pour le bon
                requesterDetails: {
                    nom: d.requester,
                    adresse: d.requester_adresse,
                    telephone: d.requester_telephone,
                    ville: d.requester_ville,
                    quartier: d.requester_quartier,
                    responsable: d.requester_responsable
                },
                recipientDetails: {
                    nom: d.recipient,
                    adresse: d.recipient_adresse,
                    telephone: d.recipient_telephone,
                    ville: d.recipient_ville,
                    quartier: d.recipient_quartier,
                    responsable: d.recipient_responsable
                }
            }));
            setRequestsList(mapped);
            setPendingCount(data.pending_count);
        } catch (err) {
            console.error('Erreur chargement demandes:', err);
        } finally {
            setLoading(false);
        }
    }, [activeTab, searchQuery]);

    useEffect(() => {
        loadRequests();

        // Abonnement au temps réel
        const unsubscribe = realtimeService.subscribe(({ type }) => {
            if (type === 'notification') {
                // Si on reçoit une notification (souvent liée à un changement de statut de demande), on rafraîchit
                loadRequests();
            }
        });

        return () => unsubscribe();
    }, [loadRequests]);

    const handleAction = async (id, action) => {
        try {
            await updateRequestStatus(id, action);
            const actionText = action === 'acceptee' ? 'acceptée' : 'refusée';
            toast.success(`Demande ${actionText} avec succès`);
            loadRequests();
        } catch (err) {
            toast.error('Erreur: ' + err.message);
        }
    };

    const filteredRequests = requestsList.filter(req => {
        const target = activeTab === 'received' ? req.requester : req.recipient;
        return target.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.item.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return 'status-pending';
            case 'Approved': return 'status-approved';
            case 'Rejected': return 'status-rejected';
            default: return '';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'Pending': return 'En Attente';
            case 'Approved': return 'Validé';
            case 'Rejected': return 'Rejeté';
            default: return status;
        }
    };

    const [showTracking, setShowTracking] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [trackingProgress, setTrackingProgress] = useState(0);
    const [showReceipt, setShowReceipt] = useState(false);

    const handleInitPayment = async (e) => {
        e.preventDefault();
        if (!wavePhone) { toast.error('Entrez un numéro valide'); return; }
        setPaymentStep(2);
        try {
            const res = await initWavePayment(paymentRequest.id, wavePhone);
            setPaymentSession(res.data);

            // Simuler une attente de validation par l'utilisateur sur son tel (Polling fictif)
            setTimeout(async () => {
                await checkPaymentStatus(res.data.payment_id);
            }, 3000);
        } catch (err) {
            toast.error(err.message);
            setPaymentStep(1);
        }
    };

    const checkPaymentStatus = async (paymentId) => {
        try {
            const res = await verifyWavePayment(paymentId);
            if (res.data.statut === 'reussi') {
                toast.success('Paiement validé avec succès !');
                setShowPayment(false);
                loadRequests();
            } else {
                toast.error('Paiement toujours en attente ou échoué.');
                setPaymentStep(1);
            }
        } catch (err) {
            toast.error(err.message);
            setPaymentStep(1);
        }
    };

    useEffect(() => {
        if (showTracking && selectedRequest) {
            // Charger Leaflet dynamiquement
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);

            const script = document.createElement('script');
            script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
            script.async = true;
            script.onload = () => initRealMap();
            document.body.appendChild(script);

            return () => {
                if (document.head.contains(link)) document.head.removeChild(link);
                if (document.body.contains(script)) document.body.removeChild(script);
            };
        }
    }, [showTracking, selectedRequest]);

    const initRealMap = async () => {
        if (!window.L) return;
        const L = window.L;

        // Coordonnées réelles pour Abidjan (Pharmacie Adjamé vers Cocody)
        const startPos = [5.3571, -4.0189];
        const endPos = [5.3444, -3.9615];

        const mapElement = document.getElementById('tracking-map');
        if (!mapElement || mapElement._leaflet_id) return;

        // Style de carte Clair & Professionnel (Voyager)
        const map = L.map('tracking-map', {
            zoomControl: false,
            attributionControl: false
        }).setView(startPos, 14);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        const startIcon = L.divIcon({
            className: 'custom-map-marker',
            html: '<div class="marker-pin start"></div>',
            iconSize: [30, 42],
            iconAnchor: [15, 42]
        });

        const endIcon = L.divIcon({
            className: 'custom-map-marker',
            html: '<div class="marker-pin destination"></div>',
            iconSize: [30, 42],
            iconAnchor: [15, 42]
        });

        const carIcon = L.divIcon({
            className: 'car-marker',
            html: '<div class="car-wrapper"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg></div>',
            iconSize: [44, 44],
            iconAnchor: [22, 22]
        });

        L.marker(startPos, { icon: startIcon }).addTo(map);
        L.marker(endPos, { icon: endIcon }).addTo(map);

        try {
            // Récupérer le tracé réel par la route via OSRM
            const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${startPos[1]},${startPos[0]};${endPos[1]},${endPos[0]}?overview=full&geometries=geojson`);
            const data = await response.json();
            const routeCoordinates = data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);


            const carMarker = L.marker(startPos, { icon: carIcon }).addTo(map);

            // Animation le long de la route (SANS rotation)
            let step = 0;
            const totalSteps = routeCoordinates.length;
            const animationInterval = setInterval(() => {
                if (step >= totalSteps - 1) {
                    clearInterval(animationInterval);
                    setTrackingProgress(100);
                    return;
                }

                const nextP = routeCoordinates[step + 1];

                carMarker.setLatLng(nextP);
                setTrackingProgress(Math.round((step / totalSteps) * 100));

                if (step % 5 === 0) {
                    map.panTo(nextP, { animate: true, duration: 0.5 });
                }

                step++;
            }, 100);

        } catch (error) {
            console.error("Routing error:", error);
            // Fallback: ligne droite si l'API échoue
            L.polyline([startPos, endPos], { color: '#10B981', weight: 5, opacity: 0.6, dashArray: '10, 10' }).addTo(map);
        }
    };

    const openTracking = (req) => {
        setSelectedRequest(req);
        setShowTracking(true);
        setTrackingProgress(0);
    };

    const RequestSkeleton = () => (
        <div className="request-card" style={{ opacity: 0.6 }}>
            <div className="request-info">
                <div className="request-icon">
                    <Skeleton type="circle" width="40px" height="40px" />
                </div>
                <div className="request-details" style={{ flex: 1, marginLeft: '1rem' }}>
                    <Skeleton type="text" width="60%" height="1.2rem" />
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <Skeleton type="text" width="80px" />
                        <Skeleton type="text" width="100px" />
                    </div>
                </div>
            </div>
            <div className="request-actions">
                <Skeleton type="rect" width="100px" height="36px" />
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="requests-container">
                <div style={{ marginBottom: '2rem' }}>
                    <Skeleton type="text" width="300px" height="2.5rem" />
                    <Skeleton type="text" width="450px" height="1rem" style={{ marginTop: '0.5rem' }} />
                </div>
                {[1, 2, 3, 4].map(i => <RequestSkeleton key={i} />)}
            </div>
        );
    }

    return (
        <>
            {/* Modal de Paiement Wave */}
            {showPayment && paymentRequest && (
                <div className="tracking-overlay" onClick={() => setShowPayment(false)} style={{ zIndex: 1200 }}>
                    <div className="tracking-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', padding: '2rem', textAlign: 'center' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ width: '64px', height: '64px', backgroundColor: '#00c3ff', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                                <span style={{ color: 'white', fontWeight: 900, fontSize: '1.5rem' }}>w</span>
                            </div>
                            <h2 style={{ margin: 0 }}>Paiement Wave</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                Vous allez payer <strong>{paymentRequest.quantity * paymentRequest.price} FCFA</strong> à {paymentRequest.recipient} pour {paymentRequest.item}.
                            </p>
                        </div>

                        {paymentStep === 1 ? (
                            <form onSubmit={handleInitPayment}>
                                <div className="form-group" style={{ textAlign: 'left' }}>
                                    <label className="form-label">Numéro de téléphone Wave</label>
                                    <input
                                        type="tel"
                                        className="form-input"
                                        placeholder="ex: 0102030405"
                                        value={wavePhone}
                                        onChange={e => setWavePhone(e.target.value)}
                                        required
                                        style={{ fontSize: '1.2rem', padding: '1rem', textAlign: 'center', letterSpacing: '2px' }}
                                    />
                                </div>
                                <button type="submit" className="btn-save" style={{ width: '100%', backgroundColor: '#00c3ff', color: 'white' }}>
                                    Confirmer le paiement
                                </button>
                            </form>
                        ) : (
                            <div style={{ padding: '2rem 0' }}>
                                <div style={{ width: '40px', height: '40px', border: '4px solid #f3f4f6', borderTopColor: '#00c3ff', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem auto' }}></div>
                                <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Validation en cours...</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Veuillez consulter votre application Wave sur votre téléphone pour confirmer la transaction de {paymentRequest.quantity * paymentRequest.price} FCFA.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Volet modal de suivi */}
            {showTracking && selectedRequest && (
                <div className="tracking-overlay" onClick={() => setShowTracking(false)}>
                    <div className="tracking-modal" onClick={e => e.stopPropagation()}>
                        <div className="tracking-header">
                            <div>
                                <h2 style={{ margin: 0 }}>Suivi de la commande #{selectedRequest.id}</h2>
                                <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                    {selectedRequest.item} — {selectedRequest.quantity} boîtes en transit
                                </p>
                            </div>
                            <button
                                onClick={() => setShowTracking(false)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '10px' }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        <div className="tracking-content">
                            <div className="tracking-map-container">
                                <div id="tracking-map"></div>

                                <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', background: 'rgba(11, 21, 19, 0.9)', padding: '1rem', borderRadius: '1rem', backdropFilter: 'blur(10px)', border: '1px solid rgba(16, 185, 129, 0.3)', zIndex: 1000, minWidth: '200px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)' }}>Status Livraison</span>
                                        <span style={{ color: 'var(--primary)', fontWeight: 800 }}>{trackingProgress}%</span>
                                    </div>
                                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div style={{ width: `${trackingProgress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s' }}></div>
                                    </div>
                                    <div style={{ marginTop: '0.75rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                        {trackingProgress < 25 ? '📦 Préparation...' :
                                            trackingProgress < 60 ? '🚚 En route' :
                                                trackingProgress < 100 ? '📍 Proche de vous' : '✅ Arrivé !'}
                                    </div>
                                </div>
                            </div>

                            <div className="tracking-sidebar">
                                <h3 style={{ marginTop: 0 }}>Étapes de Livraison</h3>
                                <div className="status-steps">
                                    <div className={`status-step ${trackingProgress >= 0 ? 'completed' : ''}`}>
                                        <div className="step-indicator">✓</div>
                                        <div className="step-label">
                                            <h4>Commande Validée</h4>
                                            <p>La pharmacie partenaire a accepté l'offre.</p>
                                        </div>
                                    </div>
                                    <div className={`status-step ${trackingProgress >= 25 ? 'completed' : trackingProgress > 0 ? 'active' : ''}`}>
                                        <div className="step-indicator">{trackingProgress >= 25 ? '✓' : '2'}</div>
                                        <div className="step-label">
                                            <h4>Préparation du colis</h4>
                                            <p>Le lot est en cours d'emballage.</p>
                                        </div>
                                    </div>
                                    <div className={`status-step ${trackingProgress >= 60 ? 'completed' : trackingProgress > 25 ? 'active' : ''}`}>
                                        <div className="step-indicator">{trackingProgress >= 60 ? '✓' : '3'}</div>
                                        <div className="step-label">
                                            <h4>En cours de transit</h4>
                                            <p>Le livreur est en route vers votre officine.</p>
                                        </div>
                                    </div>
                                    <div className={`status-step ${trackingProgress >= 100 ? 'completed' : trackingProgress > 60 ? 'active' : ''}`}>
                                        <div className="step-indicator">{trackingProgress >= 100 ? '✓' : '4'}</div>
                                        <div className="step-label">
                                            <h4>Livraison effectuée</h4>
                                            <p>Le colis a été réceptionné et vérifié.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="tracking-footer">
                            <button className="btn-print" onClick={() => setShowReceipt(true)}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                                Générer Bon de Livraison (PDF)
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Volet modal du bon de réception */}
            {showReceipt && selectedRequest && (
                <div className="tracking-overlay" onClick={() => setShowReceipt(false)} style={{ zIndex: 1100 }}>
                    <div className="receipt-modal-content" onClick={e => e.stopPropagation()} style={{ background: 'transparent', width: 'auto', height: 'auto', overflow: 'visible' }}>
                        <div style={{ position: 'absolute', top: '20px', right: '-60px' }}>
                            <button
                                onClick={() => setShowReceipt(false)}
                                style={{ background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', cursor: 'pointer', padding: '10px', borderRadius: '50%' }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <div style={{ maxHeight: '90vh', overflowY: 'auto', borderRadius: '1.5rem' }}>
                            <Receipt data={selectedRequest} />
                        </div>
                    </div>
                </div>
            )}

            {/* Requests Header */}
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800 }}>Dépannages & Demandes</h1>
                        <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>Gérez vos interactions avec les autres pharmacies.</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="requests-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'received' ? 'active' : ''}`}
                        onClick={() => setActiveTab('received')}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Demandes Reçues (Dépannages/Échanges)
                            {pendingCount > 0 && (
                                <span style={{ backgroundColor: 'var(--primary)', color: '#022c22', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                    {pendingCount}
                                </span>
                            )}
                        </div>
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'sent' ? 'active' : ''}`}
                        onClick={() => setActiveTab('sent')}
                    >
                        Mes Demandes Envoyées
                    </button>
                </div>
            </div>

            {/* Liste des demandes */}
            <div className="requests-container">
                {filteredRequests.map(req => (
                    <div key={req.id} className="request-card">
                        <div className="request-info">
                            <div className="request-icon">
                                {activeTab === 'received' ?
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                                    :
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                                }
                            </div>

                            <div className="request-details">
                                <h3>{req.item} <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-secondary)' }}>({req.quantity} boîtes)</span></h3>
                                <div className="request-meta">
                                    <div className="request-part">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                        {activeTab === 'received' ? req.requester : req.recipient}
                                    </div>
                                    <div className="request-part">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                        {req.date}
                                    </div>
                                    <div className="request-part">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg>
                                        {req.type}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="request-actions">
                            <span className={`status-badge-lg ${getStatusStyle(req.status)}`}>
                                {getStatusText(req.status)}
                            </span>

                            {req.status === 'Approved' && (
                                <button className="btn-track" onClick={() => openTracking(req)}>
                                    Suivre
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="1" y="3" width="15" height="13"></rect>
                                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                                        <circle cx="5.5" cy="18.5" r="2.5"></circle>
                                        <circle cx="18.5" cy="18.5" r="2.5"></circle>
                                    </svg>
                                </button>
                            )}

                            {req.status === 'Approved' && activeTab === 'sent' && req.type !== 'Échange' && (
                                req.paymentStatus === 'paye' ? (
                                    <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                                        Payé
                                    </span>
                                ) : (
                                    <button
                                        className="btn-save"
                                        style={{ backgroundColor: '#00c3ff', padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                                        onClick={() => {
                                            setPaymentRequest(req);
                                            setPaymentStep(1);
                                            setWavePhone('');
                                            setShowPayment(true);
                                        }}
                                    >
                                        Payer ({req.quantity * req.price}F)
                                    </button>
                                )
                            )}

                            {req.status === 'Pending' && activeTab === 'received' && (
                                <>
                                    <button className="btn-accept" onClick={() => handleAction(req.id, 'acceptee')}>
                                        Accepter
                                    </button>
                                    <button className="btn-reject" onClick={() => handleAction(req.id, 'refusee')}>
                                        Refuser
                                    </button>
                                </>
                            )}

                            <button
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                                title="Détails / Chat"
                                onClick={() => navigate('/chat')}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                            </button>
                        </div>
                    </div>
                ))}

                {filteredRequests.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                        Aucune demande trouvée.
                    </div>
                )}
            </div>
        </>
    );
};

export default Requests;
