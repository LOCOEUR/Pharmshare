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
        // Activer l'utilisateur
        $stmt = $db->prepare("UPDATE users SET actif = 1 WHERE id = :id");
        $stmt->execute(['id' => $userId]);

        // Récupérer les infos pour l'envoi du mail
        $stmt = $db->prepare("SELECT nom, email FROM users WHERE id = :id");
        $stmt->execute(['id' => $userId]);
        $user = $stmt->fetch();

        if ($user) {
            $to = $user['email'];
            $subject = "Bienvenue sur PharmShare - Votre compte est activé !";
            $message = "Bonjour " . $user['nom'] . ",\n\n" .
                       "Nous avons le plaisir de vous informer que votre compte PharmShare a été validé par notre équipe.\n" .
                       "Vous pouvez désormais vous connecter à la plateforme pour gérer vos surplus et accéder au marché.\n\n" .
                       "Lien de connexion : http://votre-site.com/login\n\n" .
                       "L'équipe PharmShare.";
            $headers = "From: contact@pharmshare.com\r\n" .
                       "Reply-To: contact@pharmshare.com\r\n" .
                       "X-Mailer: PHP/" . phpversion();

            @mail($to, $subject, $message, $headers);
        }
    } else if ($action === 'reject') {
        $stmt = $db->prepare("DELETE FROM users WHERE id = :id");
        $stmt->execute(['id' => $userId]);
    }
    successResponse(["message" => "Action effectuée"]);
}
