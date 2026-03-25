<?php
/**
 * API Demandes & Commandes
 * GET    /api/requests/index.php          - Lister les demandes
 * POST   /api/requests/index.php          - Créer une demande
 * PUT    /api/requests/index.php?id=X     - Mettre à jour le statut
 */
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$pharmacieId = getAuthenticatedPharmacieId();
$db = (new Database())->getConnection();

switch ($_SERVER['REQUEST_METHOD']) {

    case 'GET':
        $tab = $_GET['tab'] ?? 'received'; // received ou sent
        $search = $_GET['search'] ?? '';
        
        if ($tab === 'received') {
            // Demandes reçues
            $sql = "
                SELECT d.*, a.prix_unitaire,
                       ph.nom as requester, ph.ville as requester_ville, ph.quartier as requester_quartier,
                       ph.adresse as requester_adresse, ph.telephone as requester_telephone,
                       UPPER(LEFT(ph.nom, 2)) as avatar,
                       ph2.nom as recipient, ph2.adresse as recipient_adresse, ph2.telephone as recipient_telephone,
                       ph2.ville as recipient_ville, ph2.responsable as recipient_responsable
                FROM demandes d
                JOIN pharmacies ph ON d.demandeur_id = ph.id
                JOIN pharmacies ph2 ON d.destinataire_id = ph2.id
                LEFT JOIN annonces a ON d.annonce_id = a.id
                WHERE d.destinataire_id = :pharmacie_id
            ";
        } else {
            // Demandes envoyées
            $sql = "
                SELECT d.*, a.prix_unitaire,
                       ph.nom as recipient, ph.ville as recipient_ville, ph.quartier as recipient_quartier,
                       ph.adresse as recipient_adresse, ph.telephone as recipient_telephone,
                       UPPER(LEFT(ph.nom, 2)) as avatar,
                       ph2.nom as requester, ph2.adresse as requester_adresse, ph2.telephone as requester_telephone,
                       ph2.ville as requester_ville, ph2.responsable as requester_responsable
                FROM demandes d
                JOIN pharmacies ph ON d.destinataire_id = ph.id
                JOIN pharmacies ph2 ON d.demandeur_id = ph2.id
                LEFT JOIN annonces a ON d.annonce_id = a.id
                WHERE d.demandeur_id = :pharmacie_id
            ";
        }

        $params = ['pharmacie_id' => $pharmacieId];

        if (!empty($search)) {
            $sql .= " AND (d.produit_nom LIKE :search OR ph.nom LIKE :search2)";
            $params['search'] = "%$search%";
            $params['search2'] = "%$search%";
        }

        $sql .= " ORDER BY d.date_creation DESC";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $demandes = $stmt->fetchAll();

        // Compter les demandes en attente reçues  
        $stmt = $db->prepare("SELECT COUNT(*) FROM demandes WHERE destinataire_id = :id AND statut = 'en_attente'");
        $stmt->execute(['id' => $pharmacieId]);
        $pendingCount = $stmt->fetchColumn();

        successResponse([
            "requests" => $demandes,
            "pending_count" => (int)$pendingCount
        ]);
        break;

    case 'POST':
        $data = getRequestBody();
        validateRequired($data, ['destinataire_id', 'produit_nom', 'quantite']);

        $stmt = $db->prepare("
            INSERT INTO demandes (annonce_id, demandeur_id, destinataire_id, produit_nom, quantite, type_demande, echange_contre, message)
            VALUES (:annonce_id, :demandeur_id, :destinataire_id, :produit_nom, :quantite, :type_demande, :echange_contre, :message)
        ");
        $stmt->execute([
            'annonce_id' => $data['annonce_id'] ?? null,
            'demandeur_id' => $pharmacieId,
            'destinataire_id' => (int)$data['destinataire_id'],
            'produit_nom' => $data['produit_nom'],
            'quantite' => (int)$data['quantite'],
            'type_demande' => $data['type_demande'] ?? 'achat',
            'echange_contre' => $data['echange_contre'] ?? null,
            'message' => $data['message'] ?? null
        ]);

        $demandeId = $db->lastInsertId();

        // 1. Mise à jour de l'annonce : passage en "en_negociation" et mise à jour des stocks
        if ($data['annonce_id']) {
            $stmt = $db->prepare("UPDATE annonces SET statut = 'en_negociation' WHERE id = :id AND statut = 'active'");
            $stmt->execute(['id' => (int)$data['annonce_id']]);

            // Equivalent du trigger 'apres_demande_inseree' : mise à jour des stocks
            $stmt = $db->prepare("
                UPDATE produits p
                JOIN annonces a ON p.id = a.produit_id
                SET p.stock_actuel = p.stock_actuel - :quantite,
                    p.stock_reserve = p.stock_reserve + :quantite
                WHERE a.id = :annonce_id
            ");
            $stmt->execute([
                'quantite' => (int)$data['quantite'],
                'annonce_id' => (int)$data['annonce_id']
            ]);
        }

        // 2. Créer une notification pour le destinataire
        $stmt = $db->prepare("SELECT nom FROM pharmacies WHERE id = :id");
        $stmt->execute(['id' => $pharmacieId]);
        $senderName = $stmt->fetchColumn();

        $stmt = $db->prepare("
            INSERT INTO notifications (pharmacie_id, titre, message, type, lien) 
            VALUES (:id, :titre, :msg, 'demande', '/requests')
        ");
        $stmt->execute([
            'id' => (int)$data['destinataire_id'],
            'titre' => 'Nouvelle demande de dépannage',
            'msg' => "$senderName souhaite emprunter {$data['quantite']} boîtes de {$data['produit_nom']}"
        ]);

        logAudit("Nouvelle demande", ["demande_id" => $demandeId, "destinataire_id" => (int)$data['destinataire_id'], "produit_nom" => $data['produit_nom']]);

        successResponse(["id" => $demandeId], "Demande envoyée");
        break;

    case 'PUT':
        $id = $_GET['id'] ?? null;
        if (!$id) errorResponse("ID de la demande requis");

        $data = getRequestBody();
        validateRequired($data, ['statut']);

        $validStatuts = ['acceptee', 'refusee', 'annulee', 'terminee'];
        if (!in_array($data['statut'], $validStatuts)) {
            errorResponse("Statut invalide");
        }

        // Vérifier que la demande concerne cette pharmacie
        $stmt = $db->prepare("SELECT * FROM demandes WHERE id = :id AND (demandeur_id = :pid1 OR destinataire_id = :pid2)");
        $stmt->execute(['id' => $id, 'pid1' => $pharmacieId, 'pid2' => $pharmacieId]);
        $demande = $stmt->fetch();
        if (!$demande) errorResponse("Demande non trouvée", 404);

        $params = ['id' => $id, 'statut' => $data['statut']];
        $sql = "UPDATE demandes SET statut = :statut";
        
        if (isset($data['motif_refus'])) {
            $sql .= ", motif_refus = :motif";
            $params['motif'] = $data['motif_refus'];
        }
        
        $sql .= " WHERE id = :id";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);

        // --- Début du remplacement des triggers MySQL ---
        $oldStatut = $demande['statut'];
        $nouveauStatut = $data['statut'];
        $quantite = (int)$demande['quantite'];
        $annonceId = $demande['annonce_id'];

        if ($nouveauStatut === 'terminee' && $oldStatut !== 'terminee' && $annonceId) {
            // Equivalent du trigger : libère le stock réservé car la demande est confirmée
            $stmt = $db->prepare("
                UPDATE produits p
                JOIN annonces a ON p.id = a.produit_id
                SET p.stock_reserve = p.stock_reserve - :quantite
                WHERE a.id = :annonce_id
            ");
            $stmt->execute(['quantite' => $quantite, 'annonce_id' => $annonceId]);

            // Mise à jour de l'annonce en 'vendue'
            $stmt = $db->prepare("UPDATE annonces SET statut = 'vendue' WHERE id = :id");
            $stmt->execute(['id' => $annonceId]);

        } elseif (in_array($nouveauStatut, ['annulee', 'refusee']) && $oldStatut === 'en_attente' && $annonceId) {
            // Equivalent du trigger : remet le stock réservé dans le stock disponible
            $stmt = $db->prepare("
                UPDATE produits p
                JOIN annonces a ON p.id = a.produit_id
                SET p.stock_actuel = p.stock_actuel + :quantite,
                    p.stock_reserve = p.stock_reserve - :quantite
                WHERE a.id = :annonce_id
            ");
            $stmt->execute(['quantite' => $quantite, 'annonce_id' => $annonceId]);

            // On remet l'annonce en état 'active' si ce n'est plus en négociation
            $stmt = $db->prepare("UPDATE annonces SET statut = 'active' WHERE id = :id AND statut = 'en_negociation'");
            $stmt->execute(['id' => $annonceId]);
        }
        // --- Fin du remplacement ---

        // Notification
        $notifTarget = ($demande['demandeur_id'] == $pharmacieId) ? $demande['destinataire_id'] : $demande['demandeur_id'];
        $statutTxt = ['acceptee' => 'acceptée', 'refusee' => 'refusée', 'annulee' => 'annulée', 'terminee' => 'terminée'];
        $stmt = $db->prepare("
            INSERT INTO notifications (pharmacie_id, titre, message, type, lien) 
            VALUES (:id, :titre, :msg, 'demande', '/requests')
        ");
        $stmt->execute([
            'id' => $notifTarget,
            'titre' => "Demande {$statutTxt[$data['statut']]}",
            'msg' => "La demande pour {$demande['produit_nom']} a été {$statutTxt[$data['statut']]}"
        ]);

        logAudit("Modification statut demande", ["demande_id" => $id, "nouveau_statut" => $data['statut'], "produit_nom" => $demande['produit_nom']]);

        successResponse(null, "Statut mis à jour");
        break;

    default:
        errorResponse("Méthode non autorisée", 405);
}
