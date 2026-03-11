<?php
/**
 * API Recherche de produits (pour la déclaration de surplus)
 * GET /api/products/search.php?q=xxx  - Rechercher des produits dans l'inventaire
 */
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    errorResponse("Méthode non autorisée", 405);
}

$pharmacieId = getAuthenticatedPharmacieId();
$db = (new Database())->getConnection();

$query = $_GET['q'] ?? '';

if (strlen($query) < 2) {
    successResponse([]);
}

$stmt = $db->prepare("
    SELECT id, nom, forme, dosage, stock_actuel, date_expiration
    FROM produits 
    WHERE pharmacie_id = :pid AND nom LIKE :query AND stock_actuel > 0
    ORDER BY nom ASC
    LIMIT 10
");
$stmt->execute([
    'pid' => $pharmacieId,
    'query' => "%$query%"
]);

successResponse($stmt->fetchAll());
