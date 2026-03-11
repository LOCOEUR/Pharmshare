<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$pharmacieId = getAuthenticatedPharmacieId();
$db = (new Database())->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Initiation d'un paiement Wave (Simulation)
    $data = getRequestBody();
    validateRequired($data, ['demande_id', 'telephone']);

    $demandeId = (int)$data['demande_id'];

    // Vérifier si la demande existe et est bien acceptée pour ce demandeur
    $stmt = $db->prepare("
        SELECT d.*, a.prix_unitaire 
        FROM demandes d 
        JOIN annonces a ON d.annonce_id = a.id 
        WHERE d.id = :id AND d.demandeur_id = :pid AND d.statut IN ('acceptee', 'terminee') AND (d.statut_paiement IS NULL OR d.statut_paiement != 'paye')
    ");
    $stmt->execute(['id' => $demandeId, 'pid' => $pharmacieId]);
    $demande = $stmt->fetch();

    if (!$demande) {
        errorResponse("Demande invalide pour le paiement ou déjà payée.", 400);
    }

    $montant = $demande['quantite'] * $demande['prix_unitaire'];
    $refWave = 'WAVE_' . strtoupper(bin2hex(random_bytes(6)));

    // Créer une transaction
    $stmt = $db->prepare("
        INSERT INTO paiements (demande_id, pharmacie_id, montant, methode, statut, reference_externe, telephone)
        VALUES (:did, :pid, :montant, 'wave', 'en_attente', :ref, :tel)
    ");
    $stmt->execute([
        'did' => $demandeId,
        'pid' => $pharmacieId,
        'montant' => $montant,
        'ref' => $refWave,
        'tel' => $data['telephone']
    ]);
    
    $paymentId = $db->lastInsertId();

    successResponse([
        "payment_id" => $paymentId,
        "reference" => $refWave,
        "montant" => $montant,
        "message" => "Veuillez confirmer le paiement sur votre application Wave."
    ]);

} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Vérifier le statut du paiement (Simulation de validation)
    $data = getRequestBody();
    validateRequired($data, ['payment_id']);
    
    $paymentId = (int)$data['payment_id'];

    $stmt = $db->prepare("SELECT * FROM paiements WHERE id = :id AND pharmacie_id = :pid");
    $stmt->execute(['id' => $paymentId, 'pid' => $pharmacieId]);
    $payment = $stmt->fetch();

    if (!$payment) {
        errorResponse("Paiement introuvable", 404);
    }

    if ($payment['statut'] === 'en_attente') {
        // Validation automatique simulée
        $db->beginTransaction();
        try {
            $stmt = $db->prepare("UPDATE paiements SET statut = 'reussi' WHERE id = :id");
            $stmt->execute(['id' => $paymentId]);

            $stmt = $db->prepare("UPDATE demandes SET statut_paiement = 'paye' WHERE id = :did");
            $stmt->execute(['did' => $payment['demande_id']]);

            logAudit("Paiement Wave réussi", ["demande_id" => $payment['demande_id'], "montant" => $payment['montant']]);

            // Notification pour le vendeur
            $stmt = $db->prepare("SELECT destinataire_id, demandeur_id, produit_nom FROM demandes WHERE id = :id");
            $stmt->execute(['id' => $payment['demande_id']]);
            $demandeInfo = $stmt->fetch();

            if ($demandeInfo) {
                // Obtenir le nom de l'acheteur (pour le log de notif)
                $stmtPh = $db->prepare("SELECT nom FROM pharmacies WHERE id = :id");
                $stmtPh->execute(['id' => $demandeInfo['demandeur_id']]);
                $buyerName = $stmtPh->fetchColumn();

                $stmt = $db->prepare("INSERT INTO notifications (pharmacie_id, titre, message, type) VALUES (:pid, 'Paiement Reçu (Wave)', :msg, 'success')");
                $stmt->execute([
                    'pid' => $demandeInfo['destinataire_id'],
                    'msg' => "$buyerName vous a envoyé un paiement Wave de {$payment['montant']} FCFA pour {$demandeInfo['produit_nom']}."
                ]);
            }

            $db->commit();
            successResponse(["statut" => "reussi"]);
        } catch (Exception $e) {
            $db->rollBack();
            errorResponse("Erreur validation paiement: " . $e->getMessage(), 500);
        }
    } else {
        successResponse(["statut" => $payment['statut']]);
    }

} else {
    errorResponse("Méthode non autorisée", 405);
}
