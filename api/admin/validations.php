<?php
/**
 * API Admin Global - Validations inscriptions
 * GET /api/admin/validations.php (fetch pending list)
 * POST /api/admin/validations.php (approve/reject)
 */
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
$payload = getAuthenticatedTokenPayload();
$db = (new Database())->getConnection();

// Validate admin
$stmt = $db->prepare("SELECT role FROM users WHERE id = :id");
$stmt->execute(['id' => $payload['user_id']]);
$role = $stmt->fetchColumn();

if ($role !== 'super_admin') {
    errorResponse("Accès réservé à l'administrateur global", 403);
}

if ($method === 'GET') {
    $stmt = $db->query("
        SELECT u.id, u.nom, u.email, u.date_creation, p.nom as pharmacie_nom, p.ville, p.licence_numero 
        FROM users u 
        LEFT JOIN pharmacies p ON u.pharmacie_id = p.id 
        WHERE u.actif = 0 
        ORDER BY u.date_creation DESC
    ");
    successResponse(["pending" => $stmt->fetchAll()]);
}

if ($method === 'POST') {
    $data = getRequestBody();
    if(!isset($data['user_id']) || !isset($data['action'])) {
        errorResponse("Paramètres manquants");
    }
    
    $userId = (int)$data['user_id'];
    $action = $data['action'];
    
    if ($action === 'approve') {
        $db->query("UPDATE users SET actif = 1 WHERE id = " . $userId);
    } else if ($action === 'reject') {
        $db->query("DELETE FROM users WHERE id = " . $userId);
    }
    successResponse(["message" => "Action effectuée"]);
}
