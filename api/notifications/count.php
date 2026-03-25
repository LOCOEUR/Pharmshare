<?php
/**
 * API Notification Count
 * GET /api/notifications/count.php - Nombre de notifications non lues
 */
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    errorResponse("Méthode non autorisée", 405);
}

$pharmacieId = getAuthenticatedPharmacieId();
$db = (new Database())->getConnection();

$stmt = $db->prepare("SELECT COUNT(*) as count FROM notifications WHERE pharmacie_id = :id AND lu = 0");
$stmt->execute(['id' => $pharmacieId]);
$count = (int)$stmt->fetch()['count'];

successResponse(["unread_count" => $count]);
