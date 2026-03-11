import { useCallback, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getConversations, getMessages, sendMessage, sendChatFile, getUser } from '../services/api';
import './Dashboard.css';
import './Chat.css';
import realtimeService from '../services/RealtimeService';
import { toast } from 'react-hot-toast';
import Skeleton from '../components/Skeleton';

const Chat = () => {
    const location = useLocation();
    const currentUser = getUser();
    const currentPharmacyId = currentUser?.pharmacie_id;
    const [searchQuery] = useState('');
    const [activeChat, setActiveChat] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [filterStatus, setFilterStatus] = useState('active');
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);
    const compressedFileRef = useRef(null); // fichier compressé prêt à l'emploi
    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost/Pharmshare/api' : '';

    const loadConversations = useCallback(async () => {
        try {
            const data = await getConversations();
            setConversations(data.map(c => ({
                id: c.id,
                name: c.partner_nom,
                transactionRef: c.produit_nom ? `#${c.produit_nom}` : 'Discussion directe',
                lastMessage: c.dernier_message || 'Pas de message',
                time: c.date_dernier_message ? new Date(c.date_dernier_message).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                unread: parseInt(c.non_lus || 0),
                online: false,
                status: 'active',
                avatarCheck: c.partner_nom.substring(0, 2).toUpperCase(),
                partnerId: c.partner_id
            })));
        } catch (err) {
            console.error('Erreur chargement convs:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    const loadMessages = useCallback(async (convId) => {
        if (!convId) return;
        try {
            const data = await getMessages(convId);
            setMessages(data.map(m => ({
                id: m.id,
                text: m.contenu,
                sender: parseInt(m.expediteur_id) === parseInt(currentPharmacyId) ? 'me' : 'them',
                time: new Date(m.date_envoi).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                fichierUrl: m.fichier_url || null,
                fichierType: m.fichier_type || null,
                lu: parseInt(m.lu) === 1,   // true = message lu par le destinataire
            })));
        } catch (err) {
            console.error('Erreur chargement messages:', err);
        }
    }, [currentPharmacyId]);

    const scrollToBottom = useCallback(() => {
        const chatWindow = document.querySelector('.chat-messages');
        if (chatWindow) {
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    }, []);

    useEffect(() => {
        loadConversations();
    }, [loadConversations]);

    useEffect(() => {
        if (activeChat) {
            loadMessages(activeChat);
        }

        // Abonnement au temps réel
        const unsubscribe = realtimeService.subscribe(({ type, data }) => {
            if (type === 'message') {
                // Si le message appartient à la conversation active, on recharge les messages
                if (activeChat && parseInt(data.conversation_id) === parseInt(activeChat)) {
                    loadMessages(activeChat);
                }
                // Dans tous les cas, on recharge les conversations pour mettre à jour la liste (aperçu, badges)
                loadConversations();
            }
        });

        return () => unsubscribe();
    }, [activeChat, loadMessages, loadConversations]);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    const startNewChat = useCallback((partnerId) => {
        const existing = conversations.find(c => String(c.partnerId) === String(partnerId));
        if (existing) {
            setActiveChat(existing.id);
        } else {
            // S'il n'existe pas, il sera créé au premier message
        }
    }, [conversations]);

    useEffect(() => {
        // Gérer le chat direct depuis le marché ou les requêtes
        const searchParams = new URLSearchParams(location.search);
        const partnerId = searchParams.get('partner');
        if (partnerId) {
            startNewChat(partnerId);
        }
    }, [location.search, startNewChat]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!messageInput.trim() && !selectedFile) return;

        let partnerId = null;
        if (!activeChat) {
            const searchParams = new URLSearchParams(location.search);
            partnerId = searchParams.get('partner');
        }

        // --- Envoi texte ---
        if (messageInput.trim()) {
            const textToSend = messageInput;
            setMessageInput('');
            // Optimiste : on ajoute le message texte immédiatement
            const tempId = 'temp_' + Date.now();
            setMessages(prev => [...prev, {
                id: tempId,
                text: textToSend,
                sender: 'me',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                fichierUrl: null,
                fichierType: null,
                lu: false,
                sending: true  // en cours d'envoi
            }]);
            try {
                await sendMessage(textToSend, activeChat, partnerId);
                loadMessages(activeChat);
            } catch (err) {
                toast.error('Erreur envoi message: ' + err.message);
                setMessages(prev => prev.filter(m => m.id !== tempId));
            }
        }

        // --- Envoi fichier ---
        if (selectedFile) {
            const file = selectedFile;
            const preview = filePreview;
            const isImage = file.type.startsWith('image/');
            setSelectedFile(null);
            setFilePreview(null);

            // Optimiste : afficher immédiatement avec l'URL blob locale
            const tempFileId = 'tempfile_' + Date.now();
            const blobUrl = preview || null;
            setMessages(prev => [...prev, {
                id: tempFileId,
                text: isImage ? '' : '📎 ' + file.name,
                sender: 'me',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                fichierUrl: blobUrl,
                fichierType: isImage ? 'image' : 'document',
                uploading: true,
                lu: false,
                sending: true
            }]);

            try {
                // Utiliser le fichier déjà compressé (prêt depuis la sélection)
                // Si pas encore prêt (sélection très rapide), on attend juste un instant
                const fileToUpload = compressedFileRef.current || (isImage ? await compressImage(file, 1200, 0.82) : file);
                compressedFileRef.current = null;

                setUploading(true);
                const res = await sendChatFile(fileToUpload, activeChat, partnerId);
                setUploading(false);

                // Remplacer l'URL blob par l'URL serveur définitive
                const serverUrl = res.data?.fichier_url;
                if (serverUrl) {
                    setMessages(prev => prev.map(m =>
                        m.id === tempFileId
                            ? { ...m, fichierUrl: serverUrl, uploading: false }
                            : m
                    ));
                    if (blobUrl) URL.revokeObjectURL(blobUrl);
                } else {
                    loadMessages(activeChat);
                }
            } catch (err) {
                toast.error('Erreur upload: ' + err.message);
                setUploading(false);
                setMessages(prev => prev.filter(m => m.id !== tempFileId));
            }
        }
    };

    // Compression d'image côté client via Canvas
    const compressImage = (file, maxPx = 1200, quality = 0.82) => {
        return new Promise((resolve) => {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = () => {
                let { width, height } = img;
                if (width > maxPx || height > maxPx) {
                    if (width > height) { height = Math.round(height * maxPx / width); width = maxPx; }
                    else { width = Math.round(width * maxPx / height); height = maxPx; }
                }
                const canvas = document.createElement('canvas');
                canvas.width = width; canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                canvas.toBlob(blob => {
                    URL.revokeObjectURL(url);
                    resolve(new File([blob], file.name, { type: 'image/jpeg' }));
                }, 'image/jpeg', quality);
            };
            img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
            img.src = url;
        });
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSelectedFile(file);
        compressedFileRef.current = null; // reset

        if (file.type.startsWith('image/')) {
            // Aperçu instantané
            const blobUrl = URL.createObjectURL(file);
            setFilePreview(blobUrl);

            // Compression en arrière-plan pendant que l'utilisateur lit son message
            compressImage(file, 1200, 0.82).then(compressed => {
                compressedFileRef.current = compressed;
            });
        } else {
            setFilePreview(null);
            compressedFileRef.current = file; // pas de compression pour les documents
        }
        // Réinitialiser l'input pour permettre de resélectionner le même fichier
        e.target.value = '';
    };

    const currentChatUser = conversations.find(c => c.id === activeChat);

    if (loading) {
        return (
            <div className="chat-container">
                <div className="chat-sidebar-column">
                    <div className="chat-list">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="chat-item" style={{ opacity: 0.6 }}>
                                <Skeleton type="circle" width="40px" height="40px" />
                                <div className="chat-info" style={{ flex: 1, marginLeft: '1rem' }}>
                                    <Skeleton type="text" width="60%" />
                                    <Skeleton type="text" width="40%" height="0.8rem" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chat-window">
                    <div className="empty-chat-state">
                        <Skeleton type="circle" width="64px" height="64px" />
                        <Skeleton type="text" width="200px" height="1.5rem" style={{ marginTop: '1rem' }} />
                        <Skeleton type="text" width="300px" style={{ marginTop: '0.5rem' }} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', margin: 0, fontWeight: 800 }}>Messagerie</h1>
                    <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>Discutez de vos échanges avec vos collègues.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-card)', padding: '0.25rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
                    <button onClick={() => setFilterStatus('active')} className={`filter-btn ${filterStatus === 'active' ? 'active' : ''}`} style={{ padding: '0.5rem 1rem', border: 'none', background: 'none' }}>En cours</button>
                    <button onClick={() => setFilterStatus('archived')} className={`filter-btn ${filterStatus === 'archived' ? 'active' : ''}`} style={{ padding: '0.5rem 1rem', border: 'none', background: 'none' }}>Archivées</button>
                </div>
            </div>

            <div className="chat-container">
                <div className="chat-sidebar-column">
                    <div className="chat-list">
                        {conversations.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(conv => (
                            <div key={conv.id} className={`chat-item ${activeChat === conv.id ? 'active' : ''}`} onClick={() => setActiveChat(conv.id)}>
                                <div className="chat-avatar">{conv.avatarCheck}</div>
                                <div className="chat-info">
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="chat-name">{conv.name}</span><span className="chat-time">{conv.time}</span></div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>{conv.transactionRef}</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span className="chat-preview">{conv.lastMessage}</span>
                                        {conv.unread > 0 && <span className="unread-badge">{conv.unread}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {conversations.length === 0 && (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Aucune conversation</div>
                        )}
                    </div>
                </div>

                <div className="chat-window">
                    {activeChat || (new URLSearchParams(location.search)).get('partner') ? (
                        <>
                            <div className="chat-header">
                                <div className="chat-header-user">
                                    <div className="chat-avatar" style={{ width: '40px', height: '40px' }}>{currentChatUser?.avatarCheck || '??'}</div>
                                    <div>
                                        <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{currentChatUser?.name || 'Nouveau Contact'}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{currentChatUser?.transactionRef || 'Discussion directe'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="chat-messages">
                                {messages.map(msg => (
                                    <div key={msg.id} className={`message ${msg.sender === 'me' ? 'sent' : 'received'}`}>
                                        {/* Image */}
                                        {msg.fichierUrl && msg.fichierType === 'image' && (
                                            <div style={{ position: 'relative' }}>
                                                <img
                                                    src={msg.fichierUrl.startsWith('blob:') ? msg.fichierUrl : `${API_BASE.replace('/api', '')}${msg.fichierUrl}`}
                                                    alt="Pièce jointe"
                                                    style={{ maxWidth: '220px', maxHeight: '220px', borderRadius: '0.75rem', display: 'block', marginBottom: '0.4rem', cursor: msg.uploading ? 'default' : 'pointer', opacity: msg.uploading ? 0.6 : 1, transition: 'opacity 0.3s' }}
                                                    onClick={() => !msg.uploading && window.open(msg.fichierUrl.startsWith('blob:') ? msg.fichierUrl : `${API_BASE.replace('/api', '')}${msg.fichierUrl}`, '_blank')}
                                                />
                                                {msg.uploading && (
                                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <div style={{ width: '28px', height: '28px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {/* Document */}
                                        {msg.fichierUrl && msg.fichierType === 'document' && (
                                            <a
                                                href={msg.fichierUrl.startsWith('blob:') ? '#' : `${API_BASE.replace('/api', '')}${msg.fichierUrl}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', background: 'rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'inherit', textDecoration: 'none', marginBottom: '0.4rem', fontSize: '0.85rem', opacity: msg.uploading ? 0.6 : 1 }}
                                            >
                                                {msg.uploading
                                                    ? <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                                                    : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                                }
                                                {msg.uploading ? 'Envoi en cours...' : 'Télécharger le document'}
                                            </a>
                                        )}
                                        {/* Texte */}
                                        {!(msg.fichierUrl && (msg.text === '' || msg.text === '📷 Photo' || msg.text?.startsWith('📎 '))) && msg.text}
                                        {/* Footer : heure + coches style WhatsApp */}
                                        <span className="message-time" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                            {msg.time}
                                            {msg.sender === 'me' && (
                                                <span style={{ display: 'inline-flex', marginLeft: '2px' }}>
                                                    {msg.sending ? (
                                                        // Sablier (en cours d'envoi)
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 3h14M5 21h14M6 3v5l6 5-6 5v3M18 3v5l-6 5 6 5v3"/></svg>
                                                    ) : msg.lu ? (
                                                        // Deux coches bleues = LU
                                                        <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                                                            <path d="M1 5.5L5 9.5L11 3" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M5 5.5L9 9.5L15 3" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    ) : (
                                                        // Deux coches grises = ENVOYÉ mais non lu
                                                        <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
                                                            <path d="M1 5.5L5 9.5L11 3" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M5 5.5L9 9.5L15 3" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>
                                                    )}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <form className="chat-input-area" onSubmit={handleSendMessage}>
                                {/* Barre de prévisualisation fichier */}
                                {selectedFile && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', background: 'rgba(16,185,129,0.08)', borderRadius: '0.75rem', marginBottom: '0.5rem', border: '1px solid rgba(16,185,129,0.2)' }}>
                                        {filePreview ? (
                                            <img src={filePreview} alt="preview" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '0.5rem' }} />
                                        ) : (
                                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                                        )}
                                        <span style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{selectedFile.name}</span>
                                        <button type="button" onClick={() => { setSelectedFile(null); setFilePreview(null); }} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: '4px' }}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                        </button>
                                    </div>
                                )}
                                <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*,.pdf,.doc,.docx" onChange={handleFileSelect} />
                                <button
                                    type="button"
                                    title="Joindre un fichier"
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0 0.5rem', flexShrink: 0 }}
                                >
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                                </button>
                                <textarea
                                    className="chat-input"
                                    placeholder="Écrivez votre message..."
                                    rows="1"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); } }}
                                ></textarea>
                                <button type="submit" className="btn-send" disabled={uploading}>
                                    {uploading ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="empty-chat-state">
                            <div style={{ marginBottom: '1rem', color: 'var(--primary)', opacity: 0.5 }}>
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                            </div>
                            <h3>Vos Messages</h3>
                            <p>Sélectionnez une conversation pour commencer à discuter.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Chat;
