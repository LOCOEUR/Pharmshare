import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Utiliser un délai pour rendre asynchrone et éviter l'avertissement de rendu en cascade
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="home">
            {/* Effets d'arrière-plan */}
            <div className="bg-effects">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>

                {/* Produits médicaux */}
                <div className="medical-product pill pill-1"></div>
                <div className="medical-product pill pill-2"></div>
                <div className="medical-product pill pill-3"></div>
                <div className="medical-product capsule capsule-1"></div>
                <div className="medical-product capsule capsule-2"></div>
                <div className="medical-product bottle bottle-1"></div>
                <div className="medical-product bottle bottle-2"></div>
                <div className="medical-product tablet tablet-1"></div>
                <div className="medical-product tablet tablet-2"></div>
                <div className="medical-product tablet tablet-3"></div>
            </div>

            {/* Navigation */}
            <nav className={`navbar ${isVisible ? 'fade-in' : ''}`}>
                <div className="container nav-container">
                    <div className="logo">
                        <div className="logo-icon">
                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="48" height="48" rx="12" fill="url(#header-logo-gradient)" />
                                {/* Volutes */}
                                <path d="M7 24C7 24 12 26 17 21" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                <path d="M41 24C41 24 36 22 31 27" stroke="white" strokeWidth="3" strokeLinecap="round" />

                                {/* Pilule */}
                                <g transform="rotate(45 24 24)">
                                    <rect x="17" y="12" width="14" height="24" rx="7" fill="#065F46" />
                                    <path d="M17 24L31 24L31 19C31 15.134 27.866 12 24 12C20.134 12 17 15.134 17 19L17 24Z" fill="white" />
                                </g>

                                <defs>
                                    <linearGradient id="header-logo-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#10B981" />
                                        <stop offset="1" stopColor="#059669" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>
                        <div className="logo-text-group">
                            <div className="logo-main-text">
                                <span className="text-primary">Pharm</span>
                                <span className="text-highlight">Share</span>
                            </div>
                            <span className="logo-tagline">FAITES LE CHOIX DE L'ÉCHANGE SOLIDAIRE</span>
                        </div>
                    </div>

                    <div className="nav-links">
                        <a href="#features">Fonctionnalités</a>
                        <a href="#solutions">Solutions</a>
                        <a href="#about">À propos</a>
                        <a href="#pricing">Tarifs</a>
                    </div>

                    <div className="nav-actions">
                        <Link to="/login" className="btn-secondary">Connexion</Link>
                        <Link to="/signup" className="btn-primary">Rejoindre</Link>
                    </div>
                </div>
            </nav>

            {/* Section Hero */}
            <section className="hero">
                <div className="container hero-container">
                    <div className="hero-content">
                        <div className={`hero-text ${isVisible ? 'fade-in-up' : ''}`}>
                            <h1>
                                Optimisez Vos Stocks Pharmaceutiques{' '}
                                <span className="text-gradient">
                                    En Un Clic
                                </span>
                            </h1>
                            <p className="hero-description">
                                Rejoignez le réseau collaboratif qui révolutionne la gestion des surplus pharmaceutiques.
                                Réduisez le gaspillage, optimisez vos stocks et contribuez à un système de santé plus durable.
                            </p>
                            <div className="hero-cta">
                                <button className="btn-primary btn-large" onClick={() => navigate('/signup')}>
                                    Rejoignez-nous Maintenant !
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                                <button className="btn-secondary btn-large" onClick={() => window.open('https://wa.me/2250564762911', '_blank')}>
                                    Contactez-nous
                                </button>
                            </div>

                            <div className="hero-stats">
                                <div className="stat-item">
                                    <div className="stat-value">500+</div>
                                    <div className="stat-label">Pharmacies</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-value">2M€</div>
                                    <div className="stat-label">Économisés</div>
                                </div>
                                <div className="stat-item">
                                    <div className="stat-value">98%</div>
                                    <div className="stat-label">Satisfaction</div>
                                </div>
                            </div>
                        </div>

                        {/* Visualisation du réseau animé */}
                        <div className={`hero-visual ${isVisible ? 'fade-in' : ''}`}>
                            <div className="network-container">
                                <div className="center-stat">
                                    <div className="stat-number">20k+</div>
                                    <div className="stat-text">Pharmaciens</div>
                                </div>

                                {/* Avatars en orbite */}
                                <div className="orbit orbit-1">
                                    <div className="avatar avatar-1">
                                        <div className="avatar-inner"></div>
                                    </div>
                                </div>
                                <div className="orbit orbit-2">
                                    <div className="avatar avatar-2">
                                        <div className="avatar-inner"></div>
                                    </div>
                                    <div className="avatar avatar-3">
                                        <div className="avatar-inner"></div>
                                    </div>
                                </div>
                                <div className="orbit orbit-3">
                                    <div className="avatar avatar-4">
                                        <div className="avatar-inner"></div>
                                    </div>
                                    <div className="avatar avatar-5">
                                        <div className="avatar-inner"></div>
                                    </div>
                                    <div className="avatar avatar-6">
                                        <div className="avatar-inner"></div>
                                    </div>
                                </div>

                                {/* Étiquettes flottantes */}
                                <div className="name-tag tag-1">Pharmacie quartier Ebrie</div>
                                <div className="name-tag tag-2">Pharmacie des lagunes</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Partenaires */}
            <section className="partners">
                <div className="container">
                    <div className="partners-grid">
                        <div className="partner-logo">PharmaCare</div>
                        <div className="partner-logo">MediStock</div>
                        <div className="partner-logo">HealthPlus</div>
                        <div className="partner-logo">VitaPharm</div>
                        <div className="partner-logo">WellnessRx</div>
                    </div>
                </div>
            </section>

            {/* Section Fonctionnalités */}
            <section className="features" id="features">
                <div className="container">
                    <div className="section-header">
                        <h2>
                            Fonctionnalités <span className="text-gradient">Puissantes</span>
                        </h2>
                        <p className="section-description">
                            Tout ce dont vous avez besoin pour optimiser vos stocks pharmaceutiques
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card glass-card">
                            <div className="feature-icon">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                    <path d="M20 5L5 12.5V20C5 30 12.5 37.5 20 40C27.5 37.5 35 30 35 20V12.5L20 5Z" fill="url(#icon-gradient-1)" opacity="0.2" />
                                    <path d="M20 5L5 12.5V20C5 30 12.5 37.5 20 40C27.5 37.5 35 30 35 20V12.5L20 5Z" stroke="url(#icon-gradient-1)" strokeWidth="2" />
                                    <defs>
                                        <linearGradient id="icon-gradient-1" x1="5" y1="5" x2="35" y2="40">
                                            <stop stopColor="#14B8A6" />
                                            <stop offset="1" stopColor="#10B981" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <h3>Sécurité Maximale</h3>
                            <p>Vos données sont cryptées et protégées selon les normes RGPD et HIPAA</p>
                        </div>

                        <div className="feature-card glass-card">
                            <div className="feature-icon">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                    <circle cx="20" cy="20" r="15" fill="url(#icon-gradient-2)" opacity="0.2" />
                                    <path d="M20 8V20L28 24" stroke="url(#icon-gradient-2)" strokeWidth="2" strokeLinecap="round" />
                                    <circle cx="20" cy="20" r="15" stroke="url(#icon-gradient-2)" strokeWidth="2" />
                                    <defs>
                                        <linearGradient id="icon-gradient-2" x1="5" y1="5" x2="35" y2="35">
                                            <stop stopColor="#10B981" />
                                            <stop offset="1" stopColor="#14B8A6" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <h3>Temps Réel</h3>
                            <p>Synchronisation instantanée des stocks et notifications en temps réel</p>
                        </div>

                        <div className="feature-card glass-card">
                            <div className="feature-icon">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                    <rect x="8" y="12" width="24" height="20" rx="2" fill="url(#icon-gradient-3)" opacity="0.2" />
                                    <rect x="8" y="12" width="24" height="20" rx="2" stroke="url(#icon-gradient-3)" strokeWidth="2" />
                                    <path d="M14 20H26M14 24H22" stroke="url(#icon-gradient-3)" strokeWidth="2" strokeLinecap="round" />
                                    <defs>
                                        <linearGradient id="icon-gradient-3" x1="8" y1="12" x2="32" y2="32">
                                            <stop stopColor="#34D399" />
                                            <stop offset="1" stopColor="#14B8A6" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <h3>Gestion Intelligente</h3>
                            <p>IA pour prédire les besoins et optimiser automatiquement vos stocks</p>
                        </div>

                        <div className="feature-card glass-card">
                            <div className="feature-icon">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                    <circle cx="12" cy="20" r="4" fill="url(#icon-gradient-4)" opacity="0.2" />
                                    <circle cx="28" cy="20" r="4" fill="url(#icon-gradient-4)" opacity="0.2" />
                                    <circle cx="20" cy="10" r="4" fill="url(#icon-gradient-4)" opacity="0.2" />
                                    <path d="M12 20C12 20 16 14 20 14C24 14 28 20 28 20M16 20L24 20" stroke="url(#icon-gradient-4)" strokeWidth="2" strokeLinecap="round" />
                                    <defs>
                                        <linearGradient id="icon-gradient-4" x1="8" y1="6" x2="32" y2="24">
                                            <stop stopColor="#14B8A6" />
                                            <stop offset="1" stopColor="#34D399" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <h3>Réseau Collaboratif</h3>
                            <p>Connectez-vous avec des milliers de pharmacies partenaires</p>
                        </div>

                        <div className="feature-card glass-card">
                            <div className="feature-icon">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                    <path d="M10 30L20 10L30 30H10Z" fill="url(#icon-gradient-5)" opacity="0.2" />
                                    <path d="M10 30L20 10L30 30H10Z" stroke="url(#icon-gradient-5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M20 18V24M20 26V27" stroke="url(#icon-gradient-5)" strokeWidth="2" strokeLinecap="round" />
                                    <defs>
                                        <linearGradient id="icon-gradient-5" x1="10" y1="10" x2="30" y2="30">
                                            <stop stopColor="#10B981" />
                                            <stop offset="1" stopColor="#14B8A6" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <h3>Alertes Péremption</h3>
                            <p>Notifications automatiques pour éviter les pertes de produits</p>
                        </div>

                        <div className="feature-card glass-card">
                            <div className="feature-icon">
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                    <rect x="8" y="8" width="24" height="24" rx="4" fill="url(#icon-gradient-6)" opacity="0.2" />
                                    <rect x="8" y="8" width="24" height="24" rx="4" stroke="url(#icon-gradient-6)" strokeWidth="2" />
                                    <path d="M16 20L19 23L24 17" stroke="url(#icon-gradient-6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <defs>
                                        <linearGradient id="icon-gradient-6" x1="8" y1="8" x2="32" y2="32">
                                            <stop stopColor="#34D399" />
                                            <stop offset="1" stopColor="#10B981" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            </div>
                            <h3>Conformité Garantie</h3>
                            <p>Respect total des réglementations pharmaceutiques françaises</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Comment ça marche */}
            <section className="how-it-works">
                <div className="container">
                    <div className="section-header">
                        <h2>
                            Comment <span className="text-gradient">Ça Marche</span>
                        </h2>
                        <p className="section-description">
                            Trois étapes simples pour commencer à optimiser vos stocks
                        </p>
                    </div>

                    <div className="steps-container">
                        <div className="step">
                            <div className="step-number">01</div>
                            <div className="step-content">
                                <h3>Créez Votre Compte</h3>
                                <p>Inscription gratuite en moins de 2 minutes. Vérification rapide de vos credentials.</p>
                            </div>
                        </div>

                        <div className="step-connector"></div>

                        <div className="step">
                            <div className="step-number">02</div>
                            <div className="step-content">
                                <h3>Listez Vos Surplus</h3>
                                <p>Ajoutez vos produits excédentaires avec dates de péremption et quantités disponibles.</p>
                            </div>
                        </div>

                        <div className="step-connector"></div>

                        <div className="step">
                            <div className="step-number">03</div>
                            <div className="step-content">
                                <h3>Échangez & Économisez</h3>
                                <p>Trouvez des partenaires, échangez vos stocks et réduisez le gaspillage instantanément.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Témoignages */}
            <section className="testimonials">
                <div className="container">
                    <div className="section-header">
                        <h2>
                            Ils Nous Font <span className="text-gradient">Confiance</span>
                        </h2>
                        <p className="section-description">
                            Découvrez ce que nos utilisateurs disent de PharmShare
                        </p>
                    </div>

                    <div className="testimonials-grid">
                        <div className="testimonial-card glass-card">
                            <div className="stars">★★★★★</div>
                            <p className="testimonial-text">
                                "PharmShare a transformé notre gestion de stocks. Nous avons réduit nos pertes de 40% en seulement 3 mois !"
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar"></div>
                                <div className="author-info">
                                    <div className="author-name">Dr. Sophie Martin</div>
                                    <div className="author-role">Pharmacie la Me, Abobo</div>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-card glass-card">
                            <div className="stars">★★★★★</div>
                            <p className="testimonial-text">
                                "L'interface est intuitive et le réseau collaboratif est incroyable. Je recommande à tous mes collègues !"
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar"></div>
                                <div className="author-info">
                                    <div className="author-name">Marc Dubois</div>
                                    <div className="author-role">Pharmacie Santé Plus, william-ville</div>
                                </div>
                            </div>
                        </div>

                        <div className="testimonial-card glass-card">
                            <div className="stars">★★★★★</div>
                            <p className="testimonial-text">
                                "Enfin une solution moderne pour gérer les surplus. Le ROI a été immédiat pour notre groupe de pharmacies."
                            </p>
                            <div className="testimonial-author">
                                <div className="author-avatar"></div>
                                <div className="author-info">
                                    <div className="author-name">Claire Rousseau</div>
                                    <div className="author-role">Directrice, Groupe PharmaCare</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section CTA */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-content glass-card">
                        <h2>Prêt à Optimiser Vos Stocks ?</h2>
                        <p>Rejoignez plus de 500 pharmacies qui font déjà confiance à PharmShare</p>
                        <div className="cta-buttons">
                            <button className="btn-primary btn-large" onClick={() => navigate('/signup')}>
                                Rejoignez-nous Maintenant !
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button className="btn-secondary btn-large" onClick={() => window.open('https://wa.me/2250564762911', '_blank')}>Nous Contacter</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <div className="logo">
                                <div className="logo-icon">
                                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="48" height="48" rx="12" fill="url(#footer-logo-gradient)" />
                                        {/* Swirls */}
                                        <path d="M7 24C7 24 12 26 17 21" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                        <path d="M41 24C41 24 36 22 31 27" stroke="white" strokeWidth="3" strokeLinecap="round" />

                                        {/* Pill */}
                                        <g transform="rotate(45 24 24)">
                                            <rect x="17" y="12" width="14" height="24" rx="7" fill="#065F46" />
                                            <path d="M17 24L31 24L31 19C31 15.134 27.866 12 24 12C20.134 12 17 15.134 17 19L17 24Z" fill="white" />
                                        </g>
                                        <defs>
                                            <linearGradient id="footer-logo-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="#10B981" />
                                                <stop offset="1" stopColor="#059669" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                                <div className="logo-text-group">
                                    <div className="logo-main-text">
                                        <span className="text-primary">Pharm</span>
                                        <span className="text-highlight">Share</span>
                                    </div>
                                    <span className="logo-tagline">FAITES LE CHOIX DE L'ÉCHANGE SOLIDAIRE</span>
                                </div>
                            </div>
                            <p className="footer-description">
                                La plateforme collaborative pour l'optimisation des stocks pharmaceutiques.
                            </p>
                        </div>

                        <div className="footer-section">
                            <h4>Produit</h4>
                            <ul>
                                <li><a href="#features">Fonctionnalités</a></li>
                                <li><a href="#solutions">Solutions</a></li>
                                <li><a href="#pricing">Tarifs</a></li>
                                <li><a href="#demo">Démo</a></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4>Entreprise</h4>
                            <ul>
                                <li><a href="#about">À propos</a></li>
                                <li><a href="#blog">Blog</a></li>
                                <li><a href="#careers">Carrières</a></li>
                                <li><a href="#contact">Contact</a></li>
                            </ul>
                        </div>

                        <div className="footer-section">
                            <h4>Légal</h4>
                            <ul>
                                <li><a href="#privacy">Confidentialité</a></li>
                                <li><a href="#terms">Conditions</a></li>
                                <li><a href="#security">Sécurité</a></li>
                                <li><a href="#compliance">Conformité</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="footer-bottom">
                        <p>&copy; 2026 PharmShare. Tous droits réservés.</p>
                        <div className="social-links">
                            <a href="#" aria-label="LinkedIn">LinkedIn</a>
                            <a href="#" aria-label="Twitter">Twitter</a>
                            <a href="#" aria-label="Facebook">Facebook</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
