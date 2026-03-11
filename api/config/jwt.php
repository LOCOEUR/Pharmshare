<?php
/**
 * Configuration JWT
 */
// Utilisez une variable d'environnement en production pour plus de sécurité
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'pharmshare_secure_secret_2026_xyz');
define('JWT_EXPIRY', 86400); // 24 heures
