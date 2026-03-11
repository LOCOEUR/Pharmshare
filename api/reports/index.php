<?php
/**
 * API Rapports
 * GET  /api/reports/index.php                    - Lister les rapports
 * GET  /api/reports/index.php?type=inventaire     - Stats inventaire
 * GET  /api/reports/index.php?type=echanges       - Stats échanges
 * GET  /api/reports/index.php?type=expirations    - Stats expirations
 * POST /api/reports/index.php                     - Générer un rapport
 */
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$pharmacieId = getAuthenticatedPharmacieId();
$db = (new Database())->getConnection();

switch ($_SERVER['REQUEST_METHOD']) {

    case 'GET':
        $type = $_GET['type'] ?? null;

        if ($type === 'inventaire') {
            // Stats inventaire
            $stmt = $db->prepare("
                SELECT 
                    COUNT(*) as total_produits,
                    SUM(stock_actuel) as stock_total,
                    SUM(CASE WHEN stock_actuel <= stock_minimum THEN 1 ELSE 0 END) as produits_alerte,
                    SUM(CASE WHEN stock_actuel <= 10 THEN 1 ELSE 0 END) as ruptures,
                    SUM(stock_actuel * COALESCE(prix_vente, 0)) as valeur_totale
                FROM produits WHERE pharmacie_id = :id
            ");
            $stmt->execute(['id' => $pharmacieId]);
            $stats = $stmt->fetch();

            // Répartition par forme
            $stmt = $db->prepare("
                SELECT forme, COUNT(*) as count, SUM(stock_actuel) as stock
                FROM produits WHERE pharmacie_id = :id
                GROUP BY forme ORDER BY count DESC
            ");
            $stmt->execute(['id' => $pharmacieId]);
            $byForm = $stmt->fetchAll();

            // Mouvements récents
            $stmt = $db->prepare("
                SELECT ms.*, p.nom as produit_nom
                FROM mouvements_stock ms
                JOIN produits p ON ms.produit_id = p.id
                WHERE ms.pharmacie_id = :id
                ORDER BY ms.date_mouvement DESC LIMIT 10
            ");
            $stmt->execute(['id' => $pharmacieId]);
            $mouvements = $stmt->fetchAll();

            successResponse([
                "stats" => $stats,
                "by_form" => $byForm,
                "mouvements" => $mouvements
            ]);

        } elseif ($type === 'echanges') {
            // Stats échanges
            $stmt = $db->prepare("
                SELECT 
                    COUNT(*) as total_demandes,
                    SUM(CASE WHEN statut = 'terminee' THEN 1 ELSE 0 END) as terminees,
                    SUM(CASE WHEN statut = 'en_attente' THEN 1 ELSE 0 END) as en_attente,
                    SUM(CASE WHEN statut = 'acceptee' THEN 1 ELSE 0 END) as acceptees,
                    SUM(CASE WHEN statut = 'refusee' THEN 1 ELSE 0 END) as refusees
                FROM demandes 
                WHERE demandeur_id = :id OR destinataire_id = :id2
            ");
            $stmt->execute(['id' => $pharmacieId, 'id2' => $pharmacieId]);
            $stats = $stmt->fetch();

            // Échanges par mois
            $stmt = $db->prepare("
                SELECT DATE_FORMAT(date_creation, '%Y-%m') as mois, COUNT(*) as total
                FROM demandes 
                WHERE (demandeur_id = :id OR destinataire_id = :id2) AND statut = 'terminee'
                GROUP BY mois ORDER BY mois DESC LIMIT 12
            ");
            $stmt->execute(['id' => $pharmacieId, 'id2' => $pharmacieId]);
            $byMonth = $stmt->fetchAll();

            // Top partenaires
            $stmt = $db->prepare("
                SELECT ph.nom, COUNT(*) as exchanges
                FROM demandes d 
                JOIN pharmacies ph ON (CASE WHEN d.demandeur_id = :id THEN d.destinataire_id ELSE d.demandeur_id END) = ph.id
                WHERE (d.demandeur_id = :id2 OR d.destinataire_id = :id3) AND d.statut = 'terminee'
                GROUP BY ph.nom ORDER BY exchanges DESC LIMIT 5
            ");
            $stmt->execute(['id' => $pharmacieId, 'id2' => $pharmacieId, 'id3' => $pharmacieId]);
            $topPartners = $stmt->fetchAll();

            successResponse([
                "stats" => $stats,
                "by_month" => $byMonth,
                "top_partners" => $topPartners
            ]);

        } elseif ($type === 'expirations') {
            // Produits proches de la péremption
            $stmt = $db->prepare("
                SELECT nom, forme, stock_actuel, date_expiration, 
                       DATEDIFF(date_expiration, CURDATE()) as jours_restants
                FROM produits 
                WHERE pharmacie_id = :id 
                  AND date_expiration IS NOT NULL 
                  AND date_expiration <= DATE_ADD(CURDATE(), INTERVAL 180 DAY)
                ORDER BY date_expiration ASC
            ");
            $stmt->execute(['id' => $pharmacieId]);
            $expirations = $stmt->fetchAll();

            successResponse($expirations);

        } elseif ($type === 'bi') {
            // Vue d'ensemble BI consolidée
            
            // 1. Stats d'échanges et économies
            $stmt = $db->prepare("
                SELECT 
                    COUNT(*) as total_demandes,
                    SUM(CASE WHEN d.statut = 'terminee' THEN 1 ELSE 0 END) as terminees,
                    -- Estimation des économies (basée sur la valeur des produits échangés/vendus)
                    SUM(CASE WHEN d.statut = 'terminee' THEN (d.quantite * COALESCE(a.prix_unitaire, 1500)) ELSE 0 END) as economies_estimees
                FROM demandes d
                LEFT JOIN annonces a ON d.annonce_id = a.id
                WHERE d.demandeur_id = :id OR d.destinataire_id = :id2
            ");
            $stmt->execute(['id' => $pharmacieId, 'id2' => $pharmacieId]);
            $exchangeStats = $stmt->fetch();

            // 2. Évolution sur les 6 derniers mois
            $stmt = $db->prepare("
                SELECT 
                    DATE_FORMAT(date_creation, '%b') as label,
                    COUNT(*) as value
                FROM demandes 
                WHERE (demandeur_id = :id OR destinataire_id = :id2) 
                  AND date_creation >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
                GROUP BY label
                ORDER BY MIN(date_creation) ASC
            ");
            $stmt->execute(['id' => $pharmacieId, 'id2' => $pharmacieId]);
            $monthlyStats = $stmt->fetchAll();

            // 3. Calculs BI
            $totalVal = (float)$exchangeStats['economies_estimees'];
            
            // 4. Dernières transactions
            $stmt = $db->prepare("
                SELECT d.id, 'Échange' as type, d.produit_nom as item, 
                       CONCAT(FORMAT(d.quantite * COALESCE(a.prix_unitaire, 1500), 0), ' F') as amount, 
                       d.date_creation as date, 'Complété' as status
                FROM demandes d
                LEFT JOIN annonces a ON d.annonce_id = a.id
                WHERE (d.demandeur_id = :id OR d.destinataire_id = :id2) AND d.statut = 'terminee'
                ORDER BY d.date_creation DESC LIMIT 5
            ");
            $stmt->execute(['id' => $pharmacieId, 'id2' => $pharmacieId]);
            $transactions = $stmt->fetchAll();

            successResponse([
                "kpis" => [
                    "total_exchange_value" => $totalVal,
                    "economies" => $totalVal * 0.85,
                    "transactions_count" => (int)$exchangeStats['total_demandes'],
                    "pertes_evitees" => $totalVal * 0.35
                ],
                "monthly_stats" => $monthlyStats,
                "traffic_sources" => [
                    ["name" => "Économies directes", "percentage" => 45, "color" => "#10B981"],
                    ["name" => "Pertes Évitées", "percentage" => 35, "color" => "#60A5FA"],
                    ["name" => "Ventes Surplus", "percentage" => 20, "color" => "#FBBF24"]
                ],
                "transactions" => $transactions
            ]);

        } else {
            // Liste des rapports sauvegardés
            $stmt = $db->prepare("
                SELECT * FROM rapports WHERE pharmacie_id = :id ORDER BY date_creation DESC LIMIT 20
            ");
            $stmt->execute(['id' => $pharmacieId]);
            $rapports = $stmt->fetchAll();

            successResponse($rapports);
        }
        break;

    case 'POST':
        $data = getRequestBody();
        validateRequired($data, ['type_rapport', 'titre']);

        $stmt = $db->prepare("
            INSERT INTO rapports (pharmacie_id, type_rapport, titre, contenu, periode_debut, periode_fin)
            VALUES (:pid, :type, :titre, :contenu, :debut, :fin)
        ");
        $stmt->execute([
            'pid' => $pharmacieId,
            'type' => $data['type_rapport'],
            'titre' => $data['titre'],
            'contenu' => json_encode($data['contenu'] ?? []),
            'debut' => $data['periode_debut'] ?? null,
            'fin' => $data['periode_fin'] ?? null
        ]);

        successResponse(["id" => $db->lastInsertId()], "Rapport généré");
        break;

    default:
        errorResponse("Méthode non autorisée", 405);
}
