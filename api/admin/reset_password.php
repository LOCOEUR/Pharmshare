<?php
/**
 * Script TEMPORAIRE - Réinitialise le mot de passe de l'admin global
 * À SUPPRIMER après utilisation !
 * 
 * Accéder à : http://localhost/Pharmshare/api/admin/reset_password.php
 */
require_once __DIR__ . '/../config/database.php';

$db = (new Database())->getConnection();

// Nouveau mot de passe : pharmshare2026
$newPassword = 'pharmshare2026';
$hash = password_hash($newPassword, PASSWORD_BCRYPT, ['cost' => 12]);

// Mise à jour dans la base + s'assurer que pharmacie_id est bien nullable
$stmt = $db->prepare("UPDATE users SET mot_de_passe = :pwd WHERE email = 'admin@pharmshare.ci'");
$result = $stmt->execute(['pwd' => $hash]);

if ($result && $stmt->rowCount() > 0) {
    echo "<h2 style='color:green;font-family:sans-serif'>✅ Mot de passe réinitialisé avec succès !</h2>";
    echo "<p style='font-family:sans-serif'>Vous pouvez maintenant vous connecter avec :</p>";
    echo "<ul style='font-family:sans-serif'>";
    echo "<li><strong>Email :</strong> admin@pharmshare.ci</li>";
    echo "<li><strong>Mot de passe :</strong> pharmshare2026</li>";
    echo "</ul>";
    echo "<p style='color:red;font-family:sans-serif'><strong>⚠️ Supprimez ce fichier après utilisation !</strong></p>";
} else {
    echo "<h2 style='color:red;font-family:sans-serif'>❌ Aucun utilisateur trouvé avec cet email.</h2>";
    echo "<p style='font-family:sans-serif'>Vérifiez que 'admin@pharmshare.ci' existe bien dans ta table users.</p>";
}
