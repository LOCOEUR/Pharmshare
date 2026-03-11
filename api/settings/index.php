<?php
/**
 * API Paramètres
 * GET  /api/settings/index.php  - Obtenir les paramètres
 * PUT  /api/settings/index.php  - Mettre à jour les paramètres
 * PUT  /api/settings/profile.php - Mettre à jour le profil pharmacie
 */
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$pharmacieId = getAuthenticatedPharmacieId();
$userId = getAuthenticatedUserId();
$db = (new Database())->getConnection();

switch ($_SERVER['REQUEST_METHOD']) {

    case 'GET':
        // Paramètres
        $stmt = $db->prepare("SELECT * FROM parametres WHERE pharmacie_id = :id");
        $stmt->execute(['id' => $pharmacieId]);
        $parametres = $stmt->fetch();

        // Profil pharmacie
        $stmt = $db->prepare("SELECT id, nom, email, telephone, adresse, ville, quartier, licence_numero, responsable, photo_url FROM pharmacies WHERE id = :id");
        $stmt->execute(['id' => $pharmacieId]);
        $profil = $stmt->fetch();

        // Profil utilisateur personnel
        $stmt = $db->prepare("SELECT id, nom, email, role, photo_url FROM users WHERE id = :id");
        $stmt->execute(['id' => $userId]);
        $userProfil = $stmt->fetch();

        successResponse([
            "parametres" => $parametres,
            "profil" => $profil,
            "user" => $userProfil
        ]);
        break;

    case 'PUT':
        $data = getRequestBody();

        // Mise à jour des paramètres
        $params = ['pid' => $pharmacieId];
        $fields = [];
        
        $settingsFields = ['theme', 'langue', 'notif_email', 'notif_stock', 'notif_demandes', 'notif_messages', 'seuil_alerte_jours'];
        foreach ($settingsFields as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = :$field";
                $params[$field] = $data[$field];
            }
        }

        if (!empty($fields)) {
            $sql = "UPDATE parametres SET " . implode(', ', $fields) . " WHERE pharmacie_id = :pid";
            $stmt = $db->prepare($sql);
            $stmt->execute($params);
        }

        // Mise à jour du profil si fourni
        $profileFields = [];
        $profileParams = ['pid' => $pharmacieId];
        $profileUpdatable = ['nom', 'telephone', 'adresse', 'ville', 'quartier', 'licence_numero', 'responsable'];
        
        foreach ($profileUpdatable as $field) {
            if (isset($data[$field])) {
                $profileFields[] = "$field = :$field";
                $profileParams[$field] = $data[$field];
            }
        }

        if (!empty($profileFields)) {
            $sql = "UPDATE pharmacies SET " . implode(', ', $profileFields) . " WHERE id = :pid";
            $stmt = $db->prepare($sql);
            $stmt->execute($profileParams);
        }

        // Mise à jour de l'utilisateur personnel si fourni
        $userFields = [];
        $userParams = ['uid' => $userId];
        if (isset($data['user_nom'])) {
            $userFields[] = "nom = :nom";
            $userParams['nom'] = $data['user_nom'];
        }
        if (isset($data['user_email'])) {
            $userFields[] = "email = :email";
            $userParams['email'] = $data['user_email'];
        }

        if (!empty($userFields)) {
            $sql = "UPDATE users SET " . implode(', ', $userFields) . " WHERE id = :uid";
            $stmt = $db->prepare($sql);
            $stmt->execute($userParams);
        }

        // Changement de mot de passe (table users)
        if (isset($data['current_password']) && isset($data['new_password'])) {
            $stmt = $db->prepare("SELECT mot_de_passe FROM users WHERE id = :id");
            $stmt->execute(['id' => $userId]);
            $current = $stmt->fetchColumn();

            if (!verifyPassword($data['current_password'], $current)) {
                errorResponse("Mot de passe actuel incorrect", 401);
            }

            $newHash = hashPassword($data['new_password']);
            $stmt = $db->prepare("UPDATE users SET mot_de_passe = :pwd WHERE id = :id");
            $stmt->execute(['pwd' => $newHash, 'id' => $userId]);
        }

        successResponse(null, "Paramètres mis à jour");
        break;

    default:
        errorResponse("Méthode non autorisée", 405);
}
