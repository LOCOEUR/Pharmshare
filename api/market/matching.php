<?php
/**
 * API Matching Automatique
 * GET /api/market/matching.php
 */
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$pharmacieId = getAuthenticatedPharmacieId();
$db = (new Database())->getConnection();

// 1. Matching: Achats Opportuns (Stock faible ou Rupture chez moi vs Vente ailleurs)
$stmt = $db->prepare("
    SELECT a.id, IFNULL(p_obj.nom, a.titre) as produit_nom, a.quantite, a.prix_unitaire, p.nom as pharmacie_nom, p.id as partner_id,
           (a.prix_unitaire * a.quantite) as valeur_totale,
           'achat' as match_type
    FROM annonces a
    JOIN pharmacies p ON a.pharmacie_id = p.id
    LEFT JOIN produits p_obj ON a.produit_id = p_obj.id
    JOIN produits my_p ON LOWER(IFNULL(p_obj.nom, a.titre)) = LOWER(my_p.nom)
    WHERE a.pharmacie_id != :id 
    AND a.type_annonce = 'vente' 
    AND a.statut = 'active'
    AND my_p.pharmacie_id = :id2
    AND my_p.stock_actuel <= my_p.stock_minimum
    LIMIT 3
");
$stmt->execute(['id' => $pharmacieId, 'id2' => $pharmacieId]);
$needsMatches = $stmt->fetchAll();

// 2. Matching: Écoulement de Surplus (Recherche ailleurs vs Surplus/DDP chez moi)
$stmt = $db->prepare("
    SELECT a.id, IFNULL(p_obj.nom, a.titre) as produit_nom, a.quantite, p.nom as pharmacie_nom, p.id as partner_id,
           (my_p.prix_vente * a.quantite) as tresorerie_dormante,
           'vente' as match_type
    FROM annonces a
    JOIN pharmacies p ON a.pharmacie_id = p.id
    LEFT JOIN produits p_obj ON a.produit_id = p_obj.id
    JOIN produits my_p ON LOWER(IFNULL(p_obj.nom, a.titre)) = LOWER(my_p.nom)
    WHERE a.pharmacie_id != :id 
    AND a.type_annonce = 'recherche' 
    AND a.statut = 'active'
    AND my_p.pharmacie_id = :id2
    AND (my_p.stock_actuel > (my_p.stock_minimum * 2) OR my_p.date_expiration < DATE_ADD(NOW(), INTERVAL 6 MONTH))
    LIMIT 3
");
$stmt->execute(['id' => $pharmacieId, 'id2' => $pharmacieId]);
$surplusMatches = $stmt->fetchAll();

// 3. Analyse Prédictive (Intelligence Artificielle)
// On va chercher des produits dont le stock va s'épuiser bientôt selon les mouvements
$predictiveAlerts = [];
$stmt = $db->prepare("
    SELECT p.nom, p.stock_actuel, p.stock_minimum,
           (SELECT COUNT(*) FROM mouvements_stock WHERE produit_id = p.id AND type_mouvement = 'sortie' AND date_mouvement > DATE_SUB(NOW(), INTERVAL 30 DAY)) as sorties_mois
    FROM produits p
    WHERE p.pharmacie_id = :id AND p.stock_actuel > 0
");
$stmt->execute(['id' => $pharmacieId]);
$inventory = $stmt->fetchAll();

foreach ($inventory as $item) {
    if ($item['sorties_mois'] > 0) {
        $days_left = floor(($item['stock_actuel'] / $item['sorties_mois']) * 30);
        if ($days_left <= 10) {
            $predictiveAlerts[] = [
                "nom" => $item['nom'],
                "jours_restants" => $days_left,
                "raison" => "Vitesse de rotation élevée"
            ];
        }
    }
}

successResponse([
    "needs" => $needsMatches,
    "surplus" => $surplusMatches,
    "bi_alerts" => array_slice($predictiveAlerts, 0, 2)
]);
