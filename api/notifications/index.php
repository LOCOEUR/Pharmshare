<?php
/**
 * API Notifications
 * GET    /api/notifications/index.php          - Lister les notifications
 * PUT    /api/notifications/index.php?id=X     - Marquer comme lue
 * PUT    /api/notifications/index.php?all=1    - Marquer toutes comme lues
 */
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$pharmacieId = getAuthenticatedPharmacieId();
$db = (new Database())->getConnection();

switch ($_SERVER['REQUEST_METHOD']) {

    case 'GET':
        $filter = $_GET['filter'] ?? 'all'; // all, unread, demande, stock, expiration, message, systeme
        
        $sql = "SELECT * FROM notifications WHERE pharmacie_id = :pid";
        $params = ['pid' => $pharmacieId];

        if ($filter === 'unread') {
            $sql .= " AND lu = 0";
        } elseif (in_array($filter, ['demande', 'stock', 'expiration', 'message', 'systeme'])) {
            $sql .= " AND type = :type";
            $params['type'] = $filter;
        }

        $sql .= " ORDER BY date_creation DESC LIMIT 50";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $notifications = $stmt->fetchAll();

        // Compter les non-lues
        $stmt = $db->prepare("SELECT COUNT(*) FROM notifications WHERE pharmacie_id = :pid AND lu = 0");
        $stmt->execute(['pid' => $pharmacieId]);
        $unreadCount = $stmt->fetchColumn();

        successResponse([
            "notifications" => $notifications,
            "unread_count" => (int)$unreadCount
        ]);
        break;

    case 'PUT':
        $id = $_GET['id'] ?? null;
        $all = $_GET['all'] ?? null;

        if ($all) {
            // Marquer toutes comme lues
            $stmt = $db->prepare("UPDATE notifications SET lu = 1 WHERE pharmacie_id = :pid AND lu = 0");
            $stmt->execute(['pid' => $pharmacieId]);
            successResponse(null, "Toutes les notifications marquées comme lues");
        } elseif ($id) {
            // Marquer une seule
            $stmt = $db->prepare("UPDATE notifications SET lu = 1 WHERE id = :id AND pharmacie_id = :pid");
            $stmt->execute(['id' => $id, 'pid' => $pharmacieId]);
            if ($stmt->rowCount() === 0) errorResponse("Notification non trouvée", 404);
            successResponse(null, "Notification marquée comme lue");
        } else {
            errorResponse("ID ou paramètre 'all' requis");
        }
        break;

    default:
        errorResponse("Méthode non autorisée", 405);
}
