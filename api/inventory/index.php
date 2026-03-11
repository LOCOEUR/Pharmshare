<?php
/**
 * API Inventaire
 * GET    /api/inventory/index.php          - Lister les produits
 * POST   /api/inventory/index.php          - Ajouter un produit
 * PUT    /api/inventory/index.php?id=X     - Modifier un produit
 * DELETE /api/inventory/index.php?id=X     - Supprimer un produit
 */
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$pharmacieId = getAuthenticatedPharmacieId();
$db = (new Database())->getConnection();

switch ($_SERVER['REQUEST_METHOD']) {

    case 'GET':
        $search = $_GET['search'] ?? '';
        $filter = $_GET['filter'] ?? 'all'; // tous, stock_faible, expirant, rupture
        
        $sql = "SELECT p.* 
                FROM produits p 
                WHERE p.pharmacie_id = :pharmacie_id";
        $params = ['pharmacie_id' => $pharmacieId];

        if (!empty($search)) {
            $sql .= " AND (p.nom LIKE :search OR p.code_barre LIKE :search2)";
            $params['search'] = "%$search%";
            $params['search2'] = "%$search%";
        }

        switch ($filter) {
            case 'stock_low':
                $sql .= " AND p.stock_actuel <= p.stock_minimum AND p.stock_actuel > 0";
                break;
            case 'expiring':
                $sql .= " AND p.date_expiration <= DATE_ADD(CURDATE(), INTERVAL 90 DAY) AND p.date_expiration > CURDATE() AND p.stock_actuel > 0";
                break;
            case 'out_of_stock':
                $sql .= " AND p.stock_actuel = 0";
                break;
        }

        $sql .= " ORDER BY p.date_modification DESC";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $produits = $stmt->fetchAll();

        // Compteurs pour les filtres
        $stmt = $db->prepare("SELECT COUNT(*) FROM produits WHERE pharmacie_id = :id AND stock_actuel <= stock_minimum AND stock_actuel > 0");
        $stmt->execute(['id' => $pharmacieId]);
        $countLow = $stmt->fetchColumn();

        $stmt = $db->prepare("SELECT COUNT(*) FROM produits WHERE pharmacie_id = :id AND date_expiration <= DATE_ADD(CURDATE(), INTERVAL 90 DAY) AND date_expiration > CURDATE() AND stock_actuel > 0");
        $stmt->execute(['id' => $pharmacieId]);
        $countExpiring = $stmt->fetchColumn();

        $stmt = $db->prepare("SELECT COUNT(*) FROM produits WHERE pharmacie_id = :id AND stock_actuel = 0");
        $stmt->execute(['id' => $pharmacieId]);
        $countOut = $stmt->fetchColumn();

        successResponse([
            "produits" => $produits,
            "counts" => [
                "stock_low" => (int)$countLow,
                "expiring" => (int)$countExpiring,
                "out_of_stock" => (int)$countOut
            ]
        ]);
        break;

    case 'POST':
        $data = getRequestBody();
        validateRequired($data, ['nom', 'stock_actuel', 'stock_minimum']);

        // Déterminer le statut automatiquement
        $stock = (int)$data['stock_actuel'];
        $min = (int)$data['stock_minimum'];
        $statut = 'en_stock';
        if ($stock === 0) $statut = 'rupture';
        elseif ($stock <= $min) $statut = 'stock_faible';

        $stmt = $db->prepare("
            INSERT INTO produits (pharmacie_id, nom, forme, dosage, code_barre, stock_actuel, stock_minimum, prix_achat, prix_vente, date_expiration, lot_numero, fournisseur, statut, image_url)
            VALUES (:pharmacie_id, :nom, :forme, :dosage, :code_barre, :stock_actuel, :stock_minimum, :prix_achat, :prix_vente, :date_expiration, :lot_numero, :fournisseur, :statut, :image_url)
        ");
        $stmt->execute([
            'pharmacie_id' => $pharmacieId,
            'nom' => $data['nom'],
            'forme' => $data['forme'] ?? 'Comprimé',
            'dosage' => $data['dosage'] ?? null,
            'code_barre' => $data['code_barre'] ?? null,
            'stock_actuel' => $stock,
            'stock_minimum' => $min,
            'prix_achat' => $data['prix_achat'] ?? null,
            'prix_vente' => $data['prix_vente'] ?? null,
            'date_expiration' => $data['date_expiration'] ?? null,
            'lot_numero' => $data['lot_numero'] ?? null,
            'fournisseur' => $data['fournisseur'] ?? null,
            'statut' => $statut,
            'image_url' => $data['image_url'] ?? null
        ]);

        $produitId = $db->lastInsertId();

        // Enregistrer le mouvement de stock
        $stmt = $db->prepare("
            INSERT INTO mouvements_stock (produit_id, pharmacie_id, type_mouvement, quantite, stock_avant, stock_apres, reference, commentaire)
            VALUES (:produit_id, :pharmacie_id, 'entree', :quantite, 0, :stock_apres, :reference, 'Création du produit')
        ");
        $stmt->execute([
            'produit_id' => $produitId,
            'pharmacie_id' => $pharmacieId,
            'quantite' => $stock,
            'stock_apres' => $stock,
            'reference' => 'INIT-' . $produitId
        ]);

        logAudit("Création produit", ["produit_id" => $produitId, "nom" => $data['nom'], "stock" => $stock]);

        successResponse(["id" => $produitId], "Produit ajouté avec succès");
        break;

    case 'PUT':
        $id = $_GET['id'] ?? null;
        if (!$id) errorResponse("ID du produit requis");

        $data = getRequestBody();
        
        // Vérifier que le produit appartient à la pharmacie
        $stmt = $db->prepare("SELECT id, stock_actuel FROM produits WHERE id = :id AND pharmacie_id = :pharmacie_id");
        $stmt->execute(['id' => $id, 'pharmacie_id' => $pharmacieId]);
        $produit = $stmt->fetch();
        if (!$produit) errorResponse("Produit non trouvé", 404);

        $fields = [];
        $params = ['id' => $id];

        $updatable = ['nom', 'forme', 'dosage', 'code_barre', 'stock_actuel', 'stock_minimum', 'prix_achat', 'prix_vente', 'date_expiration', 'lot_numero', 'fournisseur', 'image_url'];
        foreach ($updatable as $field) {
            if (isset($data[$field])) {
                $fields[] = "$field = :$field";
                $params[$field] = $data[$field];
            }
        }

        if (empty($fields)) errorResponse("Aucun champ à mettre à jour");

        // Mettre à jour le statut si le stock a changé
        if (isset($data['stock_actuel'])) {
            $newStock = (int)$data['stock_actuel'];
            $min = (int)($data['stock_minimum'] ?? $produit['stock_minimum'] ?? 10);
            $statut = 'en_stock';
            if ($newStock === 0) $statut = 'rupture';
            elseif ($newStock <= $min) $statut = 'stock_faible';
            $fields[] = "statut = :statut";
            $params['statut'] = $statut;

            // Enregistrer le mouvement
            $oldStock = $produit['stock_actuel'];
            $diff = $newStock - $oldStock;
            $type = $diff >= 0 ? 'entree' : 'sortie';
            $stmtMov = $db->prepare("
                INSERT INTO mouvements_stock (produit_id, pharmacie_id, type_mouvement, quantite, stock_avant, stock_apres, commentaire)
                VALUES (:produit_id, :pharmacie_id, :type, :quantite, :avant, :apres, 'Mise à jour manuelle')
            ");
            $stmtMov->execute([
                'produit_id' => $id,
                'pharmacie_id' => $pharmacieId,
                'type' => $type,
                'quantite' => abs($diff),
                'avant' => $oldStock,
                'apres' => $newStock
            ]);
        }

        $sql = "UPDATE produits SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);

        logAudit("Modification produit", ["produit_id" => $id, "nom" => $produit['nom'] ?? "ID $id", "champs_modifies" => array_keys($data)]);

        successResponse(null, "Produit mis à jour");
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) errorResponse("ID du produit requis");

        $stmt = $db->prepare("DELETE FROM produits WHERE id = :id AND pharmacie_id = :pharmacie_id");
        $stmt->execute(['id' => $id, 'pharmacie_id' => $pharmacieId]);

        if ($stmt->rowCount() === 0) errorResponse("Produit non trouvé", 404);

        logAudit("Suppression produit", ["produit_id" => $id]);

        successResponse(null, "Produit supprimé");
        break;

    default:
        errorResponse("Méthode non autorisée", 405);
}
