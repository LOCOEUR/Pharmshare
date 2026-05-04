<?php
/**
 * API Inscription
 * POST /api/auth/signup.php
 */
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse("Méthode non autorisée", 405);
}

$data = getRequestBody();
validateRequired($data, ['nom', 'email', 'password', 'telephone', 'licence_numero']);

$db = (new Database())->getConnection();

// Vérifier si l'email existe déjà
$stmt = $db->prepare("SELECT id FROM pharmacies WHERE email = :email");
$stmt->execute(['email' => $data['email']]);
if ($stmt->fetch()) {
    errorResponse("Cet email est déjà utilisé", 409);
}

// Créer la pharmacie
$hashedPassword = hashPassword($data['password']);
$stmt = $db->prepare("
    INSERT INTO pharmacies (nom, email, mot_de_passe, telephone, adresse, ville, quartier, responsable, licence_numero, latitude, longitude) 
    VALUES (:nom, :email, :mot_de_passe, :telephone, :adresse, :ville, :quartier, :responsable, :licence, :lat, :lng)
");

$stmt->execute([
    'nom' => $data['nom'],
    'email' => $data['email'],
    'mot_de_passe' => $hashedPassword,
    'telephone' => $data['telephone'] ?? null,
    'adresse' => $data['adresse'] ?? null,
    'ville' => $data['ville'] ?? 'Abidjan',
    'quartier' => $data['quartier'] ?? null,
    'responsable' => $data['responsable'] ?? $data['nom'],
    'licence' => $data['licence_numero'] ?? null,
    'lat' => $data['latitude'] ?? null,
    'lng' => $data['longitude'] ?? null
]);

$pharmacieId = $db->lastInsertId();

// Créer l'utilisateur admin pour cette pharmacie
$stmt = $db->prepare("
    INSERT INTO users (pharmacie_id, nom, email, mot_de_passe, role, actif) 
    VALUES (:ph_id, :nom, :email, :pass, 'admin', 0)
");
$stmt->execute([
    'ph_id' => $pharmacieId,
    'nom'   => $data['nom'],
    'email' => $data['email'],
    'pass'  => $hashedPassword
]);
$userId = $db->lastInsertId();

// Créer les paramètres par défaut
$stmt = $db->prepare("INSERT INTO parametres (pharmacie_id) VALUES (:id)");
$stmt->execute(['id' => $pharmacieId]);

// Créer une notification de bienvenue
$stmt = $db->prepare("
    INSERT INTO notifications (pharmacie_id, titre, message, type) 
    VALUES (:id, 'Bienvenue sur PharmShare !', 'Votre compte a été créé avec succès. Il est en attente de validation par l\'administrateur.', 'systeme')
");
$stmt->execute(['id' => $pharmacieId]);

// On ne génère PAS de token ici pour empêcher l'accès immédiat au dashboard
// L'utilisateur devra attendre la validation de l'admin pour se connecter

successResponse(null, "Inscription réussie. Votre compte est en attente de validation par l'administrateur.");
