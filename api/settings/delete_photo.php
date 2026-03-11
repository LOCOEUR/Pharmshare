<?php
/**
 * API Paramètres - Suppression de photo
 * DELETE /api/settings/delete_photo.php
 */
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    errorResponse("Méthode non autorisée", 405);
}

$pharmacieId = getAuthenticatedPharmacieId();
$db = (new Database())->getConnection();

// On récupère l'ancienne photo pour la supprimer
$stmt = $db->prepare("SELECT photo_url FROM pharmacies WHERE id = :id");
$stmt->execute(['id' => $pharmacieId]);
$oldPhoto = $stmt->fetchColumn();

if ($oldPhoto && file_exists(__DIR__ . '/..' . $oldPhoto)) {
    @unlink(__DIR__ . '/..' . $oldPhoto);
}

// Mise à jour de la base de données
$stmt = $db->prepare("UPDATE pharmacies SET photo_url = NULL WHERE id = :id");
$stmt->execute(['id' => $pharmacieId]);

successResponse(null, "Photo supprimée avec succès");
