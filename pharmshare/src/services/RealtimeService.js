/**
 * RealtimeService - Gère la connexion SSE pour les notifications et le chat
 */
class RealtimeService {
    constructor() {
        this.eventSource = null;
        this.listeners = new Set();
        this.token = localStorage.getItem('pharmshare_token');
    }

    start() {
        if (this.eventSource) return;
        if (!this.token) {
            console.error('RealtimeService: Aucun token trouvé');
            return;
        }

        // URL du stream SSE (on passe le token car EventSource ne supporte pas les headers)
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost/Pharmshare/api';
        const url = `${baseUrl}/notifications/stream.php?token=${encodeURIComponent(this.token)}`;

        this.eventSource = new EventSource(url);

        // Écoute des notifications
        this.eventSource.addEventListener('notification', (event) => {
            const data = JSON.parse(event.data);
            this.broadcast('notification', data);
        });

        // Écoute des messages de chat
        this.eventSource.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            this.broadcast('message', data);
        });

        this.eventSource.onerror = (err) => {
            console.error('RealtimeService SSE Error:', err);
            this.eventSource.close();
            this.eventSource = null;
            // Reconnexion automatique après 5 secondes
            setTimeout(() => this.start(), 5000);
        };
    }

    stop() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
    }

    /**
     * Permet à un composant de s'abonner à un type d'événement
     */
    subscribe(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    broadcast(type, data) {
        this.listeners.forEach(callback => callback({ type, data }));

        // Notification système (Browser Notification) si supporté
        if (type === 'notification' && Notification.permission === 'granted') {
            new Notification(data.titre, { body: data.message });
        }
    }
}

const realtimeService = new RealtimeService();
export default realtimeService;
