<?php
/**
 * API Comptage des notifications non lues
 * GET /api/notifications/unread_counts.php
 */
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$pharmacieId = getAuthenticatedPharmacieId();
$db = (new Database())->getConnection();

// messages non lus
$stmt = $db->prepare("SELECT COUNT(*) FROM messages WHERE destinataire_id = :id AND lu = 0");
$stmt->execute(['id' => $pharmacieId]);
$msgCount = (int)$stmt->fetchColumn();

// notifications non lues 
$stmt = $db->prepare("SELECT COUNT(*) FROM notifications WHERE pharmacie_id = :id AND lu = 0");
$stmt->execute(['id' => $pharmacieId]);
$notifCount = (int)$stmt->fetchColumn();

// demandes en attente (reçues)
$stmt = $db->prepare("SELECT COUNT(*) FROM demandes WHERE destinataire_id = :id AND statut = 'en_attente'");
$stmt->execute(['id' => $pharmacieId]);
$demandeCount = (int)$stmt->fetchColumn();

successResponse([
    'messages' => $msgCount,
    'notifications' => $notifCount,
    'demandes' => $demandeCount,
    'total' => $msgCount + $notifCount + $demandeCount
]);
