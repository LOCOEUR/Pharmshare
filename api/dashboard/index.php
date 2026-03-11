<?php
/**
 * API Dashboard
 * GET /api/dashboard/index.php - Données du tableau de bord
 */
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    errorResponse("Méthode non autorisée", 405);
}

$pharmacieId = getAuthenticatedPharmacieId();
$db = (new Database())->getConnection();

// Infos pharmacie
$stmt = $db->prepare("SELECT id, nom, responsable, ville, quartier FROM pharmacies WHERE id = :id");
$stmt->execute(['id' => $pharmacieId]);
$pharmacie = $stmt->fetch();

// Stats via la vue dashboard
$stmt = $db->prepare("SELECT * FROM vue_dashboard WHERE pharmacie_id = :id");
$stmt->execute(['id' => $pharmacieId]);
$stats = $stmt->fetch();

// Annonces actives
$stmt = $db->prepare("SELECT COUNT(*) as count FROM annonces WHERE pharmacie_id = :id AND statut = 'active'");
$stmt->execute(['id' => $pharmacieId]);
$annoncesActives = $stmt->fetch()['count'];

// Demandes en attente
$stmt = $db->prepare("SELECT COUNT(*) as count FROM demandes WHERE destinataire_id = :id AND statut = 'en_attente'");
$stmt->execute(['id' => $pharmacieId]);
$demandesEnAttente = $stmt->fetch()['count'];

// Économies (total des ventes réussies)
$stmt = $db->prepare("
    SELECT COALESCE(SUM(a.prix_unitaire * d.quantite), 0) as economies
    FROM demandes d 
    JOIN annonces a ON d.annonce_id = a.id 
    WHERE (d.demandeur_id = :id OR d.destinataire_id = :id2) AND d.statut = 'terminee'
");
$stmt->execute(['id' => $pharmacieId, 'id2' => $pharmacieId]);
$economies = $stmt->fetch()['economies'];

// Demandes récentes
$stmt = $db->prepare("
    SELECT d.id, d.produit_nom as med, d.statut, d.type_demande, d.date_creation,
           CASE 
               WHEN d.demandeur_id = :id THEN p2.nom 
               ELSE p1.nom 
           END as partner,
           CASE 
               WHEN d.demandeur_id = :id2 THEN 'Votre Offre'
               ELSE 'Demande Reçue' 
           END as type
    FROM demandes d
    JOIN pharmacies p1 ON d.demandeur_id = p1.id
    JOIN pharmacies p2 ON d.destinataire_id = p2.id
    WHERE d.demandeur_id = :id3 OR d.destinataire_id = :id4
    ORDER BY d.date_creation DESC
    LIMIT 5
");
$stmt->execute(['id' => $pharmacieId, 'id2' => $pharmacieId, 'id3' => $pharmacieId, 'id4' => $pharmacieId]);
$recentRequests = $stmt->fetchAll();

// Alertes prioritaires
$stmt = $db->prepare("
    SELECT nom, stock_actuel, stock_minimum, date_expiration, alerte_type
    FROM vue_alertes_stock 
    WHERE pharmacie_nom = (SELECT nom FROM pharmacies WHERE id = :id)
    LIMIT 5
");
$stmt->execute(['id' => $pharmacieId]);
$alertes = $stmt->fetchAll();

// Mouvements de stock de la semaine (pour le graphique)
$stmt = $db->prepare("
    SELECT DAYOFWEEK(date_mouvement) as jour, COUNT(*) as total
    FROM mouvements_stock 
    WHERE pharmacie_id = :id AND date_mouvement >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    GROUP BY DAYOFWEEK(date_mouvement)
    ORDER BY jour
");
$stmt->execute(['id' => $pharmacieId]);
$stockHealth = $stmt->fetchAll();

successResponse([
    "pharmacie" => $pharmacie,
    "stats" => [
        "annonces_actives" => (int)$annoncesActives,
        "demandes_en_attente" => (int)$demandesEnAttente,
        "economies" => (float)$economies,
        "total_produits" => (int)($stats['total_produits'] ?? 0),
        "produits_en_alerte" => (int)($stats['produits_en_alerte'] ?? 0),
        "expirations_proches" => (int)($stats['expirations_proches'] ?? 0),
        "notifs_non_lues" => (int)($stats['notifs_non_lues'] ?? 0)
    ],
    "recent_requests" => $recentRequests,
    "alertes" => $alertes,
    "stock_health" => $stockHealth
]);
