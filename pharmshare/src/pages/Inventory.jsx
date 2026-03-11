import { useCallback, useState, useEffect } from 'react';
import { getInventory, addProduct, updateProduct, deleteProduct } from '../services/api';
import './Dashboard.css';
import './Inventory.css';
import { useSearch } from '../context/SearchContext';
import { toast } from 'react-hot-toast';
import Skeleton from '../components/Skeleton';
import PdfService from '../services/PdfService';
import ProductImage from '../components/ProductImage';

const Inventory = () => {
    const { searchQuery } = useSearch();
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        type: 'Comprimé',
        stock: '',
        minStock: '',
        expiry: '',
        image_url: ''
    });

    const [inventory, setInventory] = useState([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [counts, setCounts] = useState({ stock_low: 0, expiring: 0, out_of_stock: 0 });
    const [isGenerating, setIsGenerating] = useState(false);

    const [errors, setErrors] = useState({});

    const loadInventory = useCallback(async () => {
        try {
            const data = await getInventory(searchQuery, activeFilter);
            const mapped = data.produits.map(p => ({
                id: p.id,
                name: p.nom,
                type: p.forme || 'Comprimé',
                stock: p.stock_actuel,
                minStock: p.stock_minimum,
                expiry: p.date_expiration ? p.date_expiration.split('T')[0] : '',
                displayExpiry: p.date_expiration ? new Date(p.date_expiration).toLocaleDateString('fr-FR', { month: '2-digit', year: 'numeric' }) : '-',
                dosage: p.dosage,
                image_url: p.image_url
            }));
            setInventory(mapped);
            setCounts(data.counts);
        } catch (err) {
            console.error('Erreur chargement inventaire:', err);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, activeFilter]);

    useEffect(() => {
        loadInventory();
    }, [loadInventory]);

    const validateForm = (data) => {
        const newErrors = {};
        if (data.stock < 0) newErrors.stock = "Le stock ne peut pas être négatif.";
        if (data.minStock < 0) newErrors.minStock = "Le seuil ne peut pas être négatif.";

        if (data.expiry) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const expiryDate = new Date(data.expiry);
            if (expiryDate < today) {
                newErrors.expiry = "La date d'expiration ne peut pas être passée.";
            }
        }
        return newErrors;
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const formErrors = validateForm(newProduct);
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            // Tentative de récupération d'une image en ligne
            let finalImageUrl = null;
            try {
                toast.loading('Recherche d\'une image...', { id: 'img-fetch' });
                // LoremFlickr est souvent plus stable
                const searchTerms = `medicine,pill,pharmacy`;
                const response = await fetch(`https://loremflickr.com/320/240/${searchTerms}`);
                
                if (response.ok) {
                    finalImageUrl = response.url;
                    toast.success('Image d\'illustration trouvée', { id: 'img-fetch' });
                } else {
                    toast.dismiss('img-fetch');
                }
            } catch (e) {
                console.warn("Échec de récupération d'image en ligne:", e);
                toast.dismiss('img-fetch');
            }

            await addProduct({
                nom: newProduct.name,
                forme: newProduct.type,
                stock_actuel: parseInt(newProduct.stock),
                stock_minimum: parseInt(newProduct.minStock),
                date_expiration: newProduct.expiry || null,
                image_url: finalImageUrl
            });
            setShowAddModal(false);
            setNewProduct({ name: '', type: 'Comprimé', stock: '', minStock: '', expiry: '', image_url: '' });
            setErrors({});
            toast.success('Produit ajouté');
            loadInventory();
        } catch (err) {
            toast.error('Erreur: ' + err.message);
        }
    };

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setErrors({});
        setShowEditModal(true);
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        const formErrors = validateForm(selectedProduct);
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        try {
            await updateProduct(selectedProduct.id, {
                nom: selectedProduct.name,
                forme: selectedProduct.type,
                stock_actuel: parseInt(selectedProduct.stock),
                stock_minimum: parseInt(selectedProduct.minStock),
                date_expiration: selectedProduct.expiry || null,
                image_url: selectedProduct.image_url // On garde l'image existante
            });
            setShowEditModal(false);
            setErrors({});
            loadInventory();
            toast.success('Produit mis à jour avec succès');
        } catch (err) {
            toast.error('Erreur: ' + err.message);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Supprimer ce produit ?')) return;
        try {
            await deleteProduct(id);
            toast.success('Produit supprimé');
            loadInventory();
        } catch (err) {
            toast.error('Erreur: ' + err.message);
        }
    };

    const handleExportInventory = async () => {
        setIsGenerating(true);
        const toastId = toast.loading('Génération du PDF pour l\'inventaire...');
        try {
            await PdfService.generatePdf('inventory-table-container', `Inventaire_${new Date().toISOString().split('T')[0]}.pdf`);
            toast.success('Inventaire exporté avec succès', { id: toastId });
        } catch {
            toast.error('Erreur lors de l\'exportation PDF', { id: toastId });
        } finally {
            setIsGenerating(false);
        }
    };

    const getStatus = (stock, min) => {
        if (stock === 0) return { label: 'Rupture', class: 'stock-out' };
        if (stock <= min) return { label: 'Stock Faible', class: 'stock-low' };
        return { label: 'En Stock', class: 'stock-high' };
    };

    const filteredInventory = inventory; // Le filtrage est maintenant géré par l'API et SearchContext

    const TableSkeleton = () => (
        <tr style={{ opacity: 0.6 }}>
            <td><Skeleton type="text" width="150px" /></td>
            <td><Skeleton type="text" width="80px" /></td>
            <td><Skeleton type="text" width="50px" /></td>
            <td><Skeleton type="rect" width="60px" height="24px" /></td>
            <td><Skeleton type="text" width="80px" /></td>
            <td>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Skeleton type="circle" width="30px" height="30px" />
                    <Skeleton type="circle" width="30px" height="30px" />
                </div>
            </td>
        </tr>
    );

    if (loading) {
        return (
            <div className="inventory-container">
                <div style={{ marginBottom: '2rem' }}>
                    <Skeleton type="text" width="200px" height="2rem" />
                    <Skeleton type="text" width="400px" />
                </div>
                <div className="table-responsive">
                    <table className="inventory-table">
                        <thead>
                            <tr>
                                <th>Produit</th>
                                <th>Forme</th>
                                <th>Stock</th>
                                <th>Statut</th>
                                <th>Expiration</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5, 6].map(i => <TableSkeleton key={i} />)}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="inventory-header">
                <div>
                    <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800 }}>Mon Inventaire</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>Gérez vos stocks et suivez les péremptions.</p>
                </div>
                <div className="inventory-actions">
                    <button
                        className="btn btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        onClick={handleExportInventory}
                        disabled={isGenerating}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        {isGenerating ? 'Génération...' : 'Exporter PDF'}
                    </button>
                    <button className="btn btn-primary" onClick={() => { setShowAddModal(true); setErrors({}); }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        Ajouter Produit
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <button className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>Tout Voir</button>
                <button className={`filter-btn ${activeFilter === 'stock_low' ? 'active' : ''}`} onClick={() => setActiveFilter('stock_low')}>
                    Stocks Faibles
                    {counts.stock_low > 0 && <span style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '0 6px', borderRadius: '10px', fontSize: '0.7rem', marginLeft: '4px' }}>{counts.stock_low}</span>}
                </button>
                <button className={`filter-btn ${activeFilter === 'expiring' ? 'active' : ''}`} onClick={() => setActiveFilter('expiring')}>Péremptions Proches</button>
                <button className={`filter-btn ${activeFilter === 'out_of_stock' ? 'active' : ''}`} onClick={() => setActiveFilter('out_of_stock')}>Ruptures</button>
            </div>

            <div className="card" style={{ padding: '0' }} id="inventory-table-container">
                <div style={{ padding: '1.5rem 1.5rem 1.5rem 1.5rem' }}>
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Nom du Produit</th>
                                <th>Forme</th>
                                <th>Stock</th>
                                <th>Statut Stock</th>
                                <th>Expiration</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInventory.map(item => {
                                const status = getStatus(item.stock, item.minStock);
                                return (
                                    <tr key={item.id}>
                                        <td>
                                            <div className="product-cell-with-image">
                                                <div className="product-thumb">
                                                    <ProductImage src={item.image_url} alt={item.name} />
                                                </div>
                                                <div className="product-info">
                                                    <span className="product-name">{item.name}</span>
                                                    <span className="product-sub">REF: {item.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{item.type}</td>
                                        <td style={{ fontWeight: 600, fontSize: '1rem' }}>{item.stock}</td>
                                        <td>
                                            <span className={`stock-status ${status.class}`}>
                                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor' }}></span>
                                                {status.label}
                                            </span>
                                        </td>
                                        <td>{item.displayExpiry}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className="action-btn" title="Éditer" onClick={() => handleEditClick(item)}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                </button>
                                                <button className="action-btn delete" title="Supprimer" onClick={() => handleDeleteProduct(item.id)}>
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredInventory.length === 0 && (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>Aucun produit trouvé</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal d'ajout de produit */}
            {showAddModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Ajouter un Nouveau Produit</h3>
                            <button className="close-btn" onClick={() => setShowAddModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleAddProduct}>
                            <div className="form-group">
                                <label>Nom du Produit</label>
                                <input type="text" required value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Ex: Doliprane 1000mg" />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Type / Forme</label>
                                    <select value={newProduct.type} onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}>
                                        <option value="Comprimé">Comprimé</option>
                                        <option value="Sirop">Sirop</option>
                                        <option value="Injectable">Injectable</option>
                                        <option value="Sachet">Sachet</option>
                                        <option value="Pommade">Pommade</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Date Expiration</label>
                                    <input type="date" required value={newProduct.expiry} onChange={(e) => setNewProduct({ ...newProduct, expiry: e.target.value })} />
                                    {errors.expiry && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.expiry}</span>}
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Stock Actuel</label>
                                    <input type="number" required value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} />
                                    {errors.stock && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.stock}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Seuil d'Alerte (Min)</label>
                                    <input type="number" required value={newProduct.minStock} onChange={(e) => setNewProduct({ ...newProduct, minStock: e.target.value })} />
                                    {errors.minStock && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.minStock}</span>}
                                </div>
                            </div>
                            <div className="form-group" style={{ marginTop: '1rem' }}>
                                <label>Image du produit (URL)</label>
                                <input 
                                    type="text" 
                                    placeholder="https://exemple.com/image.jpg"
                                    value={newProduct.image_url} 
                                    onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })} 
                                />
                                <small style={{ color: 'var(--text-secondary)', fontSize: '0.7rem' }}>Laissez vide pour recherche automatique</small>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowAddModal(false)}>Annuler</button>
                                <button type="submit" className="btn btn-primary">Enregistrer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal d'édition de produit */}
            {showEditModal && selectedProduct && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Modifier le Produit</h3>
                            <button className="close-btn" onClick={() => setShowEditModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleUpdateProduct}>
                            <div className="form-group">
                                <label>Nom du Produit</label>
                                <input type="text" required value={selectedProduct.name} onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })} />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Type / Forme</label>
                                    <select value={selectedProduct.type} onChange={(e) => setSelectedProduct({ ...selectedProduct, type: e.target.value })}>
                                        <option value="Comprimé">Comprimé</option>
                                        <option value="Sirop">Sirop</option>
                                        <option value="Injectable">Injectable</option>
                                        <option value="Sachet">Sachet</option>
                                        <option value="Pommade">Pommade</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Date Expiration</label>
                                    <input type="date" required value={selectedProduct.expiry} onChange={(e) => setSelectedProduct({ ...selectedProduct, expiry: e.target.value })} />
                                    {errors.expiry && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.expiry}</span>}
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Stock Actuel</label>
                                    <input type="number" required value={selectedProduct.stock} onChange={(e) => setSelectedProduct({ ...selectedProduct, stock: e.target.value })} />
                                    {errors.stock && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.stock}</span>}
                                </div>
                                <div className="form-group">
                                    <label>Seuil d'Alerte (Min)</label>
                                    <input type="number" required value={selectedProduct.minStock} onChange={(e) => setSelectedProduct({ ...selectedProduct, minStock: e.target.value })} />
                                    {errors.minStock && <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '4px' }}>{errors.minStock}</span>}
                                </div>
                            </div>
                            <div className="form-group" style={{ marginTop: '1rem' }}>
                                <label>Image du produit (URL)</label>
                                <input 
                                    type="text" 
                                    placeholder="Lien de l'image (ex: https://...)"
                                    value={selectedProduct.image_url || ''} 
                                    onChange={(e) => setSelectedProduct({ ...selectedProduct, image_url: e.target.value })} 
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowEditModal(false)}>Annuler</button>
                                <button type="submit" className="btn btn-primary">Mettre à jour</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default Inventory;
