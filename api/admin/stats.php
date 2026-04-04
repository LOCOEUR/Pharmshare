<?php
/**
 * API Admin Global - Statistiques de la plateforme
 * GET /api/admin/stats.php
 * Accès réservé au rôle super_admin
 */
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    errorResponse("Méthode non autorisée", 405);
}

// Vérifier que l'utilisateur est super_admin
$payload = getAuthenticatedTokenPayload();
$db = (new Database())->getConnection();

$stmt = $db->prepare("SELECT role FROM users WHERE id = :id");
$stmt->execute(['id' => $payload['user_id']]);
$role = $stmt->fetchColumn();

if ($role !== 'super_admin') {
    errorResponse("Accès réservé à l'administrateur global", 403);
}

// Nombre total de pharmacies
$stmt = $db->query("SELECT COUNT(*) FROM pharmacies");
$totalPharmacies = (int)$stmt->fetchColumn();

// Pharmacies actives (avec au moins un utilisateur actif)
$stmt = $db->query("SELECT COUNT(DISTINCT pharmacie_id) FROM users WHERE actif = 1");
$pharmaciesActives = (int)$stmt->fetchColumn();

// Nombre total d'échanges (demandes terminées)
$stmt = $db->query("SELECT COUNT(*) FROM demandes WHERE statut = 'terminee'");
$totalEchanges = (int)$stmt->fetchColumn();

// Nombre total de demandes en attente
$stmt = $db->query("SELECT COUNT(*) FROM demandes WHERE statut = 'en_attente'");
$demandesEnAttente = (int)$stmt->fetchColumn();

// Nombre total d'utilisateurs
$stmt = $db->query("SELECT COUNT(*) FROM users WHERE role != 'super_admin'");
$totalUsers = (int)$stmt->fetchColumn();

// Nombre total d'annonces actives sur la plateforme
$stmt = $db->query("SELECT COUNT(*) FROM annonces WHERE statut = 'active'");
$totalAnnonces = (int)$stmt->fetchColumn();

// Liste des pharmacies avec leurs stats
$stmt = $db->query("
    SELECT p.id, p.nom, p.ville, p.quartier, p.responsable, p.licence_numero, p.actif as p_actif,
           COUNT(DISTINCT u.id) as nb_users,
           COUNT(DISTINCT a.id) as nb_annonces,
           COUNT(DISTINCT d.id) as nb_echanges
    FROM pharmacies p
    LEFT JOIN users u ON u.pharmacie_id = p.id AND u.actif = 1
    LEFT JOIN annonces a ON a.pharmacie_id = p.id AND a.statut = 'active'
    LEFT JOIN demandes d ON (d.demandeur_id = p.id OR d.destinataire_id = p.id) AND d.statut = 'terminee'
    GROUP BY p.id, p.nom, p.ville, p.quartier, p.responsable, p.licence_numero, p.actif
    ORDER BY nb_echanges DESC
    LIMIT 20
");
$pharmacies = $stmt->fetchAll();

// Dernières actions (logs d'audit)
$stmt = $db->query("
    SELECT al.action, al.details, al.date_creation as created_at,
           u.nom as user_nom, p.nom as pharmacie_nom
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.id
    LEFT JOIN pharmacies p ON al.pharmacie_id = p.id
    ORDER BY al.date_creation DESC
    LIMIT 10
");
$recentLogs = $stmt->fetchAll();

successResponse([
    "stats" => [
        "total_pharmacies"    => $totalPharmacies,
        "pharmacies_actives"  => $pharmaciesActives,
        "total_echanges"      => $totalEchanges,
        "demandes_en_attente" => $demandesEnAttente,
        "total_users"         => $totalUsers,
        "total_annonces"      => $totalAnnonces,
    ],
    "pharmacies" => $pharmacies,
    "recent_logs" => $recentLogs
]);
