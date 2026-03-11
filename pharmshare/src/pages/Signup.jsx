import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../services/api';
import './Signup.css';
import { toast } from 'react-hot-toast';

const Signup = () => {
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        password: '',
        telephone: '',
        adresse: '',
        ville: 'Abidjan',
        quartier: '',
        licence_numero: '',
        responsable: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await signup(formData);
            if (res.success) {
                toast.success('Bienvenue dans le réseau PharmShare !');
                navigate('/dashboard');
            }
        } catch (err) {
            toast.error(err.message || "Erreur lors de l'inscription");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            {/* Produits médicaux en arrière-plan (structure de style réutilisée) */}
            <div className="signup-bg-effects">
                <div className="signup-product signup-pill signup-pill-1"></div>
                <div className="signup-product signup-pill signup-pill-2"></div>
                <div className="signup-product signup-capsule signup-capsule-1"></div>
                <div className="signup-product signup-tablet signup-tablet-1"></div>
            </div>

            <div className="signup-card fade-in-up">
                <div className="signup-header">
                    <Link to="/" className="signup-logo">
                        <div className="logo-icon-small">
                            <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="48" height="48" rx="12" fill="url(#signup-logo-gradient)" />
                                <path d="M7 24C7 24 12 26 17 21" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                <path d="M41 24C41 24 36 22 31 27" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                <g transform="rotate(45 24 24)">
                                    <rect x="17" y="12" width="14" height="24" rx="7" fill="#065F46" />
                                    <path d="M17 24L31 24L31 19C31 15.134 27.866 12 24 12C20.134 12 17 15.134 17 19L17 24Z" fill="white" />
                                </g>
                                <defs>
                                    <linearGradient id="signup-logo-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#10B981" />
                                        <stop offset="1" stopColor="#059669" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <span className="brand-name">Pharm<span className="brand-highlight">Share</span></span>
                    </Link>

                    <p className="signup-subtitle">
                        Rejoignez le réseau PharmShare dès aujourd'hui.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="form-sections-grid">
                        <div className="form-section">
                            <h4 className="section-title">Identité</h4>
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="nom"
                                    placeholder="Nom de la Pharmacie"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="responsable"
                                    placeholder="Nom du Responsable / Pharmacien"
                                    value={formData.responsable}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="telephone"
                                    placeholder="Téléphone"
                                    value={formData.telephone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-section">
                            <h4 className="section-title">Localisation</h4>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div className="input-group" style={{ flex: 1 }}>
                                    <input
                                        type="text"
                                        name="ville"
                                        placeholder="Ville"
                                        value={formData.ville}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="input-group" style={{ flex: 1 }}>
                                    <input
                                        type="text"
                                        name="quartier"
                                        placeholder="Quartier"
                                        value={formData.quartier}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="adresse"
                                    placeholder="Adresse complète"
                                    value={formData.adresse}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-section">
                            <h4 className="section-title">Accès & Légal</h4>
                            <div className="input-group">
                                <input
                                    type="text"
                                    name="licence_numero"
                                    placeholder="Numéro de Licence / Agrément"
                                    value={formData.licence_numero}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email professionnel"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Mot de passe"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="btn-primary btn-full" disabled={loading}>
                        {loading ? 'Création en cours...' : 'Créer un compte'}
                    </button>

                    <div className="divider">
                        <span>- ou -</span>
                    </div>

                    <button type="button" className="btn-google btn-full">
                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        S'inscrire avec Google
                    </button>

                    <div className="login-prompt">
                        Déjà un compte ? <Link to="/login">Se connecter</Link>
                    </div>
                </form>

                <div className="signup-footer">
                    <p>
                        En vous inscrivant, vous acceptez nos <a href="#">Conditions</a> et <a href="#">Politique de confidentialité</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
