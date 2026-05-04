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
validateRequired($data, ['email', 'password']);

$db = (new Database())->getConnection();

// Recherche de l'utilisateur (on prend aussi les inactifs pour donner un message clair)
$stmt = $db->prepare("
    SELECT u.id, u.nom, u.email, u.mot_de_passe, u.role, u.photo_url, u.pharmacie_id, u.actif,
           p.nom as pharmacie_nom, p.ville, p.quartier 
    FROM users u 
    LEFT JOIN pharmacies p ON u.pharmacie_id = p.id 
    WHERE u.email = :email
");
$stmt->execute(['email' => $data['email']]);
$user = $stmt->fetch();

// Vérification de l'utilisateur et du mot de passe
if (!$user || !verifyPassword($data['password'], $user['mot_de_passe'])) {
    errorResponse("Email ou mot de passe incorrect", 401);
}

// Vérification de l'activation
if ($user['actif'] == 0) {
    errorResponse("Votre compte est en attente de validation par l'administrateur.", 403);
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
