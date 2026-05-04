import React from 'react';
import { Link } from 'react-router-dom';
import './Legal.css';

const Terms = () => {
    return (
        <div className="legal-container">
            <header className="legal-header">
                <Link to="/" className="legal-logo">
                    <span className="brand-name">Pharm<span className="brand-highlight">Share</span></span>
                </Link>
                <h1>Conditions Générales d'Utilisation</h1>
                <p className="last-updated">Dernière mise à jour : 22 Avril 2026</p>
            </header>

            <main className="legal-content">
                <section>
                    <h2>1. Préambule</h2>
                    <p>
                        PharmShare est une plateforme numérique dédiée exclusivement aux professionnels de la pharmacie. 
                        Elle a pour objet de faciliter la gestion du surplus de stocks médicaux entre officines autorisées. 
                        L'utilisation de la plateforme implique l'acceptation sans réserve des présentes conditions.
                    </p>
                </section>

                <section>
                    <h2>2. Accès et Éligibilité</h2>
                    <p>
                        L'accès à PharmShare est strictement réservé aux pharmacies dument enregistrées et autorisées par les autorités sanitaires compétentes. 
                        Chaque compte fait l'objet d'une validation manuelle par l'administration après vérification du numéro de licence. 
                        L'utilisateur s'engage à fournir des informations exactes et à jour.
                    </p>
                </section>

                <section>
                    <h2>3. Nature des Échanges</h2>
                    <p>
                        La plateforme permet la déclaration de surplus et la mise en relation pour le transfert de stocks. 
                        Les produits échangés doivent impérativement :
                    </p>
                    <ul>
                        <li>Être issus de circuits de distribution officiels.</li>
                        <li>Bénéficier d'une traçabilité complète.</li>
                        <li>Avoir une date de péremption supérieure à 3 mois au moment de l'annonce.</li>
                        <li>Être conservés selon les normes pharmaceutiques en vigueur.</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Responsabilités</h2>
                    <p>
                        PharmShare agit en tant qu'intermédiaire technique. La responsabilité de la qualité médicale, de l'intégrité du produit 
                        et du respect de la chaîne du froid incombe exclusivement à la pharmacie émettrice. 
                        PharmShare ne saurait être tenue pour responsable en cas de litige sur la qualité des produits transférés.
                    </p>
                </section>

                <section>
                    <h2>5. Sécurité et Confidentialité</h2>
                    <p>
                        Les utilisateurs sont responsables de la sécurité de leurs identifiants. Toute activité suspecte doit être signalée 
                        immédiatement à l'administration de PharmShare. La plateforme se réserve le droit de suspendre tout compte 
                        contrevenant aux règles de déontologie pharmaceutique.
                    </p>
                </section>

                <section>
                    <h2>6. Droit Applicable</h2>
                    <p>
                        Les présentes conditions sont régies par la législation en vigueur relative à l'exercice de la pharmacie 
                        et au commerce électronique. Tout litige sera soumis aux tribunaux compétents.
                    </p>
                </section>
            </main>

            <footer className="legal-footer">
                <Link to="/signup" className="btn-back">Retour à l'inscription</Link>
            </footer>
        </div>
    );
};

export default Terms;
