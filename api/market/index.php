<?php
/**
 * API Bourse d'Échange (Market)
 * GET  /api/market/index.php          - Lister les annonces du marché
 * POST /api/market/index.php          - Créer une annonce (surplus declaration)
 */
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$pharmacieId = getAuthenticatedPharmacieId();
$db = (new Database())->getConnection();

switch ($_SERVER['REQUEST_METHOD']) {

    case 'GET':
        $search = $_GET['search'] ?? '';
        $filter = $_GET['filter'] ?? 'all'; // tous, vente, demande, les miennes
        
        $sql = "
            SELECT a.*, p.nom as produit_nom, p.forme as produit_forme, p.image_url as produit_image,
                   ph.nom as pharmacie_nom, ph.ville, ph.quartier,
                   TIMESTAMPDIFF(HOUR, a.date_creation, NOW()) as heures_depuis
            FROM annonces a
            LEFT JOIN produits p ON a.produit_id = p.id
            JOIN pharmacies ph ON a.pharmacie_id = ph.id
            WHERE 1=1
        ";
        $params = [];

        // Condition par défaut : annonces visibles (active, negoc ou vendue)
        if ($filter !== 'mine') {
            $sql .= " AND a.statut IN ('active', 'en_negociation', 'vendue')";
        } else {
            $sql .= " AND a.pharmacie_id = :my_ph_id";
            $params['my_ph_id'] = $pharmacieId;
        }

        if (!empty($search)) {
            $sql .= " AND (a.titre LIKE :search OR p.nom LIKE :search2 OR ph.nom LIKE :search3)";
            $params['search'] = "%$search%";
            $params['search2'] = "%$search%";
            $params['search3'] = "%$search%";
        }

        if ($filter === 'sell') {
            $sql .= " AND a.type_annonce = 'vente'";
        } elseif ($filter === 'request') {
            $sql .= " AND a.type_annonce IN ('echange', 'don', 'recherche')";
        }

        $sql .= " ORDER BY a.date_creation DESC";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $annonces = $stmt->fetchAll();

        foreach ($annonces as &$annonce) {
            $h = (int)$annonce['heures_depuis'];
            if ($h < 1) $annonce['posted'] = "Il y a quelques minutes";
            elseif ($h < 24) $annonce['posted'] = "Il y a {$h}h";
            elseif ($h < 48) $annonce['posted'] = "Hier";
            else $annonce['posted'] = "Il y a " . floor($h / 24) . "j";
        }

        successResponse($annonces);
        break;

    case 'POST':
        $data = getRequestBody();
        validateRequired($data, ['titre', 'quantite']);

        $stmt = $db->prepare("
            INSERT INTO annonces (pharmacie_id, produit_id, titre, description, type_annonce, quantite, prix_unitaire, date_expiration, echange_contre, numero_lot, image_url)
            VALUES (:pharmacie_id, :produit_id, :titre, :description, :type_annonce, :quantite, :prix_unitaire, :date_expiration, :echange_contre, :numero_lot, :image_url)
        ");
        $stmt->execute([
            'pharmacie_id' => $pharmacieId,
            'produit_id' => $data['produit_id'] ?? null,
            'titre' => $data['titre'],
            'description' => $data['description'] ?? null,
            'type_annonce' => $data['type_annonce'] ?? 'vente',
            'quantite' => (int)$data['quantite'],
            'prix_unitaire' => $data['prix_unitaire'] ?? null,
            'date_expiration' => $data['date_expiration'] ?? null,
            'echange_contre' => $data['echange_contre'] ?? null,
            'numero_lot' => $data['numero_lot'] ?? null,
            'image_url' => $data['image_url'] ?? null
        ]);

        $annonceId = $db->lastInsertId();
        logAudit("Création annonce", ["annonce_id" => $annonceId, "titre" => $data['titre'], "type" => $data['type_annonce'] ?? 'vente']);
        successResponse(["id" => $annonceId], "Annonce créée avec succès");
        break;

    case 'PUT':
        $id = $_GET['id'] ?? null;
        if (!$id) errorResponse("ID manquant");
        
        $data = getRequestBody();
        $statut = $data['statut'] ?? 'vendue';

        $stmt = $db->prepare("UPDATE annonces SET statut = :statut WHERE id = :id AND pharmacie_id = :pharmacie_id");
        $stmt->execute(['statut' => $statut, 'id' => $id, 'pharmacie_id' => $pharmacieId]);

        if ($stmt->rowCount() > 0) {
            logAudit("Modification annonce", ["annonce_id" => $id, "statut" => $statut]);
            successResponse(null, "Annonce mise à jour");
        } else {
            errorResponse("Non autorisé ou inexistante", 403);
        }
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) errorResponse("ID manquant");

        // Vérifier la propriété avant de supprimer
        $stmt = $db->prepare("DELETE FROM annonces WHERE id = :id AND pharmacie_id = :pharmacie_id");
        $stmt->execute(['id' => $id, 'pharmacie_id' => $pharmacieId]);

        if ($stmt->rowCount() > 0) {
            logAudit("Suppression annonce", ["annonce_id" => $id]);
            successResponse(null, "Annonce supprimée");
        } else {
            errorResponse("Non autorisé ou inexistante", 403);
        }
        break;

    default:
        errorResponse("Méthode non autorisée", 405);
}
