<?php
/**
 * Real-time Notification Stream (SSE)
 * GET /api/notifications/stream.php
 */
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');
header('X-Accel-Buffering: no'); // Désactiver le tampon (important pour Nginx/Apache)

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

// Authentification via Token (puisqu'EventSource ne permet pas facilement les headers, on passe par ?token=)
$token = $_GET['token'] ?? null;
if (!$token) {
    echo "event: error\ndata: {\"message\": \"Token requis\"}\n\n";
    exit;
}

// Simulation simple de getAuthenticatedPharmacieId() à partir du token
try {
    $payload = verifyToken($token); 
    if (!$payload) {
        echo "event: error\ndata: {\"message\": \"Token invalide\"}\n\n";
        exit;
    }
    $pharmacieId = $payload['pharmacie_id'];
} catch (Exception $e) {
    echo "event: error\ndata: {\"message\": \"Token invalide\"}\n\n";
    exit;
}

$db = (new Database())->getConnection();

// On garde trace de la dernière notification vue
$lastNotificationId = (int)($_GET['last_id'] ?? 0);
if ($lastNotificationId === 0) {
    // Initialisation au dernier ID actuel pour ne pas spammer tout l'historique au refresh
    $stmt = $db->prepare("SELECT MAX(id) FROM notifications WHERE pharmacie_id = :pid");
    $stmt->execute(['pid' => $pharmacieId]);
    $lastNotificationId = (int)$stmt->fetchColumn();
}

// On garde trace du dernier message vu pour le chat
$lastMessageId = (int)($_GET['last_msg_id'] ?? 0);
if ($lastMessageId === 0) {
    $stmt = $db->prepare("
        SELECT MAX(m.id) FROM messages m
        JOIN conversations c ON m.conversation_id = c.id
        WHERE c.pharmacie_1_id = :p1 OR c.pharmacie_2_id = :p2
    ");
    $stmt->execute(['p1' => $pharmacieId, 'p2' => $pharmacieId]);
    $lastMessageId = (int)$stmt->fetchColumn();
}

// Boucle infinie
while (true) {
    if (connection_aborted()) break;

    // 1. Vérifier les nouvelles notifications
    $stmt = $db->prepare("
        SELECT * FROM notifications 
        WHERE pharmacie_id = :pid AND id > :last_id 
        ORDER BY id ASC 
        LIMIT 10
    ");
    $stmt->execute(['pid' => $pharmacieId, 'last_id' => $lastNotificationId]);
    $newNotifs = $stmt->fetchAll();

    foreach ($newNotifs as $notif) {
        echo "event: notification\n";
        echo "data: " . json_encode($notif) . "\n\n";
        $lastNotificationId = max($lastNotificationId, (int)$notif['id']);
    }

    // 2. Vérifier les nouveaux messages (pour le refresh instantané du chat)
    $stmt = $db->prepare("
        SELECT m.* FROM messages m
        JOIN conversations c ON m.conversation_id = c.id
        WHERE (c.pharmacie_1_id = :p1 OR c.pharmacie_2_id = :p2) 
        AND m.id > :last_msg_id 
        AND m.expediteur_id != :me
        ORDER BY m.id ASC
    ");
    $stmt->execute(['p1' => $pharmacieId, 'p2' => $pharmacieId, 'last_msg_id' => $lastMessageId, 'me' => $pharmacieId]);
    $newMsgs = $stmt->fetchAll();

    foreach ($newMsgs as $msg) {
        echo "event: message\n";
        echo "data: " . json_encode($msg) . "\n\n";
        $lastMessageId = max($lastMessageId, (int)$msg['id']);
    }

    // Ping pour garder la connexion vivante
    echo ": ping\n\n";

    ob_flush();
    flush();

    // Attendre 2 secondes (bon compromis entre temps réel et charge serveur)
    sleep(2);
}
