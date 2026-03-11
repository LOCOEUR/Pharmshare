<?php
/**
 * API Audit Logs
 * GET /api/settings/audit.php - Lister les journaux d'audit
 */
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$pharmacieId = getAuthenticatedPharmacieId();
$db = (new Database())->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $limit = $_GET['limit'] ?? 50;

    $stmt = $db->prepare("
        SELECT a.id, a.action, a.details, a.date_creation,
               u.nom as user_nom, u.role as user_role
        FROM audit_logs a
        JOIN users u ON a.user_id = u.id
        WHERE a.pharmacie_id = :pid
        ORDER BY a.date_creation DESC
        LIMIT :lim
    ");
    $stmt->bindValue(':pid', $pharmacieId, PDO::PARAM_INT);
    $stmt->bindValue(':lim', (int)$limit, PDO::PARAM_INT);
    $stmt->execute();
    
    $logs = $stmt->fetchAll();

    // Formater un peu pour le frontend (JSON decode des détails)
    foreach ($logs as &$log) {
        $log['details'] = json_decode($log['details'], true) ?: $log['details'];
    }

    successResponse($logs);
} else {
    errorResponse("Méthode non autorisée", 405);
}
