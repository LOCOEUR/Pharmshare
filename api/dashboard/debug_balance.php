<?php
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';

try {
    $db = (new Database())->getConnection();
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $db->prepare("
        SELECT d.id, d.produit_nom, d.quantite, d.date_creation, d.statut, d.statut_paiement,
               COALESCE(MAX(a.prix_unitaire), 0) as valeur_unitaire,
               COALESCE(MAX(a.prix_unitaire) * d.quantite, MAX(p.montant), 0) as total_valeur,
               MAX(ph.nom) as partenaire_nom, MAX(ph.telephone) as partenaire_telephone,
               MAX(ph.adresse) as partenaire_adresse, MAX(ph.ville) as partenaire_ville
        FROM demandes d
        JOIN pharmacies ph ON d.destinataire_id = ph.id
        LEFT JOIN annonces a ON d.annonce_id = a.id
        LEFT JOIN paiements p ON p.demande_id = d.id AND p.statut = 'reussi'
        WHERE d.demandeur_id = 1 
          AND d.statut NOT IN ('en_attente', 'annulee', 'refusee')
        GROUP BY d.id, d.produit_nom, d.quantite, d.date_creation, d.statut, d.statut_paiement
        ORDER BY d.date_creation DESC
    ");
    $stmt->execute();
    $dettes = $stmt->fetchAll();

    echo json_encode([
        "success" => true,
        "message" => "Requête réussie ! Les tables et colonnes existent bien.",
        "results_count" => count($dettes)
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "error" => "Erreur SQL : " . $e->getMessage(),
        "suggestion" => "Vérifiez que la base de données de production contient bien toutes les tables (ex: paiements) et colonnes (ex: statut_paiement dans demandes)."
    ]);
}
