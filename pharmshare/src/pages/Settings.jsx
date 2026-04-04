import { useCallback, useState, useEffect } from 'react';
import { getTeamUsers, addTeamUser, deleteTeamUser, getUser, updateSettings, getAuditLogs } from '../services/api';
import './Dashboard.css';
import './Settings.css';
import { toast } from 'react-hot-toast';

const Settings = () => {
    const currentUser = getUser();
    const [theme, setTheme] = useState(document.body.classList.contains('light-mode') ? 'light' : 'dark');
    const [activeSection, setActiveSection] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [team, setTeam] = useState([]);
    const [newUser, setNewUser] = useState({ nom: '', email: '', password: '', role: 'auxilliaire' });
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
    const [auditLogs, setAuditLogs] = useState([]);

    // Simulation des préférences enregistrées
    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        push: true,
        market: true
    });

    const [profile, setProfile] = useState({
        firstName: currentUser?.nom ? currentUser.nom.split(' ')[0] : '',
        lastName: currentUser?.nom && currentUser.nom.split(' ').length > 1 ? currentUser.nom.substring(currentUser.nom.indexOf(' ') + 1) : '',
        email: currentUser?.email || '',
        phone: currentUser?.telephone || currentUser?.pharmacie_telephone || '',
        pharmacyName: currentUser?.pharmacie_nom || '',
        role: currentUser?.role || ''
    });

    const fetchTeam = useCallback(async () => {
        try {
            const data = await getTeamUsers();
            setTeam(data);
        } catch (err) {
            console.error('Erreur chargement personnel:', err);
        }
    }, []);

    useEffect(() => {
        if (activeSection === 'team' && ['admin', 'pharmacien'].includes(currentUser?.role)) {
            fetchTeam();
        }
        if (activeSection === 'audit' && ['admin', 'pharmacien'].includes(currentUser?.role)) {
            loadAuditLogs();
        }
    }, [activeSection, currentUser?.role, fetchTeam]);

    const loadAuditLogs = async () => {
        try {
            const data = await getAuditLogs(50);
            setAuditLogs(data);
        } catch (err) {
            console.error('Erreur audit:', err);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addTeamUser(newUser);
            setNewUser({ nom: '', email: '', password: '', role: 'auxilliaire' });
            fetchTeam();
            toast.success('Employé ajouté avec succès !');
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Supprimer cet accès ?')) {
            try {
                await deleteTeamUser(id);
                toast.success('Accès supprimé');
                fetchTeam();
            } catch (err) {
                toast.error(err.message);
            }
        }
    };

    // Simulation du changement de thème
    const toggleTheme = () => {
        document.body.classList.toggle('light-mode');
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    // Simulation de l'activation/désactivation des notifications
    const toggleNotification = (type) => {
        setNotifications(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    // Simulation des modifications de formulaire
    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateProfile = async () => {
        try {
            await updateSettings({
                user_nom: `${profile.firstName} ${profile.lastName}`.trim(),
                user_email: profile.email,
                telephone: profile.phone
            });
            // Update local user if needed
            const user = JSON.parse(localStorage.getItem('pharmshare_user') || '{}');
            user.nom = `${profile.firstName} ${profile.lastName}`.trim();
            user.email = profile.email;
            localStorage.setItem('pharmshare_user', JSON.stringify(user));

            toast.success('Profil mis à jour avec succès !');
        } catch (err) {
            toast.error(`Erreur: ${err.message}`);
        }
    };

    const handleUpdatePharmacy = async () => {
        try {
            await updateSettings({
                nom: profile.pharmacyName
            });

            // Update local user if needed
            const user = JSON.parse(localStorage.getItem('pharmshare_user') || '{}');
            user.pharmacie_nom = profile.pharmacyName;
            localStorage.setItem('pharmshare_user', JSON.stringify(user));

            toast.success("Informations de l'officine mises à jour !");
        } catch (err) {
            toast.error(`Erreur: ${err.message}`);
        }
    };

    const handleUpdatePassword = async () => {
        if (!passwords.current || !passwords.new || !passwords.confirm) {
            toast.error('Veuillez remplir tous les champs de mot de passe.');
            return;
        }
        if (passwords.new !== passwords.confirm) {
            toast.error('Les nouveaux mots de passe ne correspondent pas.');
            return;
        }
        try {
            await updateSettings({
                current_password: passwords.current,
                new_password: passwords.new
            });
            toast.success('Mot de passe mis à jour avec succès !');
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (err) {
            toast.error(`Erreur: ${err.message}`);
        }
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.')) {
            toast.error('Fonctionnalité en cours de développement.');
        }
    };

    return (
        <>
            {/* Settings Content */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800 }}>Paramètres</h1>
                <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>Gérez votre compte, vos préférences et la sécurité.</p>
            </div>

            <div className="settings-layout">
                {/* Floating Settings Menu */}
                <div className="settings-sidebar">
                    <div
                        className={`settings-nav-item ${activeSection === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveSection('profile')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        Profil
                    </div>
                    {['admin', 'pharmacien'].includes(currentUser?.role) && (
                        <div
                            className={`settings-nav-item ${activeSection === 'pharmacy' ? 'active' : ''}`}
                            onClick={() => setActiveSection('pharmacy')}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3zM12 8v8m-4-4h8" /></svg>
                            Ma Pharmacie
                        </div>
                    )}
                    <div
                        className={`settings-nav-item ${activeSection === 'notifications' ? 'active' : ''}`}
                        onClick={() => setActiveSection('notifications')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                        Notifications
                    </div>
                    <div
                        className={`settings-nav-item ${activeSection === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveSection('security')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        Sécurité
                    </div>
                    <div
                        className={`settings-nav-item ${activeSection === 'appearance' ? 'active' : ''}`}
                        onClick={() => setActiveSection('appearance')}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                        Apparence
                    </div>
                    {['admin', 'pharmacien'].includes(currentUser?.role) && (
                        <>
                            <div
                                className={`settings-nav-item ${activeSection === 'team' ? 'active' : ''}`}
                                onClick={() => setActiveSection('team')}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                Personnel
                            </div>
                            <div
                                className={`settings-nav-item ${activeSection === 'audit' ? 'active' : ''}`}
                                onClick={() => setActiveSection('audit')}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                Journal d'Audit
                            </div>
                        </>
                    )}
                </div>

                {/* Active Section Content */}
                <div className="settings-content">
                    {activeSection === 'profile' && (
                        <div className="settings-section">
                            <div className="settings-section-header">
                                <h2 className="settings-section-title">Profil Pharmacien</h2>
                                <p className="settings-section-desc">Mettez à jour vos informations personnelles.</p>
                            </div>
                            <div className="profile-photo-section">
                                <div className="profile-photo-large">
                                    DK
                                </div>
                                <div className="photo-actions">
                                    <button className="btn-upload" onClick={() => toast('Fonctionnalité en cours de développement', { icon: '📸' })}>Changer la photo</button>
                                    <button className="btn-remove" onClick={() => toast('Photo supprimée')}>Supprimer</button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Nom Complet</label>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <input className="form-input" name="firstName" value={profile.firstName} onChange={handleProfileChange} />
                                    <input className="form-input" name="lastName" value={profile.lastName} onChange={handleProfileChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Professionnel</label>
                                <input className="form-input" name="email" value={profile.email} onChange={handleProfileChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Téléphone</label>
                                <input className="form-input" name="phone" value={profile.phone} onChange={handleProfileChange} />
                            </div>
                            <button className="btn-save" onClick={handleUpdateProfile}>Enregistrer les modifications</button>
                        </div>
                    )}

                    {activeSection === 'pharmacy' && ['admin', 'pharmacien'].includes(currentUser?.role) && (
                        <div className="settings-section">
                            <div className="settings-section-header">
                                <h2 className="settings-section-title">Informations de l'Officine</h2>
                                <p className="settings-section-desc">Gérez les détails de votre pharmacie visibles sur le réseau.</p>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Nom de la Pharmacie</label>
                                <input className="form-input" name="pharmacyName" value={profile.pharmacyName} onChange={handleProfileChange} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Numéro d'Agrément</label>
                                <input className="form-input" name="license" value={profile.license} disabled style={{ opacity: 0.7, cursor: 'not-allowed' }} />
                                <small style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>Contactez le support pour modifier l'agrément.</small>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Adresse / Localisation</label>
                                <input className="form-input" placeholder="Commune, Quartier, Rue..." />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Horaires d'Ouverture</label>
                                <input className="form-input" placeholder="ex: Lun-Sam 08h-20h (Garde Dimanche)" />
                            </div>
                            <button className="btn-save" onClick={handleUpdatePharmacy}>Mettre à jour l'officine</button>

                            {/* EXtENSION WAVE (Hérité de l'UML) */}
                            <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                <div className="settings-section-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <h3 className="settings-section-title" style={{ fontSize: '1.25rem' }}>Configuration de Paiement (Wave)</h3>
                                        <span style={{ fontSize: '0.65rem', background: 'rgba(250, 204, 21, 0.15)', color: '#facc15', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(250, 204, 21, 0.3)' }}>EXTENSION</span>
                                    </div>
                                    <p className="settings-section-desc">Associez un compte de paiement Mobile Money pour recevoir les fonds des dépannages confraternels.</p>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Numéro de téléphone / Compte Marchand Wave</label>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <div style={{ position: 'relative', flex: 1 }}>
                                            <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 'bold', color: '#3b82f6' }}>🌊</span>
                                            <input className="form-input" placeholder="+225 0102030405" style={{ paddingLeft: '2.5rem' }} defaultValue={profile.waveAccount} />
                                        </div>
                                        <button className="btn-save" style={{ background: '#3b82f6', whiteSpace: 'nowrap' }} onClick={(e) => { e.preventDefault(); toast.success("Le compte de paiement Wave a été validé et configuré avec succès !"); }}>Lier le compte</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'notifications' && (
                        <div className="settings-section">
                            <div className="settings-section-header">
                                <h2 className="settings-section-title">Préférences de Notification</h2>
                                <p className="settings-section-desc">Choisissez comment vous souhaitez être alerté.</p>
                            </div>
                            <div className="toggle-row">
                                <div className="toggle-info">
                                    <h4>Notifications Email</h4>
                                    <p>Recevoir un résumé quotidien et les alertes importantes.</p>
                                </div>
                                <div
                                    className={`toggle-switch ${notifications.email ? 'checked' : ''}`}
                                    onClick={() => toggleNotification('email')}
                                >
                                    <div className="toggle-thumb"></div>
                                </div>
                            </div>
                            <div className="toggle-row">
                                <div className="toggle-info">
                                    <h4>Alertes SMS</h4>
                                    <p>Pour les demandes urgentes et les ruptures critiques.</p>
                                </div>
                                <div
                                    className={`toggle-switch ${notifications.sms ? 'checked' : ''}`}
                                    onClick={() => toggleNotification('sms')}
                                >
                                    <div className="toggle-thumb"></div>
                                </div>
                            </div>
                            <div className="toggle-row">
                                <div className="toggle-info">
                                    <h4>Notifications Push</h4>
                                    <p>Alertes en temps réel sur le navigateur/mobile.</p>
                                </div>
                                <div
                                    className={`toggle-switch ${notifications.push ? 'checked' : ''}`}
                                    onClick={() => toggleNotification('push')}
                                >
                                    <div className="toggle-thumb"></div>
                                </div>
                            </div>
                            <div className="toggle-row">
                                <div className="toggle-info">
                                    <h4>Alertes Bourse d'Échange</h4>
                                    <p>Savoir quand un confrère recherche vos produits.</p>
                                </div>
                                <div
                                    className={`toggle-switch ${notifications.market ? 'checked' : ''}`}
                                    onClick={() => toggleNotification('market')}
                                >
                                    <div className="toggle-thumb"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'security' && (
                        <div className="settings-section">
                            <div className="settings-section-header">
                                <h2 className="settings-section-title">Sécurité & Confidentialité</h2>
                                <p className="settings-section-desc">Protégez votre compte et vos données.</p>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Changer le mot de passe</label>
                                <input className="form-input" type="password" placeholder="Mot de passe actuel" style={{ marginBottom: '0.5rem' }} value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} />
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <input className="form-input" type="password" placeholder="Nouveau mot de passe" value={passwords.new} onChange={(e) => setPasswords({ ...passwords, new: e.target.value })} />
                                    <input className="form-input" type="password" placeholder="Confirmer nouveau mot de passe" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} />
                                </div>
                            </div>
                            <button className="btn-save" onClick={handleUpdatePassword}>Mettre à jour mot de passe</button>

                            <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                                <h3 style={{ color: '#f87171', marginTop: 0 }}>Zone de Danger</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Une fois votre compte supprimé, il n'y a pas de retour en arrière.</p>
                                <button onClick={handleDeleteAccount} style={{ backgroundColor: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 600, marginTop: '1rem' }}>
                                    Supprimer mon compte
                                </button>
                            </div>
                        </div>
                    )}
                    {activeSection === 'appearance' && (
                        <div className="settings-section">
                            <div className="settings-section-header">
                                <h2 className="settings-section-title">Apparence</h2>
                                <p className="settings-section-desc">Personnalisez l'affichage de l'application.</p>
                            </div>
                            <div className="toggle-row">
                                <div className="toggle-info">
                                    <h4>Mode Clair / Sombre</h4>
                                    <p>Basculez entre le mode clair et le mode sombre pour toute l'application.</p>
                                </div>
                                <div
                                    className={`toggle-switch ${theme === 'light' ? 'checked' : ''}`}
                                    onClick={toggleTheme}
                                >
                                    <div className="toggle-thumb"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'team' && ['admin', 'pharmacien'].includes(currentUser?.role) && (
                        <div className="settings-section">
                            <div className="settings-section-header">
                                <h2 className="settings-section-title">Gestion du Personnel</h2>
                                <p className="settings-section-desc">Ajoutez ou supprimez les accès de vos employés.</p>
                            </div>

                            <form onSubmit={handleAddUser} className="add-user-form" style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                                <h3 style={{ marginTop: 0, fontSize: '1.1rem' }}>Ajouter un employé</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                                    <input className="form-input" placeholder="Nom complet" value={newUser.nom} onChange={e => setNewUser({ ...newUser, nom: e.target.value })} required />
                                    <input className="form-input" placeholder="Email" type="email" value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} required />
                                    <input className="form-input" placeholder="Mot de passe" type="password" value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} required />
                                    <select className="form-input" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                                        <option value="pharmacien">Pharmacien Titulaire</option>
                                        <option value="auxilliaire">Auxilliaire</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn-save" style={{ marginTop: '1rem' }} disabled={loading}>
                                    {loading ? 'Ajout...' : 'Ajouter l\'employé'}
                                </button>
                            </form>

                            <div className="team-list">
                                <h3 style={{ fontSize: '1.1rem' }}>Liste du personnel</h3>
                                {team.length === 0 ? (
                                    <p style={{ color: 'var(--text-secondary)' }}>Aucun autre employé enregistré.</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem' }}>
                                        {team.map(user => (
                                            <div key={user.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                        {user.nom.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 600 }}>{user.nom}</div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                            {user.email} • {user.role === 'pharmacien' ? 'Pharmacien Titulaire' : 'Auxilliaire'}
                                                        </div>
                                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                                                            {user.derniere_connexion
                                                                ? `Dernière connexion : ${new Date(user.derniere_connexion).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`
                                                                : 'Jamais connecté'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '0.5rem' }}
                                                    title="Supprimer l'accès"
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeSection === 'audit' && ['admin', 'pharmacien'].includes(currentUser?.role) && (
                        <div className="settings-section">
                            <div className="settings-section-header">
                                <h2 className="settings-section-title">Journal d'Audit</h2>
                                <p className="settings-section-desc">Historique des actions importantes effectuées par votre équipe sur la plateforme.</p>
                            </div>

                            <div className="audit-list">
                                {auditLogs.length === 0 ? (
                                    <p style={{ color: 'var(--text-secondary)' }}>Aucune action enregistrée pour le moment.</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                        {auditLogs.map(log => (
                                            <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: 'var(--bg-card)', borderRadius: '0.75rem', border: '1px solid var(--border)' }}>
                                                <div style={{
                                                    width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                                                }}>
                                                    {log.user_nom?.charAt(0) || 'U'}
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                                                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{log.action}</span>
                                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                                            {new Date(log.date_creation).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                                        Par <strong>{log.user_nom}</strong> ({log.user_role})
                                                    </div>
                                                    {log.details && (
                                                        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', padding: '0.5rem', backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: '0.5rem' }}>
                                                            {typeof log.details === 'object' ? JSON.stringify(log.details) : log.details}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Settings;
