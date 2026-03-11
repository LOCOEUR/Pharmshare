<?php
/**
 * API Chat / Messages
 * GET  /api/chat/index.php                       - Lister les conversations
 * GET  /api/chat/index.php?conversation_id=X      - Messages d'une conversation
 * POST /api/chat/index.php                        - Envoyer un message
 */
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/helpers.php';

$pharmacieId = getAuthenticatedPharmacieId();
$db = (new Database())->getConnection();

switch ($_SERVER['REQUEST_METHOD']) {

    case 'GET':
        $conversationId = $_GET['conversation_id'] ?? null;

        if ($conversationId) {
            // Messages d'une conversation
            $stmt = $db->prepare("
                SELECT c.* FROM conversations c 
                WHERE c.id = :cid AND (c.pharmacie_1_id = :pid1 OR c.pharmacie_2_id = :pid2)
            ");
            $stmt->execute(['cid' => $conversationId, 'pid1' => $pharmacieId, 'pid2' => $pharmacieId]);
            if (!$stmt->fetch()) errorResponse("Conversation non trouvée", 404);

            // Marquer les messages comme lus
            $stmt = $db->prepare("
                UPDATE messages SET lu = 1 
                WHERE conversation_id = :cid AND expediteur_id != :pid AND lu = 0
            ");
            $stmt->execute(['cid' => $conversationId, 'pid' => $pharmacieId]);

            // Récupérer les messages
            $stmt = $db->prepare("
                SELECT m.id, m.conversation_id, m.expediteur_id, m.contenu, m.fichier_url, m.fichier_type, m.lu, m.date_envoi,
                       ph.nom as expediteur_nom, UPPER(LEFT(ph.nom, 2)) as avatar
                FROM messages m
                JOIN pharmacies ph ON m.expediteur_id = ph.id
                WHERE m.conversation_id = :cid
                ORDER BY m.date_envoi ASC
            ");
            $stmt->execute(['cid' => $conversationId]);
            $messages = $stmt->fetchAll();

            successResponse($messages);
        } else {
            // Lister les conversations
            $stmt = $db->prepare("
                SELECT c.*,
                    CASE 
                        WHEN c.pharmacie_1_id = :pid THEN p2.nom
                        ELSE p1.nom
                    END as partner_nom,
                    CASE 
                        WHEN c.pharmacie_1_id = :pid2 THEN p2.id
                        ELSE p1.id
                    END as partner_id,
                    CASE 
                        WHEN c.pharmacie_1_id = :pid3 THEN UPPER(LEFT(p2.nom, 2))
                        ELSE UPPER(LEFT(p1.nom, 2))
                    END as partner_avatar,
                    CASE 
                        WHEN c.pharmacie_1_id = :pid4 THEN p2.quartier
                        ELSE p1.quartier
                    END as partner_quartier,
                    (SELECT contenu FROM messages WHERE conversation_id = c.id ORDER BY date_envoi DESC LIMIT 1) as dernier_message,
                    (SELECT date_envoi FROM messages WHERE conversation_id = c.id ORDER BY date_envoi DESC LIMIT 1) as dernier_message_date,
                    (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND expediteur_id != :pid5 AND lu = 0) as non_lus
                FROM conversations c
                JOIN pharmacies p1 ON c.pharmacie_1_id = p1.id
                JOIN pharmacies p2 ON c.pharmacie_2_id = p2.id
                WHERE c.pharmacie_1_id = :pid6 OR c.pharmacie_2_id = :pid7
                ORDER BY c.derniere_activite DESC
            ");
            $stmt->execute([
                'pid' => $pharmacieId, 'pid2' => $pharmacieId, 'pid3' => $pharmacieId,
                'pid4' => $pharmacieId, 'pid5' => $pharmacieId, 'pid6' => $pharmacieId,
                'pid7' => $pharmacieId
            ]);
            $conversations = $stmt->fetchAll();

            successResponse($conversations);
        }
        break;

    case 'POST':
        $data = getRequestBody();
        validateRequired($data, ['contenu']);

        $conversationId = $data['conversation_id'] ?? null;

        // Si pas de conversation, en créer une
        if (!$conversationId && isset($data['partner_id'])) {
            $partnerId = (int)$data['partner_id'];
            $p1 = min($pharmacieId, $partnerId);
            $p2 = max($pharmacieId, $partnerId);

            // Vérifier si la conversation existe déjà
            $stmt = $db->prepare("SELECT id FROM conversations WHERE pharmacie_1_id = :p1 AND pharmacie_2_id = :p2");
            $stmt->execute(['p1' => $p1, 'p2' => $p2]);
            $conv = $stmt->fetch();

            if ($conv) {
                $conversationId = $conv['id'];
            } else {
                $stmt = $db->prepare("INSERT INTO conversations (pharmacie_1_id, pharmacie_2_id) VALUES (:p1, :p2)");
                $stmt->execute(['p1' => $p1, 'p2' => $p2]);
                $conversationId = $db->lastInsertId();
            }
        }

        if (!$conversationId) errorResponse("conversation_id ou partner_id requis");

        // Vérifier l'accès
        $stmt = $db->prepare("SELECT * FROM conversations WHERE id = :cid AND (pharmacie_1_id = :p1 OR pharmacie_2_id = :p2)");
        $stmt->execute(['cid' => $conversationId, 'p1' => $pharmacieId, 'p2' => $pharmacieId]);
        $conv = $stmt->fetch();
        if (!$conv) errorResponse("Conversation non trouvée", 404);

        // Insérer le message
        $stmt = $db->prepare("
            INSERT INTO messages (conversation_id, expediteur_id, contenu) 
            VALUES (:cid, :eid, :contenu)
        ");
        $stmt->execute([
            'cid' => $conversationId,
            'eid' => $pharmacieId,
            'contenu' => $data['contenu']
        ]);

        // Mettre à jour la dernière activité
        $stmt = $db->prepare("UPDATE conversations SET derniere_activite = NOW() WHERE id = :cid");
        $stmt->execute(['cid' => $conversationId]);

        // Notification au partenaire
        $partnerId = ($conv['pharmacie_1_id'] == $pharmacieId) ? $conv['pharmacie_2_id'] : $conv['pharmacie_1_id'];
        $stmt = $db->prepare("SELECT nom FROM pharmacies WHERE id = :id");
        $stmt->execute(['id' => $pharmacieId]);
        $senderName = $stmt->fetchColumn();

        $stmt = $db->prepare("
            INSERT INTO notifications (pharmacie_id, titre, message, type, lien) 
            VALUES (:id, :titre, :msg, 'message', '/chat')
        ");
        $stmt->execute([
            'id' => $partnerId,
            'titre' => "Nouveau message de $senderName",
            'msg' => substr($data['contenu'], 0, 100)
        ]);

        successResponse([
            "message_id" => $db->lastInsertId(),
            "conversation_id" => $conversationId
        ], "Message envoyé");
        break;

    default:
        errorResponse("Méthode non autorisée", 405);
}
