const API_BASE = window.location.hostname === 'localhost'
    ? 'http://localhost/Pharmshare/api'
    : 'https://pharmshare.alwaysdata.net/api'; // Votre URL AlwaysData (beaucoup plus stable)

// ============================================================
// Utilitaires HTTP
// ============================================================

function getToken() {
    return localStorage.getItem('pharmshare_token');
}

function setToken(token) {
    localStorage.setItem('pharmshare_token', token);
}

function setUser(user) {
    localStorage.setItem('pharmshare_user', JSON.stringify(user));
}

function getUser() {
    const user = localStorage.getItem('pharmshare_user');
    return user ? JSON.parse(user) : null;
}

function clearAuth() {
    localStorage.removeItem('pharmshare_token');
    localStorage.removeItem('pharmshare_user');
}

function isAuthenticated() {
    return !!getToken();
}

async function apiRequest(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
    };

    const url = `${API_BASE}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            // Si token expiré, déconnecter
            if (response.status === 401) {
                clearAuth();
                window.location.href = '/login';
                return;
            }
            throw new Error(data.error || `Erreur ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        throw error;
    }
}

// ============================================================
// AUTH
// ============================================================

export async function login(email, password = '') {
    const res = await apiRequest('/auth/login.php', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
    if (res.success) {
        setToken(res.data.token);
        setUser(res.data.user);
    }
    return res;
}

export async function signup(userData) {
    const res = await apiRequest('/auth/signup.php', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
    if (res.success) {
        setToken(res.data.token);
        setUser(res.data.user);
    }
    return res;
}

export function logout() {
    clearAuth();
    window.location.href = '/login';
}

export { getUser, isAuthenticated, getToken };

// ============================================================
// DASHBOARD
// ============================================================

export async function getDashboard() {
    const res = await apiRequest('/dashboard/index.php');
    return res.data;
}

export async function getMatching() {
    const res = await apiRequest('/market/matching.php');
    return res.data;
}

// ============================================================
// INVENTAIRE
// ============================================================

export async function getInventory(search = '', filter = 'all') {
    const params = new URLSearchParams({ search, filter });
    const res = await apiRequest(`/inventory/index.php?${params}`);
    return res.data;
}

export async function addProduct(product) {
    const res = await apiRequest('/inventory/index.php', {
        method: 'POST',
        body: JSON.stringify(product),
    });
    return res;
}

export async function updateProduct(id, data) {
    const res = await apiRequest(`/inventory/index.php?id=${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    return res;
}

export async function deleteProduct(id) {
    const res = await apiRequest(`/inventory/index.php?id=${id}`, {
        method: 'DELETE',
    });
    return res;
}

// ============================================================
// MARCHÉ / BOURSE D'ÉCHANGE
// ============================================================

export async function getMarketItems(search = '', filter = 'all') {
    const params = new URLSearchParams({ search, filter });
    const res = await apiRequest(`/market/index.php?${params}`);
    return res.data;
}

export async function createAnnonce(annonce) {
    const res = await apiRequest('/market/index.php', {
        method: 'POST',
        body: JSON.stringify(annonce),
    });
    return res;
}

export async function deleteAnnonce(id) {
    const res = await apiRequest(`/market/index.php?id=${id}`, {
        method: 'DELETE',
    });
    return res;
}

export async function updateAnnonce(id, data) {
    const res = await apiRequest(`/market/index.php?id=${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    return res;
}

// ============================================================
// DEMANDES
// ============================================================

export async function getRequests(tab = 'received', search = '') {
    const params = new URLSearchParams({ tab, search });
    const res = await apiRequest(`/requests/index.php?${params}`);
    return res.data;
}

export async function createRequest(requestData) {
    const res = await apiRequest('/requests/index.php', {
        method: 'POST',
        body: JSON.stringify(requestData),
    });
    return res;
}

export async function updateRequestStatus(id, statut, motifRefus = '') {
    const res = await apiRequest(`/requests/index.php?id=${id}`, {
        method: 'PUT',
        body: JSON.stringify({ statut, motif_refus: motifRefus }),
    });
    return res;
}

// ============================================================
// CHAT
// ============================================================

export async function getConversations() {
    const res = await apiRequest('/chat/index.php');
    return res.data;
}

export async function getMessages(conversationId) {
    const res = await apiRequest(`/chat/index.php?conversation_id=${conversationId}`);
    return res.data;
}

export async function sendMessage(contenu, conversationId = null, partnerId = null) {
    const body = { contenu };
    if (conversationId) body.conversation_id = conversationId;
    if (partnerId) body.partner_id = partnerId;

    const res = await apiRequest('/chat/index.php', {
        method: 'POST',
        body: JSON.stringify(body),
    });
    return res;
}

export async function sendChatFile(file, conversationId = null, partnerId = null) {
    const token = getToken();
    const formData = new FormData();
    formData.append('fichier', file);
    if (conversationId) formData.append('conversation_id', conversationId);
    if (partnerId) formData.append('partner_id', partnerId);

    const response = await fetch(`${API_BASE}/chat/upload.php`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Erreur upload');
    return data;
}

// ============================================================
// NOTIFICATIONS
// ============================================================

export async function getNotifications(filter = 'all') {
    const params = new URLSearchParams({ filter });
    const res = await apiRequest(`/notifications/index.php?${params}`);
    return res.data;
}

export async function markNotificationRead(id) {
    const res = await apiRequest(`/notifications/index.php?id=${id}`, {
        method: 'PUT',
    });
    return res;
}

export async function markAllNotificationsRead() {
    const res = await apiRequest('/notifications/index.php?all=1', {
        method: 'PUT',
    });
    return res;
}

// ============================================================
// RAPPORTS
// ============================================================

export async function getReportData(type) {
    const params = type ? new URLSearchParams({ type }) : '';
    const res = await apiRequest(`/reports/index.php?${params}`);
    return res.data;
}

export async function generateReport(reportData) {
    const res = await apiRequest('/reports/index.php', {
        method: 'POST',
        body: JSON.stringify(reportData),
    });
    return res;
}

// ============================================================
// PARAMÈTRES
// ============================================================

export async function getSettings() {
    const res = await apiRequest('/settings/index.php');
    return res.data;
}

export async function getAuditLogs(limit = 50) {
    const res = await apiRequest(`/settings/audit.php?limit=${limit}`);
    return res.data;
}

export async function updateSettings(data) {
    const res = await apiRequest('/settings/index.php', {
        method: 'PUT',
        body: JSON.stringify(data),
    });
    return res;
}

// ============================================================
// GESTION DU PERSONNEL
// ============================================================

export async function getTeamUsers() {
    const res = await apiRequest('/settings/users.php');
    return res.data;
}

export async function addTeamUser(userData) {
    const res = await apiRequest('/settings/users.php', {
        method: 'POST',
        body: JSON.stringify(userData),
    });
    return res;
}

export async function deleteTeamUser(id) {
    const res = await apiRequest(`/settings/users.php?id=${id}`, {
        method: 'DELETE',
    });
    return res;
}

// ============================================================
// RECHERCHE PRODUITS
// ============================================================

export async function searchProducts(query) {
    const params = new URLSearchParams({ q: query });
    const res = await apiRequest(`/products/search.php?${params}`);
    return res.data;
}

// ============================================================
// PAIEMENTS WAVE
// ============================================================

export async function initWavePayment(demandeId, telephone) {
    const res = await apiRequest('/payments/wave.php', {
        method: 'POST',
        body: JSON.stringify({ demande_id: demandeId, telephone }),
    });
    return res;
}

export async function verifyWavePayment(paymentId) {
    const res = await apiRequest('/payments/wave.php', {
        method: 'PUT',
        body: JSON.stringify({ payment_id: paymentId }),
    });
    return res;
}
