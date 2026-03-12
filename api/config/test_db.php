<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = 'sql106.infinityfree.com';
$user = 'if0_41366883';
$pass = 'L0valove';
$db = 'if0_41366883_pharmshare';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass);
    echo "✅ CONNEXION RÉUSSIE ! La base de données répond parfaitement.";
}
catch (PDOException $e) {
    echo "❌ ÉCHEC DE CONNEXION : " . $e->getMessage();
}
