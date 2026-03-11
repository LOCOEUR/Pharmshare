import { useState } from 'react';
import './Dashboard.css';

const Help = () => {
    // FAQ Data
    const faqs = [
        {
            question: "Comment échanger des médicaments ?",
            answer: "Pour proposer un échange, rendez-vous dans la section 'Bourse d'Échange', sélectionnez un produit disponible et cliquez sur 'Proposer un échange'. Vous pourrez ensuite discuter des modalités avec la pharmacie concernée via la messagerie."
        },
        {
            question: "Comment déclarer un surplus ?",
            answer: "Utilisez le bouton 'Déclarer Surplus' dans la barre latérale. Remplissez le formulaire avec les détails du médicament (nom, quantité, date d'expiration) pour qu'il soit visible par les autres pharmacies."
        },
        {
            question: "Comment contacter le support technique ?",
            answer: "Vous pouvez nous envoyer un message direct via le formulaire de contact ci-dessous ou nous appeler au numéro d'assistance affiché en bas de page."
        },
        {
            question: "Mes données sont-elles sécurisées ?",
            answer: "Oui, PharmShare utilise un chiffrement pour toutes vos données et transactions. Seuls les professionnels de santé vérifiés ont accès à la plateforme."
        }
    ];

    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', margin: '0 0 1rem 0', fontWeight: 800 }}>Centre d'Aide</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Comment pouvons-nous vous aider aujourd'hui ?</p>
            </div>

            <div className="help-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ width: '48px', height: '48px', margin: '0 auto 1rem auto', color: 'var(--primary)', backgroundColor: 'var(--app-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Gestion de Stock</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Apprenez à gérer votre inventaire et déclarer vos surplus.</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ width: '48px', height: '48px', margin: '0 auto 1rem auto', color: 'var(--primary)', backgroundColor: 'var(--app-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Échanges</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Guide complet sur la bourse d'échange et les transactions.</p>
                </div>
                <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ width: '48px', height: '48px', margin: '0 auto 1rem auto', color: 'var(--primary)', backgroundColor: 'var(--app-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    </div>
                    <h3 style={{ margin: '0 0 0.5rem 0' }}>Support</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Besoin d'aide supplémentaire ? Contactez notre équipe.</p>
                </div>
            </div>

            <div className="faq-section">
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Questions Fréquentes</h2>
                {faqs.map((faq, index) => (
                    <div key={index} className="faq-item" style={{ marginBottom: '1rem', border: '1px solid var(--border)', borderRadius: '0.5rem', overflow: 'hidden' }}>
                        <button
                            onClick={() => toggleFaq(index)}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: 'var(--bg-card)',
                                border: 'none',
                                cursor: 'pointer',
                                textAlign: 'left',
                                color: 'var(--text-primary)',
                                fontWeight: 600,
                                fontSize: '1rem'
                            }}
                        >
                            {faq.question}
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                style={{ transform: openFaq === index ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                            >
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>
                        {openFaq === index && (
                            <div style={{ padding: '1rem', backgroundColor: 'var(--app-bg)', color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center', padding: '2rem', background: 'linear-gradient(135deg, #047857 0%, #064E3B 100%)', color: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(6, 78, 59, 0.3)' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: 'white' }}>Vous ne trouvez pas votre réponse ?</h3>
                <p style={{ margin: '0 0 1.5rem 0', opacity: 0.9 }}>Notre équipe de support est disponible 24/7 pour vous assister.</p>
                <button className="btn" style={{ backgroundColor: 'white', color: '#064E3B', border: 'none', fontWeight: 600, padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}>
                    Contactez-nous
                </button>
            </div>
        </div>
    );
};

export default Help;
