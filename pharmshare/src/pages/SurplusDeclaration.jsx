import { useState } from 'react';
import { searchProducts, createAnnonce } from '../services/api';
import './Dashboard.css';
import './SurplusDeclaration.css';
import { toast } from 'react-hot-toast';

const SurplusDeclaration = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [formData, setFormData] = useState({
        type: 'vente', // 'vente' ou 'recherche'
        quantity: '',
        expiry: '',
        batch: '',
        price: '',
        notes: '',
        legalConsent: false
    });

    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSearch = async (e) => {
        const q = e.target.value;
        setSearchQuery(q);
        if (q.length > 2) {
            try {
                const data = await searchProducts(q);
                setSearchResults(data.map(p => ({
                    id: p.id,
                    name: p.nom,
                    form: p.forme || 'Comprimé',
                    dosage: p.dosage,
                    stock: p.stock_actuel,
                    expiry: p.date_expiration
                })));
                setShowResults(true);
            } catch (err) {
                console.error('Erreur recherche:', err);
            }
        } else {
            setShowResults(false);
        }
    };

    const selectProduct = (prod) => {
        setSelectedProduct(prod);
        setSearchQuery(prod.name);
        setShowResults(false);
        if (prod.expiry) {
            setFormData(prev => ({ ...prev, expiry: prod.expiry }));
        }
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (formData.quantity < 0) newErrors.quantity = "La quantité ne peut pas être négative.";
        if (formData.quantity > 3) newErrors.quantity = "La quantité est limitée à 3 boîtes (dépannage confraternel).";
        if (formData.type === 'vente' && formData.price < 0) newErrors.price = "Le prix ne peut pas être négatif.";

        if (formData.expiry) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const expiryDate = new Date(formData.expiry);
            if (expiryDate < today) {
                newErrors.expiry = "La date d'expiration ne peut pas être passée.";
            }
        }
        if (!formData.legalConsent) {
            newErrors.legalConsent = "Vous devez accepter les conditions légales de cession confraternelle.";
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const titre = selectedProduct?.name || searchQuery;
        if (!titre || !titre.trim()) {
            toast.error('Veuillez saisir le nom du produit');
            return;
        }

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setFormSubmitted(true);
        try {
            const payload = {
                produit_id: selectedProduct?.id || null,
                titre: titre.trim(),
                description: formData.notes || null,
                type_annonce: formData.type,
                quantite: parseInt(formData.quantity) || 0,
                prix_unitaire: formData.type === 'vente' ? (formData.price ? parseFloat(formData.price) : null) : null,
                date_expiration: formData.expiry || null,
                numero_lot: formData.batch || null
            };

            await createAnnonce(payload);

            toast.success('Déclaration de surplus soumise avec succès !');

            // Réinitialisation du formulaire
            setFormData({
                type: 'vente',
                quantity: '',
                expiry: '',
                batch: '',
                condition: 'new',
                price: '',
                notes: '',
                legalConsent: false
            });
            setErrors({});
            setSelectedProduct(null);
            setSearchQuery('');
            setShowResults(false);
        } catch (err) {
            console.error('Erreur submission:', err);
            toast.error('Erreur: ' + (err.message || 'Impossible de publier l\'annonce'));
        } finally {
            setFormSubmitted(false);
        }
    };

    return (
        <>
            <div className="surplus-container">
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800 }}>Déclaration de Surplus</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>Proposez en dépannage ou échangez vos stocks excédentaires avant péremption.</p>
                </div>

                <div className="surplus-info-box">
                    <div className="info-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    </div>
                    <div className="info-text" style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                            <button
                                type="button"
                                className={`btn ${formData.type === 'vente' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setFormData(prev => ({ ...prev, type: 'vente' }))}
                                style={{ flex: 1 }}
                            >
                                Je propose un dépannage
                            </button>
                            <button
                                type="button"
                                className={`btn ${formData.type === 'recherche' ? 'btn-primary' : 'btn-outline'}`}
                                onClick={() => setFormData(prev => ({ ...prev, type: 'recherche' }))}
                                style={{ flex: 1 }}
                            >
                                Je recherche un produit
                            </button>
                        </div>
                        <h4>{formData.type === 'vente' ? 'Pourquoi proposer un dépannage ?' : 'Pourquoi déclarer un besoin ?'}</h4>
                        <p>
                            {formData.type === 'vente'
                                ? 'Permet aux autres pharmacies de récupérer vos stocks (cession à prix grossiste ou échange) pour éviter les pertes.'
                                : 'Alertez le réseau de vos ruptures pour que vos confrères puissent vous dépanner rapidement.'}
                        </p>
                    </div>
                </div>

                <form className="surplus-card" onSubmit={handleSubmit}>
                    <div className="search-product-box">
                        <label className="form-label">Rechercher le produit (DCI ou Nom Commercial)</label>
                        <input
                            className="form-input"
                            placeholder="ex: Doliprane, Amoxicilline..."
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        {showResults && (
                            <div className="search-results">
                                {searchResults.map(res => (
                                    <div
                                        key={res.id}
                                        className="search-result-item"
                                        onClick={() => selectProduct(res)}
                                    >
                                        <span style={{ color: 'var(--text-primary)' }}>{res.name}</span>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{res.form}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {selectedProduct && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <span className="preview-tag">Produit Sélectionné: {selectedProduct.name}</span>
                            <span className="preview-tag">Forme: {selectedProduct.form}</span>
                        </div>
                    )}

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Quantité (Boîtes)</label>
                            <input
                                type="number"
                                className="form-input"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleFormChange}
                                placeholder="ex: 3 (max 3)"
                                min="1"
                                max="3"
                                required
                            />
                            {errors.quantity && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.quantity}</span>}
                        </div>
                        <div className="form-group">
                            <label className="form-label">Date d'Expiration</label>
                            <input
                                type="date"
                                className="form-input"
                                name="expiry"
                                value={formData.expiry}
                                onChange={handleFormChange}
                                required
                            />
                            {errors.expiry && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.expiry}</span>}
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label">Numéro de Lot</label>
                            <input
                                type="text"
                                className="form-input"
                                name="batch"
                                value={formData.batch}
                                onChange={handleFormChange}
                                placeholder="ex: AB12345"
                                required
                            />
                        </div>
                        {formData.type === 'vente' && (
                            <div className="form-group">
                                <label className="form-label">Valeur de Compensation (Prix Grossiste FCFA)</label>
                                <input
                                    type="number"
                                    className="form-input"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleFormChange}
                                    placeholder="ex: 1500"
                                    required
                                />
                                {errors.price && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.price}</span>}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Notes ou Conditions</label>
                        <textarea
                            className="form-input"
                            rows="3"
                            name="notes"
                            value={formData.notes}
                            onChange={handleFormChange}
                            placeholder="ex: Boîtes neuves, scellées. À récupérer sur place."
                        ></textarea>
                    </div>

                    <div className="form-group" style={{ backgroundColor: 'rgba(52, 211, 153, 0.1)', padding: '1rem', borderRadius: '0.5rem', border: '1px solid rgba(52, 211, 153, 0.3)', marginBottom: '1.5rem' }}>
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            <input
                                type="checkbox"
                                name="legalConsent"
                                checked={formData.legalConsent}
                                onChange={handleFormChange}
                                style={{ marginTop: '0.2rem', accentColor: 'var(--primary)' }}
                            />
                            <span>
                                <strong style={{color: 'var(--text-primary)'}}>Engagement Déontologique :</strong> Je certifie que cette transaction relève du dépannage confraternel exceptionnel. Je m'engage à respecter les bonnes pratiques de conservation jusqu'au transfert au confrère. (Conformité AIRP)
                            </span>
                        </label>
                        {errors.legalConsent && <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px', marginLeft: '1.5rem' }}>{errors.legalConsent}</div>}
                    </div>

                    <button
                        type="submit"
                        className="btn-submit-surplus"
                        disabled={formSubmitted || (!selectedProduct && !searchQuery.trim())}
                        style={{ opacity: (formSubmitted || (!selectedProduct && !searchQuery.trim())) ? 0.7 : 1, backgroundColor: formData.type === 'recherche' ? '#3b82f6' : 'var(--primary)' }}
                    >
                        {formSubmitted ? 'Publication...' : (formData.type === 'vente' ? 'Publier le Dépannage' : 'Publier le Besoin')}
                    </button>
                </form>
            </div>
        </>
    );
};

export default SurplusDeclaration;
