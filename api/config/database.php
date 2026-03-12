<?php
// Configuration de la base de données
class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $conn;

    public function __construct() {
        // Chargement de la configuration locale ou de production si elle existe
        $localConfig = __DIR__ . '/config.local.php';
        if (file_exists($localConfig)) {
            require_once $localConfig;
        }

        // Utilisation des constantes (définies dans config.local.php) ou des variables d'environnement
        $this->host = (defined('DB_HOST')) ? DB_HOST : (getenv('DB_HOST') ?: "localhost");
        $this->db_name = (defined('DB_NAME')) ? DB_NAME : (getenv('DB_NAME') ?: "pharmshare");
        $this->username = (defined('DB_USER')) ? DB_USER : (getenv('DB_USER') ?: "root");
        $this->password = (defined('DB_PASS')) ? DB_PASS : (getenv('DB_PASS') ?: "");
    }

    public function getConnection() {
        $this->conn = null;
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } catch (PDOException $exception) {
            http_response_code(500);
            // On ne montre pas l'erreur SQL détaillée en production pour la sécurité
            $errorMsg = (getenv('APP_ENV') === 'production') ? "Erreur de connexion serveur" : "Erreur: " . $exception->getMessage();
            echo json_encode(["error" => $errorMsg]);
            exit;
        }
        return $this->conn;
    }
}
