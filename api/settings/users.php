<?php
/**
 * API Gestion des Employés
 * GET    /api/settings/users.php  - Lister les employés
 * POST   /api/settings/users.php  - Ajouter un employé
 * DELETE /api/settings/users.php  - Supprimer un employé
 */
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$pharmacieId = getAuthenticatedPharmacieId();
$userId = getAuthenticatedUserId();
$db = (new Database())->getConnection();

// Vérifier si l'utilisateur actuel est ADMIN
$stmt = $db->prepare("SELECT role FROM users WHERE id = :id");
$stmt->execute(['id' => $userId]);
$currentUserRole = $stmt->fetchColumn();

if ($currentUserRole !== 'admin' && $currentUserRole !== 'pharmacien') {
    errorResponse("Seul un pharmacien ou l'administrateur peut gérer le personnel", 403);
}

switch ($_SERVER['REQUEST_METHOD']) {

    case 'GET':
        // Lister tous les employés de la pharmacie (sauf l'admin lui-même pour éviter l'auto-suppression accidentelle ici)
        $stmt = $db->prepare("SELECT id, nom, email, role, photo_url, actif, date_creation, derniere_connexion FROM users WHERE pharmacie_id = :ph_id AND id != :u_id ORDER BY date_creation DESC");
        $stmt->execute(['ph_id' => $pharmacieId, 'u_id' => $userId]);
        $users = $stmt->fetchAll();
        successResponse($users);
        break;

    case 'POST':
        $data = getRequestBody();
        validateRequired($data, ['nom', 'email', 'password', 'role']);

        // Vérifier si l'email existe déjà
        $stmt = $db->prepare("SELECT id FROM users WHERE email = :email");
        $stmt->execute(['email' => $data['email']]);
        if ($stmt->fetch()) {
            errorResponse("Cet email est déjà utilisé", 409);
        }

        // Créer l'employé
        $hashedPassword = hashPassword($data['password']);
        $stmt = $db->prepare("
            INSERT INTO users (pharmacie_id, nom, email, mot_de_passe, role) 
            VALUES (:ph_id, :nom, :email, :pass, :role)
        ");
        $stmt->execute([
            'ph_id' => $pharmacieId,
            'nom'   => $data['nom'],
            'email' => $data['email'],
            'pass'  => $hashedPassword,
            'role'  => $data['role']
        ]);

        successResponse(null, "Employé ajouté avec succès");
        break;

    case 'DELETE':
        if (!isset($_GET['id'])) {
            errorResponse("ID manquant");
        }

        $idToDelete = $_GET['id'];

        // Vérifier que l'utilisateur appartient bien à la pharmacie
        $stmt = $db->prepare("SELECT id FROM users WHERE id = :id AND pharmacie_id = :ph_id");
        $stmt->execute(['id' => $idToDelete, 'ph_id' => $pharmacieId]);
        
        if (!$stmt->fetch()) {
            errorResponse("Utilisateur introuvable ou accès refusé", 404);
        }

        // Supprimer
        $stmt = $db->prepare("DELETE FROM users WHERE id = :id");
        $stmt->execute(['id' => $idToDelete]);

        successResponse(null, "Employé supprimé");
        break;

    default:
        errorResponse("Méthode non autorisée", 405);
}
?>
