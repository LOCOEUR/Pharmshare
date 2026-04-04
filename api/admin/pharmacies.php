<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'POST') {
    errorResponse("Méthode non autorisée", 405);
}

$payload = getAuthenticatedTokenPayload();
$db = (new Database())->getConnection();

// Validate admin
$role = $db->query("SELECT role FROM users WHERE id = " . (int)$payload['user_id'])->fetchColumn();
if ($role !== 'super_admin') errorResponse("Accès refusé", 403);

$data = getRequestBody();
if (!isset($data['action']) || !isset($data['pharmacie_id'])) {
    errorResponse("Paramètres invalides");
}

$pharmacieId = (int)$data['pharmacie_id'];
$action = $data['action'];

try {
    if ($action === 'block') {
        $db->query("UPDATE pharmacies SET actif = 0 WHERE id = $pharmacieId");
        $db->query("UPDATE users SET actif = 0 WHERE pharmacie_id = $pharmacieId");
    } else if ($action === 'unblock') {
        $db->query("UPDATE pharmacies SET actif = 1 WHERE id = $pharmacieId");
        $db->query("UPDATE users SET actif = 1 WHERE pharmacie_id = $pharmacieId");
    } else if ($action === 'delete') {
        // En cas de suppression, on supprime la pharmacie et ses utilisateurs par cascade (ou via requete).
        $db->query("DELETE FROM users WHERE pharmacie_id = $pharmacieId");
        $db->query("DELETE FROM pharmacies WHERE id = $pharmacieId");
    } else {
        errorResponse("Action inconnue");
    }
    
    successResponse(["message" => "Action effectuée avec succès"]);
} catch (Exception $e) {
    errorResponse("Erreur lors de l'opération: " . $e->getMessage());
}
