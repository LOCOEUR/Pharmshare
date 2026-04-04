<?php
/**
 * API Authentification - Inscription & Connexion
 * POST /api/auth/login.php    - Connexion
 * POST /api/auth/signup.php   - Inscription
 */
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    errorResponse("Méthode non autorisée", 405);
}

$data = getRequestBody();
validateRequired($data, ['email']);

$db = (new Database())->getConnection();

// Recherche de l'utilisateur par email
$stmt = $db->prepare("
    SELECT u.id, u.nom, u.email, u.mot_de_passe, u.role, u.photo_url, u.pharmacie_id, 
           p.nom as pharmacie_nom, p.ville, p.quartier 
    FROM users u 
    LEFT JOIN pharmacies p ON u.pharmacie_id = p.id 
    WHERE u.email = :email AND u.actif = 1
");
$stmt->execute(['email' => $data['email']]);
$user = $stmt->fetch();

if (!$user) {
    errorResponse("Aucun compte trouvé avec cet email", 404);
}

// Si un mot de passe est fourni, le vérifier
if (isset($data['password']) && !empty($data['password'])) {
    if (!verifyPassword($data['password'], $user['mot_de_passe'])) {
        errorResponse("Mot de passe incorrect", 401);
    }
}

// Mettre à jour la dernière connexion
$stmt = $db->prepare("UPDATE users SET derniere_connexion = NOW() WHERE id = :id");
$stmt->execute(['id' => $user['id']]);

// Générer le token (inclut user_id et pharmacie_id)
$token = generateToken($user['id'], $user['pharmacie_id']);

// Réponse
successResponse([
    "token" => $token,
    "user" => [
        "id" => $user['id'],
        "pharmacie_id" => $user['pharmacie_id'],
        "nom" => $user['nom'],
        "email" => $user['email'],
        "role" => $user['role'],
        "photo_url" => $user['photo_url'],
        "pharmacie_nom" => $user['pharmacie_nom'],
        "ville" => $user['ville'],
        "quartier" => $user['quartier']
    ]
], "Connexion réussie");
