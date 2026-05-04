import React from 'react';
import { Link } from 'react-router-dom';
import './Legal.css';

const Privacy = () => {
    return (
        <div className="legal-container">
            <header className="legal-header">
                <Link to="/" className="legal-logo">
                    <span className="brand-name">Pharm<span className="brand-highlight">Share</span></span>
                </Link>
                <h1>Politique de Confidentialité</h1>
                <p className="last-updated">Dernière mise à jour : 22 Avril 2026</p>
            </header>

            <main className="legal-content">
                <section>
                    <h2>1. Collecte des Données</h2>
                    <p>
                        Dans le cadre de son activité, PharmShare collecte des informations strictement professionnelles : 
                        nom de l'officine, numéro de licence, coordonnées du pharmacien titulaire, adresse email et position géographique (GPS).
                        Ces données sont indispensables au fonctionnement du réseau de surplus.
                    </p>
                </section>

                <section>
                    <h2>2. Utilisation de la Géolocalisation</h2>
                    <p>
                        La géolocalisation de votre pharmacie est utilisée exclusivement pour calculer la distance vous séparant 
                        des annonces de surplus disponibles sur le marché. Cette donnée permet d'optimiser la logistique 
                        de transfert entre officines de proximité.
                    </p>
                </section>

                <section>
                    <h2>3. Partage des Informations</h2>
                    <p>
                        Vos informations de contact ne sont visibles que par les autres membres certifiés de la plateforme 
                        lorsqu'une mise en relation est initiée pour un échange de produits. PharmShare ne vend, 
                        ne loue, ni ne cède aucune donnée à des tiers à des fins commerciales.
                    </p>
                </section>

                <section>
                    <h2>4. Protection des Données</h2>
                    <p>
                        Nous appliquons des mesures de sécurité techniques et organisationnelles rigoureuses pour protéger 
                        vos données contre tout accès non autorisé. Les mots de passe sont hachés et les communications 
                        sont sécurisées par protocole SSL.
                    </p>
                </section>

                <section>
                    <h2>5. Vos Droits</h2>
                    <p>
                        Conformément aux lois sur la protection des données personnelles, vous disposez d'un droit d'accès, 
                        de rectification et de suppression de vos informations. Vous pouvez exercer ce droit directement 
                        depuis vos paramètres de compte ou en contactant notre support technique.
                    </p>
                </section>

                <section>
                    <h2>6. Cookies</h2>
                    <p>
                        PharmShare utilise des cookies techniques nécessaires à la session de connexion et à la sécurité. 
                        Aucun cookie de traçage publicitaire n'est utilisé sur notre plateforme.
                    </p>
                </section>
            </main>

            <footer className="legal-footer">
                <Link to="/signup" className="btn-back">Retour à l'inscription</Link>
            </footer>
        </div>
    );
};

export default Privacy;
