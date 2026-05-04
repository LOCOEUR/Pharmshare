<?php
require_once __DIR__ . '/jwt.php';

/**
 * Helper pour les réponses JSON (Optimisé)
 */
function jsonResponse($data, $statusCode = 200)
{
    if (!headers_sent()) {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
    }
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PARTIAL_OUTPUT_ON_ERROR);
    exit;
}

function errorResponse($message, $statusCode = 400)
{
    jsonResponse(["success" => false, "error" => $message], $statusCode);
}

function successResponse($data = null, $message = "Succès")
{
    $res = ["success" => true, "message" => $message];
    if ($data !== null) $res["data"] = $data;
    jsonResponse($res);
}

/**
 * Nettoie les données pour éviter les injections XSS
 */
function sanitizeInput($data)
{
    if (is_array($data)) {
        foreach ($data as $key => $value) {
            $data[$key] = sanitizeInput($value);
        }
    }
    elseif (is_string($data)) {
        return htmlspecialchars(strip_tags($data), ENT_QUOTES, 'UTF-8');
    }
    return $data;
}

/**
 * Récupère les données JSON du body de la requête
 */
function getRequestBody()
{
    static $bodyData = null;
    if ($bodyData !== null) return $bodyData;
    
    $body = file_get_contents("php://input");
    $bodyData = json_decode($body, true) ?: [];
    return $bodyData;
}

/**
 * Vérifie que les champs requis sont présents
 */
function validateRequired($data, $fields)
{
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
function hashPassword($password)
{
    return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
}

/**
 * Vérification du mot de passe
 */
function verifyPassword($password, $hash)
{
    return password_verify($password, $hash);
}

/**
 * Génère un token JWT simple
 */
function generateToken($userId, $pharmacieId)
{
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
 * Vérifie et décode un token JWT (Optimisé avec hash_equals)
 */
function verifyToken($token)
{
    $parts = explode('.', $token);
    if (count($parts) !== 3) return null;

    $secret = JWT_SECRET;
    $expectedSig = base64_encode(hash_hmac('sha256', "$parts[0].$parts[1]", $secret, true));

    if (!hash_equals($expectedSig, $parts[2])) return null;

    $payload = json_decode(base64_decode($parts[1]), true);
    if (!$payload || $payload['exp'] < time()) return null;

    return $payload;
}

/**
 * Récupère le payload décodé du token avec mise en cache statique (Performance ++)
 */
function getAuthenticatedTokenPayload()
{
    static $cachedPayload = null;
    if ($cachedPayload !== null) return $cachedPayload;

    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if (empty($authHeader) || !str_starts_with($authHeader, 'Bearer ')) {
        errorResponse("Non authentifié", 401);
    }

    $token = substr($authHeader, 7);
    $cachedPayload = verifyToken($token);

    if (!$cachedPayload) {
        errorResponse("Token invalide ou expiré", 401);
    }

    return $cachedPayload;
}

function getAuthenticatedPharmacieId()
{
    $payload = getAuthenticatedTokenPayload();
    return $payload['pharmacie_id'];
}

function getAuthenticatedUserId()
{
    $payload = getAuthenticatedTokenPayload();
    return $payload['user_id'];
}

/**
 * Enregistre une action dans le journal d'audit (Optimisé avec Singleton BDD)
 */
function logAudit($action, $details = null)
{
    try {
        static $pdo = null;
        if ($pdo === null) {
            global $db;
            $pdo = $db ?? (new Database())->getConnection();
        }

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
    }
    catch (Exception $e) {
        error_log("Erreur Audit Log: " . $e->getMessage());
    }
}
