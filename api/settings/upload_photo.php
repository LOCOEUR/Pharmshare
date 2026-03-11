<?php
/**
 * API Paramètres - Upload de photo
 * POST /api/settings/upload_photo.php
 */
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse("Méthode non autorisée", 405);
}

$pharmacieId = getAuthenticatedPharmacieId();
$db = (new Database())->getConnection();

if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = __DIR__ . '/../../uploads/';
    // Vérifier si le chemin relatif est à l'intérieur de l'API ou à l'extérieur
    // Typiquement les téléchargements sont dans api/uploads
    $uploadDir = __DIR__ . '/../uploads/avatars/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }
    
    $fileInfo = pathinfo($_FILES['photo']['name']);
    $extension = strtolower($fileInfo['extension']);
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    
    if (!in_array($extension, $allowedExtensions)) {
        errorResponse("Format non autorisé", 400);
    }
    
    $fileName = 'avatar_' . $pharmacieId . '_' . uniqid() . '.' . $extension;
    $uploadFile = $uploadDir . $fileName;
    
    if (move_uploaded_file($_FILES['photo']['tmp_name'], $uploadFile)) {
        $dbUrl = '/uploads/avatars/' . $fileName;
        
        // On récupère l'ancienne photo pour la supprimer
        $stmt = $db->prepare("SELECT photo_url FROM pharmacies WHERE id = :id");
        $stmt->execute(['id' => $pharmacieId]);
        $oldPhoto = $stmt->fetchColumn();
        
        if ($oldPhoto && file_exists(__DIR__ . '/..' . $oldPhoto)) {
            @unlink(__DIR__ . '/..' . $oldPhoto);
        }
        
        $stmt = $db->prepare("UPDATE pharmacies SET photo_url = :photo_url WHERE id = :id");
        $stmt->execute([
            'photo_url' => $dbUrl,
            'id' => $pharmacieId
        ]);
        
        successResponse(['photo_url' => $dbUrl], "Photo mise à jour");
    } else {
        errorResponse("Erreur lors de la sauvegarde", 500);
    }
} else {
    errorResponse("Fichier invalide ou manquant", 400);
}
