<?php
/**
 * API Balance Confraternelle (Dettes et Créances)
 */
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$pharmacieId = getAuthenticatedPharmacieId();
$db = (new Database())->getConnection();

// --- SOLDE UNE DEMANDE ---
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = getRequestBody();
    $id = $data['id'] ?? null;
    if (!$id) errorResponse("ID manquant");

    // Marquer l'échange comme compensé
    $stmt = $db->prepare("UPDATE demandes SET statut = 'compense' WHERE id = :id");
    $stmt->execute(['id' => $id]);
    
    successResponse(null, "Echange regle");
    exit;
}

// --- LISTER TOUT L'HISTORIQUE ---

/**
 * Note sur le Prix (0 F) : 
 * Si l'annonce originale est modifiee/supprimee (a.id is NULL), 
 * on tente de recuperer le prix d'une autre annonce du MEME produit si possible,
 * ou on laisse 0 si aucune trace.
 */

// 1. Ce que JE DOIS rendre (Mes Dettes) : Demandeur = Moi
$stmt = $db->prepare("
    SELECT d.id, d.produit_nom, d.quantite, d.date_creation, d.statut, d.statut_paiement,
           COALESCE(a.prix_unitaire, (
               SELECT prix_unitaire FROM annonces 
               WHERE produit_id = (SELECT produit_id FROM annonces WHERE id = d.annonce_id)
               LIMIT 1
           ), 0) as valeur_unitaire,
           COALESCE(a.prix_unitaire * d.quantite, (SELECT montant FROM paiements WHERE demande_id = d.id AND statut = 'reussi' LIMIT 1), 0) as total_valeur,
           ph.nom as partenaire_nom, ph.telephone as partenaire_telephone,
           ph.adresse as partenaire_adresse, ph.ville as partenaire_ville
    FROM demandes d
    JOIN pharmacies ph ON d.destinataire_id = ph.id
    LEFT JOIN annonces a ON d.annonce_id = a.id
    WHERE d.demandeur_id = :id 
      AND d.statut NOT IN ('en_attente', 'annulee', 'refusee')
    ORDER BY d.date_creation DESC
");
$stmt->execute(['id' => $pharmacieId]);
$dettes = $stmt->fetchAll();

// 2. Ce qu'ON ME DOIT (Mes Creances) : Destinataire = Moi
$stmt = $db->prepare("
    SELECT d.id, d.produit_nom, d.quantite, d.date_creation, d.statut, d.statut_paiement,
           COALESCE(a.prix_unitaire, (
               SELECT prix_unitaire FROM annonces 
               WHERE produit_id = (SELECT produit_id FROM annonces WHERE id = d.annonce_id)
               LIMIT 1
           ), 0) as valeur_unitaire,
           COALESCE(a.prix_unitaire * d.quantite, (SELECT montant FROM paiements WHERE demande_id = d.id AND statut = 'reussi' LIMIT 1), 0) as total_valeur,
           ph.nom as partenaire_nom, ph.telephone as partenaire_telephone,
           ph.adresse as partenaire_adresse, ph.ville as partenaire_ville
    FROM demandes d
    JOIN pharmacies ph ON d.demandeur_id = ph.id
    LEFT JOIN annonces a ON d.annonce_id = a.id
    WHERE d.destinataire_id = :id 
      AND d.statut NOT IN ('en_attente', 'annulee', 'refusee')
    ORDER BY d.date_creation DESC
");
$stmt->execute(['id' => $pharmacieId]);
$creances = $stmt->fetchAll();

successResponse([
    "dettes" => $dettes,
    "creances" => $creances
]);
