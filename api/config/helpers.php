<?php
require_once __DIR__ . '/jwt.php';

/**
 * Helper pour les réponses JSON
 */
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function errorResponse($message, $statusCode = 400) {
    jsonResponse(["success" => false, "error" => $message], $statusCode);
}

function successResponse($data, $message = "Succès") {
    jsonResponse(["success" => true, "message" => $message, "data" => $data]);
}

/**
 * Nettoie les données pour éviter les injections XSS
 */
function sanitizeInput($data) {
    if (is_array($data)) {
        foreach ($data as $key => $value) {
            $data[$key] = sanitizeInput($value);
        }
    } elseif (is_string($data)) {
        // Supprime les balises HTML et encode les caractères spéciaux
        return htmlspecialchars(strip_tags($data), ENT_QUOTES, 'UTF-8');
    }
    return $data;
}

/**
 * Récupère les données JSON du body de la requête
 */
function getRequestBody() {
    $body = file_get_contents("php://input");
    $data = json_decode($body, true);
    return $data ?: [];
}

/**
 * Vérifie que les champs requis sont présents
 */
function validateRequired($data, $fields) {
    $missing = [];
    foreach ($fields as $field) {
        if (!isset($data[$field]) || (is_string($data[$field]) && trim($data[$field]) === '')) {
            $missing[] = $field;
        }
    }
    if (!empty($missing)) {
        errorResponse("Champs requis manquants: " . implode(', ', $missing));
    }
}

/**
 * Hashage sécurisé du mot de passe
 */
function hashPassword($password) {
    return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
}

/**
 * Vérification du mot de passe
 */
function verifyPassword($password, $hash) {
    return password_verify($password, $hash);
}

/**
 * Génère un token JWT simple
 */
function generateToken($userId, $pharmacieId) {
    $header = base64_encode(json_encode(["alg" => "HS256", "typ" => "JWT"]));
    $payload = base64_encode(json_encode([
        "user_id" => $userId,
        "pharmacie_id" => $pharmacieId,
        "iat" => time(),
        "exp" => time() + JWT_EXPIRY
    ]));
    $secret = JWT_SECRET;
    $signature = base64_encode(hash_hmac('sha256', "$header.$payload", $secret, true));
    return "$header.$payload.$signature";
}

/**
 * Vérifie et décode un token JWT
 */
function verifyToken($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;

    $secret = JWT_SECRET;
    $expectedSig = base64_encode(hash_hmac('sha256', "$parts[0].$parts[1]", $secret, true));

    if ($expectedSig !== $parts[2]) return null;

    $payload = json_decode(base64_decode($parts[1]), true);
    if ($payload['exp'] < time()) return null;

    return $payload;
}

/**
 * Récupère l'ID de la pharmacie depuis le token d'authentification
 */
function getAuthenticatedPharmacieId() {
    $payload = getAuthenticatedTokenPayload();
    return $payload['pharmacie_id'];
}

/**
 * Récupère l'ID de l'utilisateur depuis le token d'authentification
 */
function getAuthenticatedUserId() {
    $payload = getAuthenticatedTokenPayload();
    return $payload['user_id'];
}

/**
 * Récupère le payload décodé du token si authentifié
 */
function getAuthenticatedTokenPayload() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    
    if (empty($authHeader) || !str_starts_with($authHeader, 'Bearer ')) {
        errorResponse("Non authentifié", 401);
    }

    $token = substr($authHeader, 7);
    $payload = verifyToken($token);

    if (!$payload) {
        errorResponse("Token invalide ou expiré", 401);
    }

    return $payload;
}

/**
 * Enregistre une action dans le journal d'audit
 */
function logAudit($action, $details = null) {
    try {
        global $db;
        $pdo = $db ?? (new Database())->getConnection();
        
        $payload = getAuthenticatedTokenPayload();
        if (!$payload) return;

        $stmt = $pdo->prepare("
            INSERT INTO audit_logs (pharmacie_id, user_id, action, details) 
            VALUES (:pid, :uid, :act, :det)
        ");
        $stmt->execute([
            'pid' => $payload['pharmacie_id'],
            'uid' => $payload['user_id'],
            'act' => $action,
            'det' => is_array($details) ? json_encode($details, JSON_UNESCAPED_UNICODE) : $details
        ]);
    } catch (Exception $e) {
        // Ne pas bloquer l'application si le log echoue
        error_log("Erreur Audit Log: " . $e->getMessage());
    }
}
