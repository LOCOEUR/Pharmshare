<?php
/**
 * API Upload de fichiers pour le Chat
 * POST /api/chat/upload.php - Uploader un fichier (image, PDF, etc.)
 */
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

// Authentification
$pharmacieId = getAuthenticatedPharmacieId();
$db = (new Database())->getConnection();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse("Méthode non autorisée", 405);
}

// Vérification du fichier
if (!isset($_FILES['fichier']) || $_FILES['fichier']['error'] !== UPLOAD_ERR_OK) {
    errorResponse("Aucun fichier reçu ou erreur d'upload.", 400);
}

$fichier = $_FILES['fichier'];
$conversationId = $_POST['conversation_id'] ?? null;
$contenu       = $_POST['contenu'] ?? '';

// Vérifier l'accès à la conversation
if ($conversationId) {
    $stmt = $db->prepare("SELECT * FROM conversations WHERE id = :cid AND (pharmacie_1_id = :p1 OR pharmacie_2_id = :p2)");
    $stmt->execute(['cid' => $conversationId, 'p1' => $pharmacieId, 'p2' => $pharmacieId]);
    $conv = $stmt->fetch();
    if (!$conv) errorResponse("Conversation non trouvée ou accès refusé", 403);
} elseif (isset($_POST['partner_id'])) {
    $partnerId = (int)$_POST['partner_id'];
    $p1 = min($pharmacieId, $partnerId);
    $p2 = max($pharmacieId, $partnerId);
    $stmt = $db->prepare("SELECT id FROM conversations WHERE pharmacie_1_id = :p1 AND pharmacie_2_id = :p2");
    $stmt->execute(['p1' => $p1, 'p2' => $p2]);
    $conv = $stmt->fetch();
    if ($conv) {
        $conversationId = $conv['id'];
    } else {
        $stmt = $db->prepare("INSERT INTO conversations (pharmacie_1_id, pharmacie_2_id) VALUES (:p1, :p2)");
        $stmt->execute(['p1' => $p1, 'p2' => $p2]);
        $conversationId = $db->lastInsertId();
        $stmt = $db->prepare("SELECT * FROM conversations WHERE id = :id");
        $stmt->execute(['id' => $conversationId]);
        $conv = $stmt->fetch();
    }
} else {
    errorResponse("conversation_id ou partner_id requis", 400);
}

// Types autorisés
$typesAutorises = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
$mimeType = mime_content_type($fichier['tmp_name']);

if (!in_array($mimeType, $typesAutorises)) {
    errorResponse("Type de fichier non autorisé. Formats acceptés: JPG, PNG, GIF, WEBP, PDF, DOC, DOCX", 400);
}

// Taille max : 10 Mo
if ($fichier['size'] > 10 * 1024 * 1024) {
    errorResponse("Fichier trop volumineux (max 10 Mo)", 400);
}

// Nom de fichier sécurisé
$ext = pathinfo($fichier['name'], PATHINFO_EXTENSION);
$nomFichier = uniqid('chat_' . $pharmacieId . '_', true) . '.' . strtolower($ext);
$dossier = __DIR__ . '/../../uploads/chat/';
$destination = $dossier . $nomFichier;

if (!move_uploaded_file($fichier['tmp_name'], $destination)) {
    errorResponse("Erreur lors de la sauvegarde du fichier", 500);
}

// Détecter le type (image ou document)
$fichierType = strpos($mimeType, 'image/') === 0 ? 'image' : 'document';
$fichierUrl  = '/uploads/chat/' . $nomFichier;

// Nom affiché dans la bulle si pas de texte
if (empty($contenu)) {
    $contenu = $fichierType === 'image' ? '📷 Photo' : '📎 ' . basename($fichier['name']);
}

// Insérer le message
$stmt = $db->prepare("
    INSERT INTO messages (conversation_id, expediteur_id, contenu, fichier_url, fichier_type)
    VALUES (:cid, :eid, :contenu, :furl, :ftype)
");
$stmt->execute([
    'cid'     => $conversationId,
    'eid'     => $pharmacieId,
    'contenu' => $contenu,
    'furl'    => $fichierUrl,
    'ftype'   => $fichierType
]);

// Mettre à jour dernière activité
$stmt = $db->prepare("UPDATE conversations SET derniere_activite = NOW() WHERE id = :cid");
$stmt->execute(['cid' => $conversationId]);

// Notifier le partenaire
$partnerId = ($conv['pharmacie_1_id'] == $pharmacieId) ? $conv['pharmacie_2_id'] : $conv['pharmacie_1_id'];
$stmt = $db->prepare("SELECT nom FROM pharmacies WHERE id = :id");
$stmt->execute(['id' => $pharmacieId]);
$senderName = $stmt->fetchColumn();

$stmt = $db->prepare("INSERT INTO notifications (pharmacie_id, titre, message, type, lien) VALUES (:id, :titre, :msg, 'message', '/chat')");
$stmt->execute([
    'id'    => $partnerId,
    'titre' => "Fichier reçu de $senderName",
    'msg'   => $fichierType === 'image' ? "$senderName vous a envoyé une photo." : "$senderName vous a envoyé un document : " . basename($fichier['name'])
]);

successResponse([
    "conversation_id" => $conversationId,
    "fichier_url"     => $fichierUrl,
    "fichier_type"    => $fichierType
], "Fichier envoyé");
