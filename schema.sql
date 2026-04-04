-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 04 avr. 2026 à 10:10
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `pharmshare`
--

-- --------------------------------------------------------

--
-- Structure de la table `annonces`
--

CREATE TABLE `annonces` (
  `id` int(11) NOT NULL,
  `pharmacie_id` int(11) NOT NULL,
  `produit_id` int(11) DEFAULT NULL,
  `titre` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `type_annonce` enum('vente','echange','don','recherche') DEFAULT 'vente',
  `quantite` int(11) NOT NULL DEFAULT 1,
  `prix_unitaire` decimal(10,2) DEFAULT NULL,
  `date_expiration` date DEFAULT NULL,
  `numero_lot` varchar(50) DEFAULT NULL,
  `image_url` text DEFAULT NULL,
  `echange_contre` varchar(255) DEFAULT NULL,
  `statut` enum('active','en_negociation','vendue','expiree','annulee') DEFAULT 'active',
  `vues` int(11) DEFAULT 0,
  `date_creation` datetime DEFAULT current_timestamp(),
  `date_modification` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `annonces`
--

INSERT INTO `annonces` (`id`, `pharmacie_id`, `produit_id`, `titre`, `description`, `type_annonce`, `quantite`, `prix_unitaire`, `date_expiration`, `numero_lot`, `image_url`, `echange_contre`, `statut`, `vues`, `date_creation`, `date_modification`) VALUES
(1, 1, NULL, 'Augmentin 1g', NULL, '', 16, 2063.00, '2026-10-19', 'LOT-7153', NULL, NULL, 'vendue', 0, '2026-02-18 11:13:01', '2026-02-19 12:36:23'),
(2, 1, NULL, 'Clamoxyl', NULL, '', 13, 2780.00, '2026-11-19', 'LOT-7153', NULL, NULL, 'vendue', 0, '2026-02-18 11:13:01', '2026-02-19 12:36:23'),
(3, 2, NULL, 'Spasfon', NULL, '', 27, 2172.00, '2026-08-19', 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-17 11:13:01', '2026-02-19 12:36:23'),
(4, 2, NULL, 'Amoxicilline 500mg', NULL, '', 21, NULL, '2026-12-19', 'LOT-7153', NULL, NULL, 'vendue', 0, '2026-02-18 11:13:01', '2026-02-19 12:36:23'),
(5, 3, NULL, 'Gaviscon', NULL, '', 14, 1828.00, '2026-11-19', 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-15 11:13:01', '2026-02-19 12:36:23'),
(6, 3, NULL, 'Spasfon', NULL, 'vente', 26, 1664.00, '2027-01-19', 'LOT-7153', NULL, NULL, 'vendue', 0, '2026-02-16 11:13:01', '2026-02-19 12:36:23'),
(7, 4, NULL, 'Vogalène', NULL, '', 24, NULL, '2026-11-19', 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-15 11:13:01', '2026-02-19 12:36:23'),
(8, 4, NULL, 'Spasfon', NULL, 'vente', 17, 1641.00, '2026-07-19', 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-18 11:13:01', '2026-02-19 12:36:23'),
(9, 5, NULL, 'Imodium 2mg', NULL, '', 21, NULL, '2027-01-19', 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-14 11:13:02', '2026-02-19 12:36:23'),
(10, 5, NULL, 'Efferalgan 500mg', NULL, 'vente', 12, 3062.00, '2026-09-19', 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-16 11:13:02', '2026-02-19 12:36:23'),
(11, 6, NULL, 'Imodium 2mg', NULL, 'vente', 14, 3631.00, '2026-12-19', 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-18 11:13:02', '2026-02-19 12:36:23'),
(12, 6, NULL, 'Efferalgan 500mg', NULL, 'vente', 16, 2731.00, '2026-07-19', 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-16 11:13:02', '2026-02-19 12:36:23'),
(13, 3, NULL, 'RECHERCHE URGENTE : Amoxicilline 500mg', NULL, '', 50, NULL, NULL, 'LOT-7153', NULL, NULL, 'vendue', 0, '2026-02-19 10:35:16', '2026-03-03 15:24:07'),
(14, 5, NULL, 'Besoin de Spasfon Comprimés', NULL, '', 20, NULL, NULL, 'LOT-7153', NULL, NULL, 'en_negociation', 0, '2026-02-19 10:35:16', '2026-02-19 12:36:23'),
(15, 3, NULL, 'Cherche Clamoxyl Injectable (Rupture grossiste)', NULL, '', 10, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-19 10:35:16', '2026-02-19 12:36:23'),
(16, 4, NULL, 'Demande Augmentin 1g pour patient', NULL, '', 5, NULL, NULL, 'LOT-7153', NULL, NULL, 'vendue', 0, '2026-02-19 10:35:16', '2026-02-19 12:36:23'),
(17, 4, NULL, 'URGENT : Insuline Novomix 30', 'Patient en attente au comptoir.', '', 13, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-18 14:38:32', '2026-02-19 12:36:23'),
(18, 5, NULL, 'Cherche Ventoline Evohaler x5', 'Rupture totale dans notre quartier.', '', 12, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-19 03:38:32', '2026-02-19 12:36:23'),
(19, 1, NULL, 'Besoin Amoxicilline/Acide Clavulanique Nourrisson', 'Dépannage pour une ordonnance pédiatrique.', '', 4, NULL, NULL, 'LOT-7153', NULL, NULL, 'vendue', 0, '2026-02-18 17:38:32', '2026-02-19 12:36:23'),
(20, 1, NULL, 'Recherche Glucophage 1000mg', 'Plus de stock pour nos patients chroniques.', '', 17, NULL, NULL, 'LOT-7153', NULL, NULL, 'en_negociation', 0, '2026-02-19 06:38:32', '2026-03-03 15:14:57'),
(21, 3, NULL, 'Demande de Masques FFP2 (Boîte de 50)', 'Besoin pour le personnel.', '', 15, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-18 19:38:32', '2026-02-19 12:36:23'),
(22, 6, NULL, 'Cherche Lovenox 4000 UI', 'Besoin de 3 boîtes en urgence.', '', 13, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-18 21:38:32', '2026-02-19 12:36:23'),
(23, 6, NULL, 'Recherche Paracétamol IV', 'Pour clinique partenaire.', '', 6, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-18 18:38:32', '2026-02-19 12:36:23'),
(24, 2, NULL, 'Besoin Voltarène Emulgel', 'Forte demande saisonnière.', '', 14, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-19 03:38:32', '2026-02-19 12:36:23'),
(25, 3, NULL, 'Recherche Gants Stériles Taille 7.5', 'Dépannage matériel médical.', '', 18, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-18 13:38:32', '2026-02-19 12:36:23'),
(26, 1, NULL, 'Demande Inexium 40mg Injectable', 'Urgent pour un patient hospitalisé à domicile.', '', 16, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-19 03:38:32', '2026-02-19 12:36:23'),
(27, 6, NULL, 'Cherche Augmentin Adulte (Comprimé)', 'Rupture grossiste annoncée.', '', 8, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-18 16:38:32', '2026-02-19 12:36:23'),
(28, 3, NULL, 'Besoin de Sérum Physiologique (Poches 500ml)', '10 poches minimum.', '', 16, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-18 22:38:32', '2026-02-19 12:36:23'),
(29, 2, NULL, 'Recherche Spasfon Lyoc', 'Stock épuisé ce matin.', '', 1, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-18 19:38:32', '2026-02-19 12:36:23'),
(30, 2, NULL, 'Demande Kardegic 75mg', 'Traitement de fond pour patient fidèle.', '', 7, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-19 05:38:32', '2026-02-19 12:36:23'),
(31, 2, NULL, 'URGENT : Adrénaline Injectable', 'Trousse d\'urgence à compléter.', '', 1, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-19 03:38:32', '2026-02-19 12:36:23'),
(33, 2, NULL, 'URGENT : Insuline Novomix 30', 'Patient en attente au comptoir.', 'recherche', 11, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-17 21:41:36', '2026-02-19 12:36:23'),
(34, 3, NULL, 'Cherche Ventoline Evohaler x5', 'Rupture totale dans notre quartier.', 'recherche', 14, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-18 17:41:36', '2026-02-19 12:36:23'),
(35, 4, NULL, 'Besoin Amoxicilline/Acide Clavulanique Nourrisson', 'Dépannage pour une ordonnance pédiatrique.', 'recherche', 19, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-18 15:41:36', '2026-02-19 12:36:23'),
(36, 1, NULL, 'Recherche Glucophage 1000mg', 'Plus de stock pour nos patients chroniques.', 'recherche', 8, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-18 11:41:36', '2026-02-19 12:36:23'),
(37, 6, NULL, 'Demande de Masques FFP2 (Boîte de 50)', 'Besoin pour le personnel.', 'recherche', 10, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-19 09:41:36', '2026-02-19 12:36:23'),
(38, 5, NULL, 'Cherche Lovenox 4000 UI', 'Besoin de 3 boîtes en urgence.', 'recherche', 2, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-18 00:41:36', '2026-02-19 12:36:23'),
(39, 4, NULL, 'Recherche Paracétamol IV', 'Pour clinique partenaire.', 'recherche', 1, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-18 14:41:36', '2026-02-19 12:36:23'),
(40, 6, NULL, 'Besoin Voltarène Emulgel', 'Forte demande saisonnière.', 'recherche', 18, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-19 00:41:36', '2026-02-19 12:36:23'),
(41, 5, NULL, 'Recherche Gants Stériles Taille 7.5', 'Dépannage matériel médical.', 'recherche', 8, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-18 10:41:36', '2026-02-19 12:36:23'),
(42, 3, NULL, 'Demande Inexium 40mg Injectable', 'Urgent pour un patient hospitalisé à domicile.', 'recherche', 18, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-17 22:41:36', '2026-02-19 12:36:23'),
(43, 6, NULL, 'Cherche Augmentin Adulte (Comprimé)', 'Rupture grossiste annoncée.', 'recherche', 18, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-18 06:41:36', '2026-02-19 12:36:23'),
(44, 2, NULL, 'Besoin de Sérum Physiologique (Poches 500ml)', '10 poches minimum.', 'recherche', 4, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-19 09:41:36', '2026-02-19 12:36:23'),
(45, 2, NULL, 'Recherche Spasfon Lyoc', 'Stock épuisé ce matin.', 'recherche', 18, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-19 00:41:36', '2026-02-19 12:36:23'),
(46, 5, NULL, 'Demande Kardegic 75mg', 'Traitement de fond pour patient fidèle.', 'recherche', 8, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-18 15:41:36', '2026-02-19 12:36:23'),
(47, 5, NULL, 'URGENT : Adrénaline Injectable', 'Trousse d\'urgence à compléter.', 'recherche', 12, NULL, NULL, 'LOT-7153', NULL, NULL, 'active', 0, '2026-02-18 06:41:36', '2026-02-19 12:36:23'),
(49, 1, 1, 'Doliprane 1000mg', NULL, 'vente', 1000, 99.00, '2026-03-27', '34ZRE', NULL, NULL, 'active', 0, '2026-03-11 15:49:51', '2026-03-11 15:49:51'),
(50, 1, NULL, 'Aspirine', NULL, 'recherche', 13, NULL, '2026-03-18', 'NGCUYE7689+°0', NULL, NULL, 'en_negociation', 0, '2026-03-11 15:52:39', '2026-03-11 18:02:07');

-- --------------------------------------------------------

--
-- Structure de la table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` int(11) NOT NULL,
  `pharmacie_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `action` varchar(255) NOT NULL,
  `details` text DEFAULT NULL,
  `date_creation` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `audit_logs`
--

INSERT INTO `audit_logs` (`id`, `pharmacie_id`, `user_id`, `action`, `details`, `date_creation`) VALUES
(1, 1, 1, 'Nouvelle demande', '{\"demande_id\":\"59\",\"destinataire_id\":1,\"produit_nom\":\"Aspirine\"}', '2026-03-11 18:02:07'),
(2, 1, 1, 'Nouvelle demande', '{\"demande_id\":\"60\",\"destinataire_id\":1,\"produit_nom\":\"Aspirine\"}', '2026-03-11 18:03:11'),
(3, 1, 1, 'Paiement Wave réussi', '{\"demande_id\":54,\"montant\":\"0.00\"}', '2026-03-11 18:04:31'),
(4, 6, 11, 'Paiement Wave réussi', '{\"demande_id\":15,\"montant\":\"0.00\"}', '2026-03-11 18:43:13'),
(5, 6, 11, 'Création annonce', '{\"annonce_id\":\"51\",\"titre\":\"du\",\"type\":\"vente\"}', '2026-03-11 20:42:37'),
(6, 6, 11, 'Suppression annonce', '{\"annonce_id\":\"51\"}', '2026-03-11 20:43:01'),
(7, 6, 11, 'Modification produit', '{\"produit_id\":\"46\",\"nom\":\"ID 46\",\"champs_modifies\":[\"nom\",\"forme\",\"stock_actuel\",\"stock_minimum\",\"date_expiration\",\"image_url\"]}', '2026-03-11 21:23:24'),
(8, 6, 11, 'Modification statut demande', '{\"demande_id\":\"50\",\"nouveau_statut\":\"acceptee\",\"produit_nom\":\"Amoxicilline 500mg\"}', '2026-03-11 22:26:43'),
(9, 6, 11, 'Création annonce', '{\"annonce_id\":\"52\",\"titre\":\"H\",\"type\":\"recherche\"}', '2026-03-12 00:18:35'),
(10, 6, 11, 'Suppression annonce', '{\"annonce_id\":\"52\"}', '2026-03-12 00:19:14'),
(11, 1, 2, 'Paiement Wave réussi', '{\"demande_id\":3,\"montant\":\"0.00\"}', '2026-03-25 09:43:00'),
(12, 1, 2, 'Paiement Wave réussi', '{\"demande_id\":30,\"montant\":\"0.00\"}', '2026-03-25 10:30:14'),
(13, 1, 2, 'Modification statut demande', '{\"demande_id\":\"1\",\"nouveau_statut\":\"acceptee\",\"produit_nom\":\"Augmentin 1g\"}', '2026-03-25 10:30:55'),
(14, 1, 2, 'Modification statut demande', '{\"demande_id\":\"28\",\"nouveau_statut\":\"acceptee\",\"produit_nom\":\"Besoin Amoxicilline\\/Acide Clavulanique Nourrisson\"}', '2026-03-25 10:30:58'),
(15, 6, 11, 'Paiement Wave réussi', '{\"demande_id\":48,\"montant\":\"15310.00\"}', '2026-03-25 11:34:42'),
(16, 2, 3, 'Modification statut demande', '{\"demande_id\":\"3\",\"nouveau_statut\":\"acceptee\",\"produit_nom\":\"Amoxicilline 500mg\"}', '2026-03-25 11:40:56'),
(17, 6, 11, 'Modification statut demande', '{\"demande_id\":\"30\",\"nouveau_statut\":\"acceptee\",\"produit_nom\":\"Cherche Lovenox 4000 UI\"}', '2026-03-25 11:42:09'),
(18, 1, 1, 'Modification statut demande', '{\"demande_id\":\"1\",\"nouveau_statut\":\"acceptee\",\"produit_nom\":\"Augmentin 1g\"}', '2026-03-25 11:58:29'),
(19, 6, 11, 'Paiement Wave réussi', '{\"demande_id\":1,\"montant\":\"2063.00\"}', '2026-03-25 11:59:16'),
(20, 1, 1, 'Création annonce', '{\"annonce_id\":\"53\",\"titre\":\"THERALENE\",\"type\":\"recherche\"}', '2026-03-30 21:39:19'),
(21, 1, 1, 'Suppression annonce', '{\"annonce_id\":\"53\"}', '2026-03-30 21:40:06');

-- --------------------------------------------------------

--
-- Structure de la table `conversations`
--

CREATE TABLE `conversations` (
  `id` int(11) NOT NULL,
  `pharmacie_1_id` int(11) NOT NULL,
  `pharmacie_2_id` int(11) NOT NULL,
  `derniere_activite` datetime DEFAULT current_timestamp(),
  `date_creation` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `conversations`
--

INSERT INTO `conversations` (`id`, `pharmacie_1_id`, `pharmacie_2_id`, `derniere_activite`, `date_creation`) VALUES
(1, 1, 6, '2026-03-11 18:22:58', '2026-02-19 11:35:33'),
(2, 2, 3, '2026-02-19 11:35:34', '2026-02-19 11:35:33'),
(3, 1, 2, '2026-02-19 11:35:33', '2026-02-19 11:35:33'),
(4, 3, 5, '2026-02-19 11:35:34', '2026-02-19 11:35:33'),
(5, 4, 5, '2026-02-19 11:35:34', '2026-02-19 11:35:33'),
(6, 2, 4, '2026-02-19 11:35:34', '2026-02-19 11:35:33'),
(7, 4, 6, '2026-02-19 11:35:34', '2026-02-19 11:35:33'),
(8, 5, 6, '2026-02-19 11:35:34', '2026-02-19 11:35:34'),
(9, 3, 6, '2026-03-11 21:47:14', '2026-02-19 11:35:34'),
(10, 2, 5, '2026-02-19 11:35:34', '2026-02-19 11:35:34'),
(11, 2, 6, '2026-02-19 11:35:34', '2026-02-19 11:35:34'),
(12, 1, 4, '2026-02-19 11:35:34', '2026-02-19 11:35:34'),
(13, 1, 3, '2026-03-03 15:46:03', '2026-02-19 11:35:34'),
(14, 1, 5, '2026-02-19 11:35:34', '2026-02-19 11:35:34'),
(15, 3, 4, '2026-02-19 11:35:34', '2026-02-19 11:35:34'),
(16, 1, 1, '2026-03-03 15:19:48', '2026-02-19 11:44:43');

-- --------------------------------------------------------

--
-- Structure de la table `demandes`
--

CREATE TABLE `demandes` (
  `id` int(11) NOT NULL,
  `annonce_id` int(11) DEFAULT NULL,
  `demandeur_id` int(11) NOT NULL,
  `destinataire_id` int(11) NOT NULL,
  `produit_nom` varchar(255) NOT NULL,
  `quantite` int(11) NOT NULL DEFAULT 1,
  `type_demande` enum('achat','echange') DEFAULT 'achat',
  `echange_contre` varchar(255) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `statut` enum('en_attente','acceptee','refusee','annulee','terminee') DEFAULT 'en_attente',
  `statut_paiement` varchar(50) DEFAULT 'non_paye',
  `motif_refus` text DEFAULT NULL,
  `date_creation` datetime DEFAULT current_timestamp(),
  `date_modification` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `demandes`
--

INSERT INTO `demandes` (`id`, `annonce_id`, `demandeur_id`, `destinataire_id`, `produit_nom`, `quantite`, `type_demande`, `echange_contre`, `message`, `statut`, `statut_paiement`, `motif_refus`, `date_creation`, `date_modification`) VALUES
(1, 1, 6, 1, 'Augmentin 1g', 1, 'achat', NULL, NULL, 'acceptee', 'paye', '', '2026-02-18 00:16:47', '2026-03-25 11:59:16'),
(2, 3, 3, 2, 'Spasfon', 2, 'achat', NULL, NULL, 'terminee', 'non_paye', NULL, '2026-02-19 04:16:47', '2026-02-19 10:16:47'),
(3, 4, 1, 2, 'Amoxicilline 500mg', 2, 'achat', NULL, NULL, 'acceptee', 'paye', '', '2026-02-19 00:16:47', '2026-03-25 11:40:56'),
(4, 5, 5, 3, 'Gaviscon', 4, 'achat', NULL, NULL, 'refusee', 'non_paye', NULL, '2026-02-18 07:16:47', '2026-02-19 10:16:47'),
(5, 7, 5, 4, 'Vogalène', 3, 'achat', NULL, NULL, 'en_attente', 'non_paye', NULL, '2026-02-18 14:16:47', '2026-02-19 10:16:47'),
(6, 8, 2, 4, 'Spasfon', 3, 'achat', NULL, NULL, 'en_attente', 'non_paye', NULL, '2026-02-18 05:16:47', '2026-02-19 10:16:47'),
(7, 9, 4, 5, 'Imodium 2mg', 2, 'achat', NULL, NULL, 'refusee', 'non_paye', NULL, '2026-02-18 10:16:47', '2026-02-19 10:16:47'),
(8, 10, 4, 5, 'Efferalgan 500mg', 5, 'achat', NULL, NULL, 'en_attente', 'non_paye', NULL, '2026-02-18 18:16:47', '2026-02-19 10:16:47'),
(9, 11, 4, 6, 'Imodium 2mg', 4, 'achat', NULL, NULL, 'terminee', 'non_paye', NULL, '2026-02-19 06:16:47', '2026-02-19 10:16:47'),
(10, 12, 5, 6, 'Efferalgan 500mg', 5, 'achat', NULL, NULL, 'refusee', 'non_paye', NULL, '2026-02-18 13:16:47', '2026-02-19 10:16:47'),
(11, 13, 6, 3, 'RECHERCHE URGENTE : Amoxicilline 500mg', 9, 'echange', NULL, 'Intéressé par un échange contre du sérum phy ?', 'en_attente', 'non_paye', NULL, '2026-02-16 00:42:38', '2026-02-19 10:42:38'),
(12, 12, 1, 6, 'Efferalgan 500mg', 5, 'achat', NULL, 'Bonjour confrère, j\'aimerais vous prendre tout le lot.', 'terminee', 'non_paye', NULL, '2026-02-14 05:42:38', '2026-02-19 10:42:38'),
(13, 33, 5, 2, 'URGENT : Insuline Novomix 30', 7, 'echange', NULL, 'Est-il possible d\'avoir une remise sur la quantité ?', 'en_attente', 'non_paye', NULL, '2026-02-14 04:42:38', '2026-02-19 10:42:38'),
(14, 40, 3, 6, 'Besoin Voltarène Emulgel', 2, 'echange', NULL, 'Pouvez-vous me dépanner en urgence ? Patient en attente.', 'en_attente', 'non_paye', NULL, '2026-02-14 21:42:38', '2026-02-19 10:42:38'),
(15, 16, 6, 4, 'Demande Augmentin 1g pour patient', 2, 'achat', NULL, 'Est-il possible d\'avoir une remise sur la quantité ?', '', 'paye', NULL, '2026-02-15 21:42:38', '2026-03-25 10:27:25'),
(16, 11, 5, 6, 'Imodium 2mg', 9, 'echange', NULL, 'Est-il possible d\'avoir une remise sur la quantité ?', 'refusee', 'non_paye', NULL, '2026-02-12 23:42:38', '2026-02-19 10:42:38'),
(17, 42, 6, 3, 'Demande Inexium 40mg Injectable', 4, 'echange', NULL, 'Intéressé par un échange contre du sérum phy ?', 'annulee', 'non_paye', NULL, '2026-02-17 07:42:38', '2026-02-19 10:42:38'),
(18, 5, 5, 3, 'Gaviscon', 5, 'echange', NULL, 'Est-il possible d\'avoir une remise sur la quantité ?', 'terminee', 'non_paye', NULL, '2026-02-16 03:42:38', '2026-02-19 10:42:38'),
(19, 10, 3, 5, 'Efferalgan 500mg', 6, 'achat', NULL, 'Bonjour, est-ce que ce produit est toujours disponible ?', 'annulee', 'non_paye', NULL, '2026-02-15 15:42:38', '2026-02-19 10:42:38'),
(20, 11, 4, 6, 'Imodium 2mg', 3, 'echange', NULL, 'Bonjour, est-ce que ce produit est toujours disponible ?', 'en_attente', 'non_paye', NULL, '2026-02-14 08:42:38', '2026-02-19 10:42:38'),
(21, 20, 6, 1, 'Recherche Glucophage 1000mg', 1, 'echange', NULL, 'Est-il possible d\'avoir une remise sur la quantité ?', 'refusee', 'non_paye', NULL, '2026-02-17 14:42:38', '2026-02-19 10:42:38'),
(22, 31, 5, 2, 'URGENT : Adrénaline Injectable', 1, 'echange', NULL, 'Est-il possible d\'avoir une remise sur la quantité ?', 'acceptee', 'non_paye', NULL, '2026-02-13 20:42:38', '2026-02-19 10:42:38'),
(23, 43, 4, 6, 'Cherche Augmentin Adulte (Comprimé)', 5, 'echange', NULL, 'Bonjour confrère, j\'aimerais vous prendre tout le lot.', 'refusee', 'non_paye', NULL, '2026-02-15 15:42:38', '2026-02-19 10:42:38'),
(24, 22, 1, 6, 'Cherche Lovenox 4000 UI', 5, 'echange', NULL, 'Est-il possible d\'avoir une remise sur la quantité ?', 'acceptee', 'non_paye', NULL, '2026-02-16 07:42:38', '2026-02-19 10:42:38'),
(25, 37, 2, 6, 'Demande de Masques FFP2 (Boîte de 50)', 9, 'echange', NULL, 'Bonjour confrère, j\'aimerais vous prendre tout le lot.', 'refusee', 'non_paye', NULL, '2026-02-13 11:42:38', '2026-02-19 10:42:38'),
(26, 5, 6, 3, 'Gaviscon', 1, 'achat', NULL, 'Est-il possible d\'avoir une remise sur la quantité ?', 'terminee', 'non_paye', NULL, '2026-02-15 15:42:38', '2026-02-19 10:42:38'),
(27, 12, 4, 6, 'Efferalgan 500mg', 5, 'achat', NULL, 'Bonjour confrère, j\'aimerais vous prendre tout le lot.', 'refusee', 'non_paye', NULL, '2026-02-18 01:42:38', '2026-02-19 10:42:38'),
(28, 19, 4, 1, 'Besoin Amoxicilline/Acide Clavulanique Nourrisson', 2, 'achat', NULL, 'Pouvez-vous me dépanner en urgence ? Patient en attente.', 'acceptee', 'non_paye', '', '2026-02-16 20:42:38', '2026-03-25 10:30:58'),
(29, 22, 2, 6, 'Cherche Lovenox 4000 UI', 9, 'echange', NULL, 'Intéressé par un échange contre du sérum phy ?', 'acceptee', 'non_paye', NULL, '2026-02-17 22:42:38', '2026-02-19 10:42:38'),
(30, 22, 1, 6, 'Cherche Lovenox 4000 UI', 8, 'achat', NULL, 'Est-il possible d\'avoir une remise sur la quantité ?', 'acceptee', 'paye', '', '2026-02-15 12:42:38', '2026-03-25 11:42:09'),
(31, 6, 1, 3, 'Spasfon', 5, 'achat', NULL, NULL, 'terminee', 'non_paye', '', '2026-02-16 11:49:30', '2026-02-19 12:27:44'),
(32, 8, 1, 4, 'Spasfon', 2, 'achat', NULL, NULL, 'terminee', 'non_paye', NULL, '2026-02-16 11:49:30', '2026-02-19 10:49:30'),
(33, 10, 1, 5, 'Efferalgan 500mg', 3, 'achat', NULL, NULL, 'terminee', 'non_paye', NULL, '2026-02-16 11:49:30', '2026-02-19 10:49:30'),
(34, 6, 2, 3, 'Spasfon', 2, 'achat', NULL, NULL, 'terminee', 'non_paye', NULL, '2026-02-16 11:49:30', '2026-02-19 10:49:30'),
(35, 8, 2, 4, 'Spasfon', 4, 'achat', NULL, NULL, 'terminee', 'non_paye', NULL, '2026-02-16 11:49:30', '2026-02-19 10:49:30'),
(36, 10, 2, 5, 'Efferalgan 500mg', 2, 'achat', NULL, NULL, 'terminee', 'non_paye', NULL, '2026-02-16 11:49:30', '2026-02-19 10:49:30'),
(37, 8, 3, 4, 'Spasfon', 3, 'achat', NULL, NULL, 'terminee', 'non_paye', NULL, '2026-02-16 11:49:30', '2026-02-19 10:49:30'),
(38, 10, 3, 5, 'Efferalgan 500mg', 5, 'achat', NULL, NULL, 'terminee', 'non_paye', NULL, '2026-02-16 11:49:30', '2026-02-19 10:49:30'),
(39, 11, 3, 6, 'Imodium 2mg', 4, 'achat', NULL, NULL, 'terminee', 'non_paye', NULL, '2026-02-16 11:49:30', '2026-02-19 10:49:30'),
(40, 6, 4, 3, 'Spasfon', 4, 'achat', NULL, NULL, 'terminee', 'non_paye', NULL, '2026-02-16 11:49:30', '2026-02-19 10:49:30'),
(41, 10, 4, 5, 'Efferalgan 500mg', 2, 'achat', NULL, NULL, 'terminee', 'non_paye', NULL, '2026-02-16 11:49:30', '2026-02-19 10:49:30'),
(42, 11, 4, 6, 'Imodium 2mg', 4, 'achat', NULL, NULL, 'terminee', 'non_paye', NULL, '2026-02-16 11:49:30', '2026-02-19 10:49:30'),
(43, 6, 5, 3, 'Spasfon', 2, 'achat', NULL, NULL, 'terminee', 'non_paye', NULL, '2026-02-16 11:49:31', '2026-02-19 10:49:31'),
(44, 8, 5, 4, 'Spasfon', 2, 'achat', NULL, NULL, 'terminee', 'non_paye', NULL, '2026-02-16 11:49:31', '2026-02-19 10:49:31'),
(45, 11, 5, 6, 'Imodium 2mg', 5, 'achat', NULL, NULL, 'terminee', 'non_paye', NULL, '2026-02-16 11:49:31', '2026-02-19 10:49:31'),
(46, 6, 6, 3, 'Spasfon', 2, 'achat', NULL, NULL, 'terminee', 'non_paye', NULL, '2026-02-16 11:49:31', '2026-02-19 10:49:31'),
(47, 8, 6, 4, 'Spasfon', 5, 'achat', NULL, NULL, 'terminee', 'non_paye', NULL, '2026-02-16 11:49:31', '2026-02-19 10:49:31'),
(48, 10, 6, 5, 'Efferalgan 500mg', 5, 'achat', NULL, NULL, '', 'paye', NULL, '2026-02-16 11:49:31', '2026-03-25 11:34:42'),
(50, NULL, 5, 6, 'Amoxicilline 500mg', 20, 'achat', NULL, NULL, '', 'non_paye', '', '2026-02-23 13:22:06', '2026-03-25 10:01:11'),
(51, NULL, 6, 5, 'Paracétamol Sirop', 5, 'echange', NULL, NULL, 'en_attente', 'non_paye', NULL, '2026-02-23 13:22:06', '2026-02-23 13:22:06'),
(53, NULL, 1, 1, 'TEST DEBUG', 1, 'achat', NULL, NULL, 'refusee', 'non_paye', '', '2026-03-03 11:36:12', '2026-03-03 11:36:43'),
(54, 13, 1, 3, 'RECHERCHE URGENTE : Amoxicilline 500mg', 50, 'achat', NULL, NULL, '', 'paye', '', '2026-03-03 11:36:18', '2026-03-25 10:27:25'),
(55, 20, 1, 1, 'Recherche Glucophage 1000mg', 17, 'achat', NULL, NULL, 'refusee', 'non_paye', '', '2026-03-03 15:14:57', '2026-03-03 15:15:38'),
(56, 20, 1, 1, 'Recherche Glucophage 1000mg', 17, 'achat', NULL, NULL, 'refusee', 'non_paye', '', '2026-03-03 15:15:04', '2026-03-03 15:15:39'),
(57, 14, 3, 5, 'Besoin de Spasfon Comprimés', 20, 'achat', NULL, NULL, 'en_attente', 'non_paye', NULL, '2026-03-04 12:12:18', '2026-03-04 12:12:18'),
(58, 14, 3, 5, 'Besoin de Spasfon Comprimés', 20, 'achat', NULL, NULL, 'en_attente', 'non_paye', NULL, '2026-03-04 12:12:25', '2026-03-04 12:12:25'),
(59, 50, 1, 1, 'Aspirine', 13, 'achat', NULL, NULL, 'en_attente', 'non_paye', NULL, '2026-03-11 18:02:07', '2026-03-11 18:02:07'),
(60, 50, 1, 1, 'Aspirine', 13, 'achat', NULL, NULL, 'en_attente', 'non_paye', NULL, '2026-03-11 18:03:11', '2026-03-11 18:03:11'),
(61, 50, 6, 1, 'Aspirine', 13, 'achat', NULL, NULL, 'en_attente', 'non_paye', NULL, '2026-03-23 12:08:38', '2026-03-23 12:08:38');

--
-- Déclencheurs `demandes`
--
DELIMITER $$
CREATE TRIGGER `apres_demande_inseree` AFTER INSERT ON `demandes` FOR EACH ROW BEGIN
    -- On met à jour le produit lié à l'annonce
    UPDATE produits p
    JOIN annonces a ON p.id = a.produit_id
    SET p.stock_actuel = p.stock_actuel - NEW.quantite,
        p.stock_reserve = p.stock_reserve + NEW.quantite
    WHERE a.id = NEW.annonce_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `maj_stock_selon_statut` AFTER UPDATE ON `demandes` FOR EACH ROW BEGIN
    -- Si la demande est terminée (échange réussi)
    IF NEW.statut = 'terminee' AND OLD.statut != 'terminee' THEN
        UPDATE produits p
        JOIN annonces a ON p.id = a.produit_id
        SET p.stock_reserve = p.stock_reserve - NEW.quantite
        WHERE a.id = NEW.annonce_id;
        
    -- Si la demande est annulée ou refusée (on rend le stock)
    ELSEIF (NEW.statut = 'annulee' OR NEW.statut = 'refusee') 
           AND OLD.statut = 'en_attente' THEN
        UPDATE produits p
        JOIN annonces a ON p.id = a.produit_id
        SET p.stock_actuel = p.stock_actuel + NEW.quantite,
            p.stock_reserve = p.stock_reserve - NEW.quantite
        WHERE a.id = NEW.annonce_id;
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `conversation_id` int(11) NOT NULL,
  `expediteur_id` int(11) NOT NULL,
  `contenu` text NOT NULL,
  `fichier_url` varchar(500) DEFAULT NULL,
  `fichier_type` varchar(50) DEFAULT NULL,
  `lu` tinyint(1) DEFAULT 0,
  `date_envoi` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `messages`
--

INSERT INTO `messages` (`id`, `conversation_id`, `expediteur_id`, `contenu`, `fichier_url`, `fichier_type`, `lu`, `date_envoi`) VALUES
(1, 1, 6, 'Bonjour confrère, je suis intéressé par votre annonce pour Augmentin 1g. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:33'),
(2, 1, 1, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:33'),
(3, 1, 6, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:33'),
(4, 1, 1, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:33'),
(5, 1, 6, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:33'),
(6, 1, 1, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:33'),
(7, 1, 6, 'D\'accord, merci beaucoup pour la réactivité !', NULL, NULL, 1, '2026-02-19 12:05:33'),
(8, 1, 1, 'C\'est avec plaisir, bonne journée !', NULL, NULL, 1, '2026-02-19 12:10:33'),
(9, 2, 3, 'Bonjour confrère, je suis intéressé par votre annonce pour Spasfon. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:33'),
(10, 2, 2, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:33'),
(11, 2, 3, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:33'),
(12, 2, 2, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:33'),
(13, 3, 1, 'Bonjour confrère, je suis intéressé par votre annonce pour Amoxicilline 500mg. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:33'),
(14, 3, 2, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:33'),
(15, 3, 1, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:33'),
(16, 3, 2, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:33'),
(17, 4, 5, 'Bonjour confrère, je suis intéressé par votre annonce pour Gaviscon. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:33'),
(18, 4, 3, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:33'),
(19, 4, 5, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:33'),
(20, 4, 3, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:33'),
(21, 4, 5, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:33'),
(22, 4, 3, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:33'),
(23, 4, 5, 'D\'accord, merci beaucoup pour la réactivité !', NULL, NULL, 1, '2026-02-19 12:05:33'),
(24, 5, 5, 'Bonjour confrère, je suis intéressé par votre annonce pour Vogalène. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:33'),
(25, 5, 4, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:33'),
(26, 5, 5, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:33'),
(27, 5, 4, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:33'),
(28, 5, 5, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:33'),
(29, 6, 2, 'Bonjour confrère, je suis intéressé par votre annonce pour Spasfon. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:33'),
(30, 6, 4, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:33'),
(31, 6, 2, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:33'),
(32, 6, 4, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:33'),
(33, 6, 2, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:33'),
(34, 6, 4, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:33'),
(35, 6, 2, 'D\'accord, merci beaucoup pour la réactivité !', NULL, NULL, 1, '2026-02-19 12:05:33'),
(36, 6, 4, 'C\'est avec plaisir, bonne journée !', NULL, NULL, 1, '2026-02-19 12:10:33'),
(37, 5, 4, 'Bonjour confrère, je suis intéressé par votre annonce pour Imodium 2mg. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:33'),
(38, 5, 5, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:33'),
(39, 5, 4, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:33'),
(40, 5, 5, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:33'),
(41, 5, 4, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:33'),
(42, 5, 4, 'Bonjour confrère, je suis intéressé par votre annonce pour Efferalgan 500mg. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:33'),
(43, 5, 5, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:33'),
(44, 5, 4, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:33'),
(45, 5, 5, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:33'),
(46, 5, 4, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:33'),
(47, 5, 5, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:33'),
(48, 5, 4, 'D\'accord, merci beaucoup pour la réactivité !', NULL, NULL, 1, '2026-02-19 12:05:33'),
(49, 7, 4, 'Bonjour confrère, je suis intéressé par votre annonce pour Imodium 2mg. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:33'),
(50, 7, 6, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:33'),
(51, 7, 4, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:33'),
(52, 7, 6, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:33'),
(53, 7, 4, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:33'),
(54, 7, 6, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(55, 7, 4, 'D\'accord, merci beaucoup pour la réactivité !', NULL, NULL, 1, '2026-02-19 12:05:34'),
(56, 8, 5, 'Bonjour confrère, je suis intéressé par votre annonce pour Efferalgan 500mg. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(57, 8, 6, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(58, 8, 5, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(59, 8, 6, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(60, 8, 5, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(61, 8, 6, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(62, 8, 5, 'D\'accord, merci beaucoup pour la réactivité !', NULL, NULL, 1, '2026-02-19 12:05:34'),
(63, 9, 6, 'Bonjour confrère, je suis intéressé par votre annonce pour RECHERCHE URGENTE : Amoxicilline 500mg. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(64, 9, 3, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(65, 9, 6, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(66, 9, 3, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(67, 9, 6, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(68, 9, 3, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(69, 1, 1, 'Bonjour confrère, je suis intéressé par votre annonce pour Efferalgan 500mg. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(70, 1, 6, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(71, 1, 1, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(72, 1, 6, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(73, 1, 1, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(74, 1, 6, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(75, 10, 5, 'Bonjour confrère, je suis intéressé par votre annonce pour URGENT : Insuline Novomix 30. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(76, 10, 2, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(77, 10, 5, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(78, 10, 2, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(79, 10, 5, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(80, 10, 2, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(81, 10, 5, 'D\'accord, merci beaucoup pour la réactivité !', NULL, NULL, 1, '2026-02-19 12:05:34'),
(82, 10, 2, 'C\'est avec plaisir, bonne journée !', NULL, NULL, 1, '2026-02-19 12:10:34'),
(83, 9, 3, 'Bonjour confrère, je suis intéressé par votre annonce pour Besoin Voltarène Emulgel. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(84, 9, 6, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(85, 9, 3, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(86, 9, 6, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(87, 7, 6, 'Bonjour confrère, je suis intéressé par votre annonce pour Demande Augmentin 1g pour patient. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(88, 7, 4, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(89, 7, 6, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(90, 7, 4, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(91, 7, 6, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(92, 7, 4, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(93, 8, 5, 'Bonjour confrère, je suis intéressé par votre annonce pour Imodium 2mg. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(94, 8, 6, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(95, 8, 5, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(96, 8, 6, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(97, 8, 5, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(98, 9, 6, 'Bonjour confrère, je suis intéressé par votre annonce pour Demande Inexium 40mg Injectable. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(99, 9, 3, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(100, 9, 6, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(101, 9, 3, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(102, 9, 6, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(103, 9, 3, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(104, 9, 6, 'D\'accord, merci beaucoup pour la réactivité !', NULL, NULL, 1, '2026-02-19 12:05:34'),
(105, 9, 3, 'C\'est avec plaisir, bonne journée !', NULL, NULL, 1, '2026-02-19 12:10:34'),
(106, 4, 5, 'Bonjour confrère, je suis intéressé par votre annonce pour Gaviscon. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(107, 4, 3, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(108, 4, 5, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(109, 4, 3, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(110, 4, 5, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(111, 4, 3, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(112, 4, 5, 'D\'accord, merci beaucoup pour la réactivité !', NULL, NULL, 1, '2026-02-19 12:05:34'),
(113, 4, 3, 'C\'est avec plaisir, bonne journée !', NULL, NULL, 1, '2026-02-19 12:10:34'),
(114, 4, 3, 'Bonjour confrère, je suis intéressé par votre annonce pour Efferalgan 500mg. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(115, 4, 5, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(116, 4, 3, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(117, 4, 5, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(118, 4, 3, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(119, 4, 5, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(120, 4, 3, 'D\'accord, merci beaucoup pour la réactivité !', NULL, NULL, 1, '2026-02-19 12:05:34'),
(121, 4, 5, 'C\'est avec plaisir, bonne journée !', NULL, NULL, 1, '2026-02-19 12:10:34'),
(122, 7, 4, 'Bonjour confrère, je suis intéressé par votre annonce pour Imodium 2mg. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(123, 7, 6, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(124, 7, 4, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(125, 7, 6, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(126, 7, 4, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(127, 7, 6, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(128, 7, 4, 'D\'accord, merci beaucoup pour la réactivité !', NULL, NULL, 1, '2026-02-19 12:05:34'),
(129, 7, 6, 'C\'est avec plaisir, bonne journée !', NULL, NULL, 1, '2026-02-19 12:10:34'),
(130, 1, 6, 'Bonjour confrère, je suis intéressé par votre annonce pour Recherche Glucophage 1000mg. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(131, 1, 1, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(132, 1, 6, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(133, 1, 1, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(134, 1, 6, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(135, 1, 1, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(136, 1, 6, 'D\'accord, merci beaucoup pour la réactivité !', NULL, NULL, 1, '2026-02-19 12:05:34'),
(137, 10, 5, 'Bonjour confrère, je suis intéressé par votre annonce pour URGENT : Adrénaline Injectable. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(138, 10, 2, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(139, 10, 5, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(140, 10, 2, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(141, 10, 5, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(142, 10, 2, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(143, 10, 5, 'D\'accord, merci beaucoup pour la réactivité !', NULL, NULL, 1, '2026-02-19 12:05:34'),
(144, 7, 4, 'Bonjour confrère, je suis intéressé par votre annonce pour Cherche Augmentin Adulte (Comprimé). Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(145, 7, 6, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(146, 7, 4, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(147, 7, 6, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(148, 7, 4, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(149, 1, 1, 'Bonjour confrère, je suis intéressé par votre annonce pour Cherche Lovenox 4000 UI. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(150, 1, 6, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(151, 1, 1, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(152, 1, 6, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(153, 1, 1, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(154, 1, 6, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(155, 1, 1, 'D\'accord, merci beaucoup pour la réactivité !', NULL, NULL, 1, '2026-02-19 12:05:34'),
(156, 1, 6, 'C\'est avec plaisir, bonne journée !', NULL, NULL, 1, '2026-02-19 12:10:34'),
(157, 11, 2, 'Bonjour confrère, je suis intéressé par votre annonce pour Demande de Masques FFP2 (Boîte de 50). Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(158, 11, 6, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(159, 11, 2, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(160, 11, 6, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(161, 11, 2, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(162, 11, 6, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(163, 11, 2, 'D\'accord, merci beaucoup pour la réactivité !', NULL, NULL, 1, '2026-02-19 12:05:34'),
(164, 9, 6, 'Bonjour confrère, je suis intéressé par votre annonce pour Gaviscon. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(165, 9, 3, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(166, 9, 6, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(167, 9, 3, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(168, 9, 6, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(169, 9, 3, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(170, 9, 6, 'D\'accord, merci beaucoup pour la réactivité !', NULL, NULL, 1, '2026-02-19 12:05:34'),
(171, 7, 4, 'Bonjour confrère, je suis intéressé par votre annonce pour Efferalgan 500mg. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(172, 7, 6, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(173, 7, 4, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(174, 7, 6, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(175, 12, 4, 'Bonjour confrère, je suis intéressé par votre annonce pour Besoin Amoxicilline/Acide Clavulanique Nourrisson. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(176, 12, 1, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(177, 12, 4, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(178, 12, 1, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(179, 12, 4, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(180, 12, 1, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(181, 12, 4, 'D\'accord, merci beaucoup pour la réactivité !', NULL, NULL, 1, '2026-02-19 12:05:34'),
(182, 12, 1, 'C\'est avec plaisir, bonne journée !', NULL, NULL, 1, '2026-02-19 12:10:34'),
(183, 11, 2, 'Bonjour confrère, je suis intéressé par votre annonce pour Cherche Lovenox 4000 UI. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(184, 11, 6, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(185, 11, 2, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(186, 11, 6, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(187, 11, 2, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(188, 1, 1, 'Bonjour confrère, je suis intéressé par votre annonce pour Cherche Lovenox 4000 UI. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(189, 1, 6, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(190, 1, 1, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(191, 1, 6, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(192, 1, 1, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(193, 13, 1, 'Bonjour confrère, je suis intéressé par votre annonce pour Spasfon. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(194, 13, 3, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(195, 13, 1, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(196, 13, 3, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(197, 13, 1, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(198, 13, 3, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(199, 13, 1, 'D\'accord, merci beaucoup pour la réactivité !', NULL, NULL, 1, '2026-02-19 12:05:34'),
(200, 13, 3, 'C\'est avec plaisir, bonne journée !', NULL, NULL, 1, '2026-02-19 12:10:34'),
(201, 12, 1, 'Bonjour confrère, je suis intéressé par votre annonce pour Spasfon. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(202, 12, 4, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(203, 12, 1, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(204, 12, 4, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(205, 14, 1, 'Bonjour confrère, je suis intéressé par votre annonce pour Efferalgan 500mg. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(206, 14, 5, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(207, 14, 1, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(208, 14, 5, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(209, 14, 1, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(210, 14, 5, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(211, 2, 2, 'Bonjour confrère, je suis intéressé par votre annonce pour Spasfon. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(212, 2, 3, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(213, 2, 2, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(214, 2, 3, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(215, 2, 2, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(216, 6, 2, 'Bonjour confrère, je suis intéressé par votre annonce pour Spasfon. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(217, 6, 4, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(218, 6, 2, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(219, 6, 4, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(220, 6, 2, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(221, 6, 4, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(222, 6, 2, 'D\'accord, merci beaucoup pour la réactivité !', NULL, NULL, 1, '2026-02-19 12:05:34'),
(223, 10, 2, 'Bonjour confrère, je suis intéressé par votre annonce pour Efferalgan 500mg. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(224, 10, 5, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(225, 10, 2, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(226, 10, 5, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(227, 10, 2, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(228, 10, 5, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(229, 10, 2, 'D\'accord, merci beaucoup pour la réactivité !', NULL, NULL, 1, '2026-02-19 12:05:34'),
(230, 10, 5, 'C\'est avec plaisir, bonne journée !', NULL, NULL, 1, '2026-02-19 12:10:34'),
(231, 15, 3, 'Bonjour confrère, je suis intéressé par votre annonce pour Spasfon. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(232, 15, 4, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(233, 15, 3, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(234, 15, 4, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(235, 15, 3, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(236, 15, 4, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(237, 15, 3, 'D\'accord, merci beaucoup pour la réactivité !', NULL, NULL, 1, '2026-02-19 12:05:34'),
(238, 15, 4, 'C\'est avec plaisir, bonne journée !', NULL, NULL, 1, '2026-02-19 12:10:34'),
(239, 4, 3, 'Bonjour confrère, je suis intéressé par votre annonce pour Efferalgan 500mg. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(240, 4, 5, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(241, 4, 3, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(242, 4, 5, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(243, 4, 3, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(244, 4, 5, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(245, 9, 3, 'Bonjour confrère, je suis intéressé par votre annonce pour Imodium 2mg. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(246, 9, 6, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(247, 9, 3, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(248, 9, 6, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(249, 9, 3, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(250, 15, 4, 'Bonjour confrère, je suis intéressé par votre annonce pour Spasfon. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(251, 15, 3, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(252, 15, 4, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(253, 15, 3, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(254, 15, 4, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(255, 15, 3, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(256, 15, 4, 'D\'accord, merci beaucoup pour la réactivité !', NULL, NULL, 1, '2026-02-19 12:05:34'),
(257, 15, 3, 'C\'est avec plaisir, bonne journée !', NULL, NULL, 1, '2026-02-19 12:10:34'),
(258, 5, 4, 'Bonjour confrère, je suis intéressé par votre annonce pour Efferalgan 500mg. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(259, 5, 5, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(260, 5, 4, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(261, 5, 5, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(262, 5, 4, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(263, 5, 5, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(264, 5, 4, 'D\'accord, merci beaucoup pour la réactivité !', NULL, NULL, 1, '2026-02-19 12:05:34'),
(265, 7, 4, 'Bonjour confrère, je suis intéressé par votre annonce pour Imodium 2mg. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(266, 7, 6, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(267, 7, 4, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(268, 7, 6, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(269, 7, 4, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(270, 4, 5, 'Bonjour confrère, je suis intéressé par votre annonce pour Spasfon. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(271, 4, 3, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(272, 4, 5, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(273, 4, 3, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(274, 4, 5, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(275, 4, 3, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(276, 5, 5, 'Bonjour confrère, je suis intéressé par votre annonce pour Spasfon. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(277, 5, 4, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(278, 5, 5, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(279, 5, 4, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(280, 5, 5, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(281, 5, 4, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(282, 5, 5, 'D\'accord, merci beaucoup pour la réactivité !', NULL, NULL, 1, '2026-02-19 12:05:34'),
(283, 5, 4, 'C\'est avec plaisir, bonne journée !', NULL, NULL, 1, '2026-02-19 12:10:34'),
(284, 8, 5, 'Bonjour confrère, je suis intéressé par votre annonce pour Imodium 2mg. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(285, 8, 6, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(286, 8, 5, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(287, 8, 6, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(288, 8, 5, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(289, 8, 6, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(290, 8, 5, 'D\'accord, merci beaucoup pour la réactivité !', NULL, NULL, 1, '2026-02-19 12:05:34'),
(291, 8, 6, 'C\'est avec plaisir, bonne journée !', NULL, NULL, 1, '2026-02-19 12:10:34'),
(292, 9, 6, 'Bonjour confrère, je suis intéressé par votre annonce pour Spasfon. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(293, 9, 3, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(294, 9, 6, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(295, 9, 3, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(296, 7, 6, 'Bonjour confrère, je suis intéressé par votre annonce pour Spasfon. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(297, 7, 4, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(298, 7, 6, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(299, 7, 4, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(300, 7, 6, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(301, 7, 4, 'Pas de problème, on ferme à 19h30. À tout à l\'heure !', NULL, NULL, 1, '2026-02-19 12:00:34'),
(302, 8, 6, 'Bonjour confrère, je suis intéressé par votre annonce pour Efferalgan 500mg. Est-ce toujours disponible ?', NULL, NULL, 1, '2026-02-19 11:35:34'),
(303, 8, 5, 'Bonjour ! Oui, c\'est toujours en stock. Voulez-vous tout le lot ?', NULL, NULL, 1, '2026-02-19 11:40:34'),
(304, 8, 6, 'J\'en aurais besoin d\'une dizaine de boîtes pour un patient chronique. Quelle est la DDP ?', NULL, NULL, 1, '2026-02-19 11:45:34'),
(305, 8, 5, 'La DDP est à Octobre 2026, donc vous avez de la marge.', NULL, NULL, 1, '2026-02-19 11:50:34'),
(306, 8, 6, 'Parfait. Je valide la demande sur Pharmshare. Est-ce que je peux passer en fin de journée ?', NULL, NULL, 1, '2026-02-19 11:55:34'),
(307, 16, 1, 'cc', NULL, NULL, 0, '2026-02-19 11:44:43'),
(308, 16, 1, 'yo', NULL, NULL, 0, '2026-03-03 15:19:48'),
(309, 13, 1, 'cc', NULL, NULL, 1, '2026-03-03 15:20:01'),
(310, 13, 3, 'bonjour comment puije vous aidez', NULL, NULL, 1, '2026-03-03 15:44:54'),
(311, 13, 1, 'je recherche du paracetamol', NULL, NULL, 1, '2026-03-03 15:46:03'),
(312, 9, 6, 'salut', NULL, NULL, 1, '2026-03-11 17:32:00'),
(313, 9, 6, 'salut', NULL, NULL, 1, '2026-03-11 17:34:44'),
(314, 9, 3, 'cc', NULL, NULL, 1, '2026-03-11 17:38:19'),
(315, 1, 6, 'cc', NULL, NULL, 1, '2026-03-11 17:44:27'),
(316, 1, 1, '📷 Photo', '/uploads/chat/chat_1_69b1b3029ea3e3.26500562.png', 'image', 1, '2026-03-11 18:22:58'),
(317, 9, 6, 'cc', NULL, NULL, 1, '2026-03-11 21:37:21'),
(318, 9, 3, 'cc', NULL, NULL, 1, '2026-03-11 21:47:14');

-- --------------------------------------------------------

--
-- Structure de la table `mouvements_stock`
--

CREATE TABLE `mouvements_stock` (
  `id` int(11) NOT NULL,
  `produit_id` int(11) NOT NULL,
  `pharmacie_id` int(11) NOT NULL,
  `type_mouvement` enum('entree','sortie','ajustement','vente','echange','perte') NOT NULL,
  `quantite` int(11) NOT NULL,
  `raison` varchar(255) DEFAULT 'Mise à jour inventaire',
  `stock_avant` int(11) DEFAULT NULL,
  `stock_apres` int(11) DEFAULT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `commentaire` text DEFAULT NULL,
  `date_mouvement` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `mouvements_stock`
--

INSERT INTO `mouvements_stock` (`id`, `produit_id`, `pharmacie_id`, `type_mouvement`, `quantite`, `raison`, `stock_avant`, `stock_apres`, `reference`, `commentaire`, `date_mouvement`) VALUES
(1, 1, 1, 'entree', 8, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:01'),
(2, 1, 1, 'sortie', 9, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:01'),
(3, 1, 1, 'entree', 5, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:01'),
(4, 1, 1, 'entree', 5, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:01'),
(5, 2, 1, 'entree', 7, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:01'),
(6, 2, 1, 'sortie', 2, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:01'),
(7, 2, 1, 'entree', 2, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:01'),
(8, 2, 1, 'sortie', 7, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:01'),
(9, 3, 1, 'sortie', 2, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:01'),
(10, 3, 1, 'sortie', 4, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-14 11:13:01'),
(11, 3, 1, 'entree', 5, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:01'),
(12, 3, 1, 'sortie', 5, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:01'),
(13, 4, 1, 'sortie', 5, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:01'),
(14, 4, 1, 'entree', 9, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:01'),
(15, 4, 1, 'sortie', 2, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-14 11:13:01'),
(16, 4, 1, 'entree', 2, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:01'),
(17, 5, 1, 'entree', 2, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:01'),
(18, 5, 1, 'entree', 9, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:01'),
(19, 5, 1, 'entree', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:01'),
(20, 5, 1, 'entree', 5, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:01'),
(21, 6, 1, 'entree', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:01'),
(22, 6, 1, 'entree', 1, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:01'),
(23, 6, 1, 'sortie', 8, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-14 11:13:01'),
(24, 6, 1, 'entree', 1, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-14 11:13:01'),
(25, 7, 1, 'sortie', 7, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-15 11:13:01'),
(26, 7, 1, 'entree', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:01'),
(27, 7, 1, 'entree', 5, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-19 11:13:01'),
(28, 7, 1, 'sortie', 3, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:01'),
(29, 8, 1, 'entree', 7, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-19 11:13:01'),
(30, 8, 1, 'sortie', 10, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-15 11:13:01'),
(31, 8, 1, 'entree', 8, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:01'),
(32, 8, 1, 'entree', 10, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:01'),
(33, 9, 1, 'sortie', 9, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:01'),
(34, 9, 1, 'sortie', 1, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:01'),
(35, 9, 1, 'sortie', 5, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-14 11:13:01'),
(36, 9, 1, 'entree', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:01'),
(37, 10, 2, 'entree', 2, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:01'),
(38, 10, 2, 'entree', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-14 11:13:01'),
(39, 10, 2, 'sortie', 5, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:01'),
(40, 10, 2, 'sortie', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-14 11:13:01'),
(41, 11, 2, 'entree', 5, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-15 11:13:01'),
(42, 11, 2, 'entree', 8, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:01'),
(43, 11, 2, 'sortie', 1, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-14 11:13:01'),
(44, 11, 2, 'entree', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:01'),
(45, 12, 2, 'entree', 1, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:01'),
(46, 12, 2, 'entree', 7, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-15 11:13:01'),
(47, 12, 2, 'sortie', 7, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:01'),
(48, 12, 2, 'sortie', 4, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:01'),
(49, 13, 2, 'entree', 8, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-14 11:13:01'),
(50, 13, 2, 'sortie', 2, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:01'),
(51, 13, 2, 'entree', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:01'),
(52, 13, 2, 'entree', 4, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-14 11:13:01'),
(53, 14, 2, 'entree', 2, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:01'),
(54, 14, 2, 'sortie', 10, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-19 11:13:01'),
(55, 14, 2, 'sortie', 9, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:01'),
(56, 14, 2, 'sortie', 3, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:01'),
(57, 15, 2, 'sortie', 9, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:01'),
(58, 15, 2, 'entree', 3, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:01'),
(59, 15, 2, 'entree', 3, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:01'),
(60, 15, 2, 'sortie', 1, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:01'),
(61, 16, 2, 'entree', 7, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:01'),
(62, 16, 2, 'entree', 10, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-14 11:13:01'),
(63, 16, 2, 'entree', 8, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:01'),
(64, 16, 2, 'sortie', 9, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-14 11:13:01'),
(65, 17, 2, 'sortie', 10, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-15 11:13:01'),
(66, 17, 2, 'entree', 1, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:01'),
(67, 17, 2, 'sortie', 3, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-14 11:13:01'),
(68, 17, 2, 'sortie', 4, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:01'),
(69, 18, 2, 'sortie', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:01'),
(70, 18, 2, 'sortie', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:01'),
(71, 18, 2, 'sortie', 9, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-19 11:13:01'),
(72, 18, 2, 'entree', 10, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:01'),
(73, 19, 3, 'sortie', 3, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-15 11:13:01'),
(74, 19, 3, 'entree', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:01'),
(75, 19, 3, 'entree', 9, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:01'),
(76, 19, 3, 'sortie', 8, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:01'),
(77, 20, 3, 'sortie', 7, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:01'),
(78, 20, 3, 'entree', 10, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:01'),
(79, 20, 3, 'entree', 4, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-15 11:13:01'),
(80, 20, 3, 'entree', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-14 11:13:01'),
(81, 21, 3, 'sortie', 9, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:01'),
(82, 21, 3, 'entree', 7, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-14 11:13:01'),
(83, 21, 3, 'sortie', 10, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:01'),
(84, 21, 3, 'sortie', 4, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:01'),
(85, 22, 3, 'sortie', 4, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:01'),
(86, 22, 3, 'entree', 9, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:01'),
(87, 22, 3, 'sortie', 9, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:01'),
(88, 22, 3, 'entree', 8, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:01'),
(89, 23, 3, 'entree', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-15 11:13:01'),
(90, 23, 3, 'entree', 8, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:01'),
(91, 23, 3, 'entree', 3, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:01'),
(92, 23, 3, 'entree', 10, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-14 11:13:01'),
(93, 24, 3, 'entree', 9, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-19 11:13:01'),
(94, 24, 3, 'entree', 4, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:01'),
(95, 24, 3, 'entree', 10, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:01'),
(96, 24, 3, 'entree', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:01'),
(97, 25, 3, 'entree', 5, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-19 11:13:01'),
(98, 25, 3, 'sortie', 9, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:01'),
(99, 25, 3, 'entree', 7, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-14 11:13:01'),
(100, 25, 3, 'entree', 3, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-15 11:13:01'),
(101, 26, 3, 'entree', 8, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-19 11:13:01'),
(102, 26, 3, 'entree', 10, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-14 11:13:01'),
(103, 26, 3, 'entree', 3, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:01'),
(104, 26, 3, 'sortie', 3, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-15 11:13:01'),
(105, 27, 3, 'entree', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:01'),
(106, 27, 3, 'entree', 2, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:01'),
(107, 27, 3, 'sortie', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:01'),
(108, 27, 3, 'entree', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:01'),
(109, 28, 4, 'sortie', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:01'),
(110, 28, 4, 'sortie', 3, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:01'),
(111, 28, 4, 'sortie', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:01'),
(112, 28, 4, 'sortie', 3, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:01'),
(113, 29, 4, 'entree', 4, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:01'),
(114, 29, 4, 'entree', 2, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-14 11:13:01'),
(115, 29, 4, 'sortie', 5, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:01'),
(116, 29, 4, 'sortie', 3, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:01'),
(117, 30, 4, 'sortie', 7, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-19 11:13:01'),
(118, 30, 4, 'entree', 2, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:01'),
(119, 30, 4, 'entree', 10, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-15 11:13:01'),
(120, 30, 4, 'sortie', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:01'),
(121, 31, 4, 'entree', 7, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:01'),
(122, 31, 4, 'sortie', 7, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-19 11:13:01'),
(123, 31, 4, 'sortie', 4, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:01'),
(124, 31, 4, 'entree', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-15 11:13:01'),
(125, 32, 4, 'entree', 2, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-14 11:13:01'),
(126, 32, 4, 'entree', 7, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-19 11:13:01'),
(127, 32, 4, 'entree', 5, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:01'),
(128, 32, 4, 'entree', 7, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:01'),
(129, 33, 4, 'sortie', 8, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-19 11:13:01'),
(130, 33, 4, 'sortie', 4, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:01'),
(131, 33, 4, 'entree', 3, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:01'),
(132, 33, 4, 'sortie', 10, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:01'),
(133, 34, 4, 'sortie', 3, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:01'),
(134, 34, 4, 'sortie', 8, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:01'),
(135, 34, 4, 'sortie', 9, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:01'),
(136, 34, 4, 'entree', 9, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:01'),
(137, 35, 4, 'entree', 8, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:01'),
(138, 35, 4, 'entree', 2, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:01'),
(139, 35, 4, 'sortie', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:01'),
(140, 35, 4, 'entree', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:01'),
(141, 36, 4, 'sortie', 10, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-15 11:13:01'),
(142, 36, 4, 'entree', 2, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:01'),
(143, 36, 4, 'sortie', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:01'),
(144, 36, 4, 'sortie', 5, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:01'),
(145, 37, 5, 'sortie', 1, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:01'),
(146, 37, 5, 'sortie', 1, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:01'),
(147, 37, 5, 'sortie', 9, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-15 11:13:01'),
(148, 37, 5, 'sortie', 3, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:01'),
(149, 38, 5, 'sortie', 10, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:01'),
(150, 38, 5, 'entree', 2, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-19 11:13:01'),
(151, 38, 5, 'sortie', 3, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:01'),
(152, 38, 5, 'sortie', 3, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-19 11:13:01'),
(153, 39, 5, 'sortie', 8, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:01'),
(154, 39, 5, 'entree', 8, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:01'),
(155, 39, 5, 'sortie', 5, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-14 11:13:01'),
(156, 39, 5, 'sortie', 4, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-15 11:13:01'),
(157, 40, 5, 'entree', 2, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:01'),
(158, 40, 5, 'sortie', 9, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:02'),
(159, 40, 5, 'sortie', 10, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-15 11:13:02'),
(160, 40, 5, 'sortie', 8, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-15 11:13:02'),
(161, 41, 5, 'sortie', 8, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:02'),
(162, 41, 5, 'sortie', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:02'),
(163, 41, 5, 'entree', 2, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:02'),
(164, 41, 5, 'sortie', 1, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:02'),
(165, 42, 5, 'sortie', 9, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-14 11:13:02'),
(166, 42, 5, 'sortie', 10, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:02'),
(167, 42, 5, 'entree', 5, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:02'),
(168, 42, 5, 'entree', 5, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:02'),
(169, 43, 5, 'sortie', 5, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-15 11:13:02'),
(170, 43, 5, 'entree', 10, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-14 11:13:02'),
(171, 43, 5, 'entree', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:02'),
(172, 43, 5, 'entree', 9, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:02'),
(173, 44, 5, 'entree', 8, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:02'),
(174, 44, 5, 'sortie', 10, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:02'),
(175, 44, 5, 'entree', 4, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:02'),
(176, 44, 5, 'sortie', 8, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:02'),
(177, 45, 5, 'sortie', 2, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:02'),
(178, 45, 5, 'entree', 7, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:02'),
(179, 45, 5, 'entree', 4, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:02'),
(180, 45, 5, 'sortie', 5, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-15 11:13:02'),
(181, 46, 6, 'sortie', 2, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:02'),
(182, 46, 6, 'entree', 5, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-19 11:13:02'),
(183, 46, 6, 'sortie', 6, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:02'),
(184, 46, 6, 'entree', 1, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-19 11:13:02'),
(185, 47, 6, 'sortie', 10, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:02'),
(186, 47, 6, 'entree', 2, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:02'),
(187, 47, 6, 'entree', 2, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:02'),
(188, 47, 6, 'entree', 10, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:02'),
(189, 48, 6, 'entree', 7, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:02'),
(190, 48, 6, 'sortie', 7, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:02'),
(191, 48, 6, 'entree', 1, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-15 11:13:02'),
(192, 48, 6, 'entree', 5, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:02'),
(193, 49, 6, 'entree', 1, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:02'),
(194, 49, 6, 'sortie', 10, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-17 11:13:02'),
(195, 49, 6, 'entree', 5, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-14 11:13:02'),
(196, 49, 6, 'entree', 2, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-19 11:13:02'),
(197, 50, 6, 'sortie', 2, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-14 11:13:02'),
(198, 50, 6, 'sortie', 7, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:02'),
(199, 50, 6, 'entree', 2, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:02'),
(200, 50, 6, 'sortie', 3, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-12 11:13:02'),
(201, 51, 6, 'entree', 1, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:02'),
(202, 51, 6, 'sortie', 7, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:02'),
(203, 51, 6, 'sortie', 3, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:02'),
(204, 51, 6, 'entree', 10, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:02'),
(205, 52, 6, 'entree', 10, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:02'),
(206, 52, 6, 'entree', 8, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:02'),
(207, 52, 6, 'sortie', 9, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:02'),
(208, 52, 6, 'sortie', 7, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:02'),
(209, 53, 6, 'sortie', 4, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:02'),
(210, 53, 6, 'sortie', 8, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:02'),
(211, 53, 6, 'entree', 1, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-14 11:13:02'),
(212, 53, 6, 'sortie', 10, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-15 11:13:02'),
(213, 54, 6, 'entree', 7, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:02'),
(214, 54, 6, 'entree', 2, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-16 11:13:02'),
(215, 54, 6, 'sortie', 9, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-18 11:13:02'),
(216, 54, 6, 'entree', 10, 'Mise à jour hebdomadaire', NULL, NULL, NULL, NULL, '2026-02-13 11:13:02'),
(217, 6, 1, 'sortie', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 02:49:30'),
(218, 9, 1, 'entree', 8, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 05:49:30'),
(219, 4, 1, 'entree', 13, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 04:49:30'),
(220, 3, 1, 'entree', 7, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 20:49:30'),
(221, 4, 1, 'sortie', 9, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 21:49:30'),
(222, 2, 1, 'sortie', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 04:49:30'),
(223, 4, 1, 'sortie', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 00:49:30'),
(224, 4, 1, 'entree', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 23:49:30'),
(225, 1, 1, 'entree', 11, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 05:49:30'),
(226, 8, 1, 'sortie', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 03:49:30'),
(227, 3, 1, 'entree', 7, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 23:49:30'),
(228, 2, 1, 'sortie', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 04:49:30'),
(229, 1, 1, 'entree', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 03:49:30'),
(230, 2, 1, 'entree', 9, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 22:49:30'),
(231, 9, 1, 'entree', 8, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 01:49:30'),
(232, 4, 1, 'sortie', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 00:49:30'),
(233, 2, 1, 'sortie', 13, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 22:49:30'),
(234, 7, 1, 'sortie', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 19:49:30'),
(235, 8, 1, 'entree', 13, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 04:49:30'),
(236, 4, 1, 'sortie', 8, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 00:49:30'),
(237, 3, 1, 'entree', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 01:49:30'),
(238, 3, 1, 'sortie', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 19:49:30'),
(239, 6, 1, 'sortie', 11, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 04:49:30'),
(240, 5, 1, 'entree', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 05:49:30'),
(241, 8, 1, 'sortie', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 22:49:30'),
(242, 8, 1, 'entree', 8, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 00:49:30'),
(243, 5, 1, 'entree', 7, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 21:49:30'),
(244, 6, 1, 'entree', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 04:49:30'),
(245, 1, 1, 'entree', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 21:49:30'),
(246, 9, 1, 'entree', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 23:49:30'),
(247, 8, 1, 'entree', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 01:49:30'),
(248, 8, 1, 'entree', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 02:49:30'),
(249, 3, 1, 'entree', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 20:49:30'),
(250, 1, 1, 'entree', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 03:49:30'),
(251, 2, 1, 'entree', 7, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 20:49:30'),
(252, 5, 1, 'sortie', 9, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 21:49:30'),
(253, 2, 1, 'sortie', 11, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 03:49:30'),
(254, 8, 1, 'entree', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 01:49:30'),
(255, 7, 1, 'sortie', 4, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 03:49:30'),
(256, 2, 1, 'entree', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 23:49:30'),
(257, 1, 1, 'sortie', 4, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 03:49:30'),
(258, 2, 1, 'entree', 7, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 20:49:30'),
(259, 1, 1, 'entree', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 05:49:30'),
(260, 1, 1, 'entree', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 05:49:30'),
(261, 8, 1, 'sortie', 8, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 21:49:30'),
(262, 9, 1, 'sortie', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 04:49:30'),
(263, 9, 1, 'entree', 2, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 05:49:30'),
(264, 9, 1, 'entree', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 22:49:30'),
(265, 7, 1, 'sortie', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 02:49:30'),
(266, 3, 1, 'entree', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 21:49:30'),
(267, 4, 1, 'sortie', 8, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 19:49:30'),
(268, 3, 1, 'sortie', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 19:49:30'),
(269, 8, 1, 'entree', 4, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 02:49:30'),
(270, 8, 1, 'entree', 9, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 01:49:30'),
(271, 7, 1, 'entree', 8, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 20:49:30'),
(272, 8, 1, 'sortie', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 23:49:30'),
(273, 9, 1, 'entree', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 00:49:30'),
(274, 1, 1, 'entree', 11, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 19:49:30'),
(275, 2, 1, 'entree', 3, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 03:49:30'),
(276, 7, 1, 'sortie', 4, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 21:49:30'),
(277, 3, 1, 'sortie', 13, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 05:49:30'),
(278, 11, 2, 'sortie', 13, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 03:49:30'),
(279, 11, 2, 'sortie', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 05:49:30'),
(280, 14, 2, 'sortie', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 00:49:30'),
(281, 14, 2, 'sortie', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 19:49:30'),
(282, 17, 2, 'entree', 7, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 01:49:30'),
(283, 15, 2, 'entree', 8, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 22:49:30'),
(284, 18, 2, 'entree', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 02:49:30'),
(285, 13, 2, 'sortie', 8, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 03:49:30'),
(286, 17, 2, 'sortie', 8, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 05:49:30'),
(287, 14, 2, 'sortie', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 00:49:30'),
(288, 11, 2, 'entree', 8, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 02:49:30'),
(289, 10, 2, 'sortie', 8, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 03:49:30'),
(290, 17, 2, 'entree', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 02:49:30'),
(291, 18, 2, 'entree', 13, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 23:49:30'),
(292, 12, 2, 'entree', 12, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 20:49:30'),
(293, 17, 2, 'entree', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 00:49:30'),
(294, 13, 2, 'entree', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 22:49:30'),
(295, 17, 2, 'entree', 3, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 19:49:30'),
(296, 14, 2, 'sortie', 12, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 20:49:30'),
(297, 17, 2, 'sortie', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 03:49:30'),
(298, 10, 2, 'sortie', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 02:49:30'),
(299, 18, 2, 'sortie', 13, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 23:49:30'),
(300, 14, 2, 'sortie', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 05:49:30'),
(301, 15, 2, 'entree', 12, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 01:49:30'),
(302, 10, 2, 'entree', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 20:49:30'),
(303, 17, 2, 'sortie', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 20:49:30'),
(304, 14, 2, 'sortie', 3, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 04:49:30'),
(305, 10, 2, 'sortie', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 05:49:30'),
(306, 15, 2, 'sortie', 7, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 00:49:30'),
(307, 17, 2, 'sortie', 11, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 20:49:30'),
(308, 12, 2, 'entree', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 23:49:30'),
(309, 16, 2, 'entree', 3, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 22:49:30'),
(310, 11, 2, 'entree', 3, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 19:49:30'),
(311, 18, 2, 'entree', 13, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 22:49:30'),
(312, 14, 2, 'entree', 8, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 23:49:30'),
(313, 16, 2, 'entree', 3, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 05:49:30'),
(314, 11, 2, 'entree', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 20:49:30'),
(315, 13, 2, 'entree', 13, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 01:49:30'),
(316, 15, 2, 'sortie', 2, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 23:49:30'),
(317, 16, 2, 'sortie', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 19:49:30'),
(318, 18, 2, 'sortie', 11, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 04:49:30'),
(319, 10, 2, 'sortie', 2, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 20:49:30'),
(320, 15, 2, 'sortie', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 01:49:30'),
(321, 14, 2, 'sortie', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 01:49:30'),
(322, 13, 2, 'entree', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 03:49:30'),
(323, 10, 2, 'entree', 11, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 04:49:30'),
(324, 15, 2, 'sortie', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 21:49:30'),
(325, 18, 2, 'entree', 4, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 19:49:30'),
(326, 14, 2, 'entree', 4, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 01:49:30'),
(327, 18, 2, 'sortie', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 21:49:30'),
(328, 11, 2, 'sortie', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 23:49:30'),
(329, 15, 2, 'entree', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 02:49:30'),
(330, 13, 2, 'sortie', 8, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 05:49:30'),
(331, 10, 2, 'entree', 3, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 03:49:30'),
(332, 11, 2, 'entree', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 19:49:30'),
(333, 13, 2, 'sortie', 2, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 20:49:30'),
(334, 17, 2, 'sortie', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 19:49:30'),
(335, 18, 2, 'sortie', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 22:49:30'),
(336, 10, 2, 'sortie', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 22:49:30'),
(337, 16, 2, 'entree', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 04:49:30'),
(338, 14, 2, 'entree', 2, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 23:49:30'),
(339, 15, 2, 'entree', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 04:49:30'),
(340, 10, 2, 'entree', 11, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 19:49:30'),
(341, 16, 2, 'entree', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 00:49:30'),
(342, 15, 2, 'sortie', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 05:49:30'),
(343, 23, 3, 'entree', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 02:49:30'),
(344, 19, 3, 'sortie', 2, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 21:49:30'),
(345, 21, 3, 'sortie', 11, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 23:49:30'),
(346, 20, 3, 'entree', 7, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 01:49:30'),
(347, 19, 3, 'entree', 12, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 20:49:30'),
(348, 23, 3, 'sortie', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 02:49:30'),
(349, 27, 3, 'entree', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 20:49:30'),
(350, 20, 3, 'entree', 3, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 19:49:30'),
(351, 22, 3, 'entree', 3, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 01:49:30'),
(352, 24, 3, 'entree', 9, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 19:49:30'),
(353, 20, 3, 'sortie', 13, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 22:49:30'),
(354, 22, 3, 'sortie', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 22:49:30'),
(355, 24, 3, 'entree', 4, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 20:49:30'),
(356, 26, 3, 'sortie', 2, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 21:49:30'),
(357, 19, 3, 'entree', 8, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 03:49:30'),
(358, 26, 3, 'entree', 9, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 23:49:30'),
(359, 23, 3, 'entree', 11, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 23:49:30'),
(360, 25, 3, 'entree', 9, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 02:49:30'),
(361, 20, 3, 'entree', 12, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 19:49:30'),
(362, 26, 3, 'entree', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 20:49:30'),
(363, 21, 3, 'sortie', 7, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 01:49:30'),
(364, 19, 3, 'sortie', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 20:49:30'),
(365, 19, 3, 'sortie', 12, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 02:49:30'),
(366, 27, 3, 'entree', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 23:49:30'),
(367, 20, 3, 'entree', 2, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 19:49:30'),
(368, 26, 3, 'sortie', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 23:49:30'),
(369, 23, 3, 'entree', 11, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 05:49:30'),
(370, 23, 3, 'sortie', 12, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 04:49:30'),
(371, 23, 3, 'entree', 8, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 23:49:30'),
(372, 25, 3, 'entree', 9, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 00:49:30'),
(373, 24, 3, 'sortie', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 19:49:30'),
(374, 20, 3, 'sortie', 4, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 05:49:30'),
(375, 19, 3, 'entree', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 03:49:30'),
(376, 27, 3, 'sortie', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 03:49:30'),
(377, 22, 3, 'entree', 4, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 01:49:30'),
(378, 22, 3, 'sortie', 3, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 01:49:30'),
(379, 25, 3, 'sortie', 7, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 22:49:30'),
(380, 23, 3, 'entree', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 03:49:30'),
(381, 26, 3, 'entree', 13, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 20:49:30'),
(382, 23, 3, 'entree', 13, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 19:49:30'),
(383, 21, 3, 'sortie', 2, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 00:49:30'),
(384, 20, 3, 'sortie', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 23:49:30'),
(385, 19, 3, 'entree', 2, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 19:49:30'),
(386, 22, 3, 'entree', 7, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 21:49:30'),
(387, 22, 3, 'sortie', 12, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 19:49:30'),
(388, 24, 3, 'sortie', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 22:49:30'),
(389, 21, 3, 'sortie', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 04:49:30'),
(390, 23, 3, 'entree', 4, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 23:49:30'),
(391, 19, 3, 'entree', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 20:49:30'),
(392, 25, 3, 'sortie', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 03:49:30'),
(393, 24, 3, 'entree', 13, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 00:49:30'),
(394, 22, 3, 'entree', 12, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 05:49:30'),
(395, 19, 3, 'entree', 12, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 05:49:30'),
(396, 29, 4, 'sortie', 8, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 22:49:30'),
(397, 35, 4, 'sortie', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 19:49:30'),
(398, 29, 4, 'sortie', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 05:49:30'),
(399, 28, 4, 'entree', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 03:49:30'),
(400, 35, 4, 'sortie', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 05:49:30'),
(401, 33, 4, 'entree', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 02:49:30'),
(402, 34, 4, 'sortie', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 01:49:30'),
(403, 35, 4, 'sortie', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 03:49:30'),
(404, 34, 4, 'sortie', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 19:49:30'),
(405, 36, 4, 'entree', 8, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 00:49:30'),
(406, 28, 4, 'entree', 8, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 00:49:30'),
(407, 33, 4, 'entree', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 21:49:30'),
(408, 32, 4, 'entree', 13, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 01:49:30'),
(409, 36, 4, 'entree', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 21:49:30'),
(410, 34, 4, 'sortie', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 04:49:30'),
(411, 33, 4, 'sortie', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 00:49:30'),
(412, 36, 4, 'entree', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 21:49:30'),
(413, 30, 4, 'sortie', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 02:49:30'),
(414, 33, 4, 'sortie', 8, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 20:49:30'),
(415, 34, 4, 'entree', 3, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 00:49:30'),
(416, 33, 4, 'entree', 7, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 03:49:30'),
(417, 31, 4, 'sortie', 2, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 01:49:30'),
(418, 31, 4, 'entree', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 20:49:30'),
(419, 34, 4, 'entree', 12, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 22:49:30'),
(420, 34, 4, 'sortie', 3, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 05:49:30'),
(421, 30, 4, 'sortie', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 01:49:30'),
(422, 32, 4, 'sortie', 2, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 02:49:30'),
(423, 33, 4, 'sortie', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 21:49:30'),
(424, 31, 4, 'sortie', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 03:49:30'),
(425, 32, 4, 'sortie', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 04:49:30'),
(426, 34, 4, 'entree', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 02:49:30'),
(427, 33, 4, 'sortie', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 03:49:30'),
(428, 28, 4, 'entree', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 04:49:30'),
(429, 31, 4, 'sortie', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 19:49:30'),
(430, 31, 4, 'entree', 9, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 20:49:30'),
(431, 28, 4, 'sortie', 4, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 21:49:30'),
(432, 29, 4, 'entree', 7, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 02:49:30'),
(433, 31, 4, 'sortie', 11, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 20:49:30'),
(434, 35, 4, 'sortie', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 04:49:30'),
(435, 30, 4, 'entree', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 22:49:30'),
(436, 36, 4, 'sortie', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 03:49:30'),
(437, 33, 4, 'sortie', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 00:49:30'),
(438, 32, 4, 'entree', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 00:49:30'),
(439, 29, 4, 'entree', 13, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 05:49:30'),
(440, 32, 4, 'entree', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 00:49:30'),
(441, 30, 4, 'entree', 3, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 20:49:30'),
(442, 32, 4, 'sortie', 13, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 22:49:30'),
(443, 32, 4, 'sortie', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 05:49:30'),
(444, 28, 4, 'entree', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 05:49:30'),
(445, 31, 4, 'sortie', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 22:49:30'),
(446, 36, 4, 'entree', 2, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 20:49:30'),
(447, 29, 4, 'entree', 2, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 00:49:30'),
(448, 33, 4, 'entree', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 00:49:30'),
(449, 30, 4, 'sortie', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 02:49:30'),
(450, 31, 4, 'sortie', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 00:49:30'),
(451, 30, 4, 'sortie', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 03:49:30'),
(452, 36, 4, 'entree', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 22:49:30'),
(453, 29, 4, 'sortie', 12, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 23:49:30'),
(454, 31, 4, 'sortie', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 02:49:30'),
(455, 36, 4, 'entree', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 04:49:30'),
(456, 29, 4, 'entree', 4, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 05:49:30'),
(457, 29, 4, 'entree', 3, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 05:49:30'),
(458, 35, 4, 'entree', 13, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 04:49:30'),
(459, 36, 4, 'sortie', 13, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 21:49:30'),
(460, 32, 4, 'sortie', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 22:49:30'),
(461, 45, 5, 'sortie', 12, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 00:49:30'),
(462, 43, 5, 'sortie', 13, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 22:49:30'),
(463, 38, 5, 'entree', 2, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 00:49:30'),
(464, 38, 5, 'sortie', 7, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 02:49:30'),
(465, 41, 5, 'entree', 2, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 05:49:30'),
(466, 37, 5, 'entree', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 00:49:30'),
(467, 37, 5, 'sortie', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 03:49:30'),
(468, 39, 5, 'entree', 11, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 00:49:30'),
(469, 44, 5, 'sortie', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 23:49:30'),
(470, 43, 5, 'entree', 7, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 20:49:30'),
(471, 40, 5, 'sortie', 4, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 03:49:30'),
(472, 44, 5, 'sortie', 3, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 04:49:30'),
(473, 38, 5, 'entree', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 01:49:30'),
(474, 44, 5, 'entree', 4, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 21:49:30'),
(475, 42, 5, 'entree', 7, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 22:49:30'),
(476, 38, 5, 'sortie', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 01:49:30'),
(477, 40, 5, 'sortie', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 21:49:30'),
(478, 38, 5, 'sortie', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 19:49:30'),
(479, 39, 5, 'sortie', 11, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 22:49:30'),
(480, 38, 5, 'sortie', 4, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 03:49:30'),
(481, 42, 5, 'entree', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 03:49:30'),
(482, 43, 5, 'sortie', 7, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 21:49:30'),
(483, 43, 5, 'sortie', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 23:49:30'),
(484, 38, 5, 'sortie', 8, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 03:49:30'),
(485, 45, 5, 'entree', 4, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 01:49:30'),
(486, 39, 5, 'entree', 7, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 19:49:30'),
(487, 40, 5, 'entree', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 01:49:30'),
(488, 39, 5, 'entree', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 03:49:30'),
(489, 45, 5, 'sortie', 12, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 21:49:30'),
(490, 41, 5, 'entree', 11, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 04:49:30'),
(491, 40, 5, 'entree', 3, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 04:49:30'),
(492, 39, 5, 'sortie', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 22:49:30'),
(493, 41, 5, 'entree', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 19:49:30'),
(494, 45, 5, 'entree', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 02:49:30'),
(495, 41, 5, 'sortie', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 19:49:30'),
(496, 40, 5, 'sortie', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 19:49:31'),
(497, 37, 5, 'entree', 4, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 04:49:31'),
(498, 37, 5, 'entree', 4, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 02:49:31'),
(499, 39, 5, 'sortie', 2, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 01:49:31'),
(500, 40, 5, 'entree', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 02:49:31'),
(501, 44, 5, 'sortie', 11, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 05:49:31'),
(502, 42, 5, 'entree', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 03:49:31'),
(503, 45, 5, 'sortie', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 04:49:31'),
(504, 38, 5, 'entree', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 02:49:31'),
(505, 38, 5, 'sortie', 4, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 23:49:31'),
(506, 44, 5, 'sortie', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 02:49:31'),
(507, 44, 5, 'entree', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 20:49:31'),
(508, 45, 5, 'entree', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 05:49:31'),
(509, 42, 5, 'entree', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 03:49:31'),
(510, 43, 5, 'sortie', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 01:49:31'),
(511, 39, 5, 'sortie', 4, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 00:49:31'),
(512, 39, 5, 'entree', 2, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 04:49:31'),
(513, 42, 5, 'sortie', 13, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 22:49:31');
INSERT INTO `mouvements_stock` (`id`, `produit_id`, `pharmacie_id`, `type_mouvement`, `quantite`, `raison`, `stock_avant`, `stock_apres`, `reference`, `commentaire`, `date_mouvement`) VALUES
(514, 39, 5, 'sortie', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 03:49:31'),
(515, 41, 5, 'entree', 2, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 04:49:31'),
(516, 39, 5, 'sortie', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 20:49:31'),
(517, 41, 5, 'entree', 8, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 03:49:31'),
(518, 43, 5, 'entree', 2, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 22:49:31'),
(519, 38, 5, 'entree', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 20:49:31'),
(520, 43, 5, 'sortie', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 00:49:31'),
(521, 41, 5, 'entree', 9, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 03:49:31'),
(522, 37, 5, 'entree', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 20:49:31'),
(523, 39, 5, 'sortie', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 19:49:31'),
(524, 39, 5, 'entree', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 04:49:31'),
(525, 53, 6, 'sortie', 11, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 20:49:31'),
(526, 50, 6, 'entree', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 21:49:31'),
(527, 51, 6, 'sortie', 7, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 22:49:31'),
(528, 51, 6, 'sortie', 7, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 02:49:31'),
(529, 51, 6, 'entree', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 02:49:31'),
(530, 50, 6, 'sortie', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 22:49:31'),
(531, 54, 6, 'entree', 7, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 23:49:31'),
(532, 47, 6, 'sortie', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 01:49:31'),
(533, 53, 6, 'sortie', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 04:49:31'),
(534, 52, 6, 'entree', 7, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-20 00:49:31'),
(535, 53, 6, 'entree', 12, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 20:49:31'),
(536, 51, 6, 'sortie', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 22:49:31'),
(537, 50, 6, 'entree', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 19:49:31'),
(538, 50, 6, 'sortie', 2, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 21:49:31'),
(539, 52, 6, 'sortie', 8, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 23:49:31'),
(540, 54, 6, 'entree', 2, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 21:49:31'),
(541, 50, 6, 'entree', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-19 00:49:31'),
(542, 50, 6, 'sortie', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 19:49:31'),
(543, 51, 6, 'entree', 2, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 05:49:31'),
(544, 46, 6, 'sortie', 11, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 21:49:31'),
(545, 52, 6, 'entree', 8, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 00:49:31'),
(546, 47, 6, 'sortie', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 05:49:31'),
(547, 50, 6, 'sortie', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-18 01:49:31'),
(548, 51, 6, 'sortie', 12, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 20:49:31'),
(549, 51, 6, 'entree', 2, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 22:49:31'),
(550, 54, 6, 'sortie', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 20:49:31'),
(551, 51, 6, 'sortie', 3, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 20:49:31'),
(552, 49, 6, 'entree', 4, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 20:49:31'),
(553, 53, 6, 'sortie', 12, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 23:49:31'),
(554, 50, 6, 'sortie', 4, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 22:49:31'),
(555, 53, 6, 'sortie', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 03:49:31'),
(556, 53, 6, 'sortie', 12, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 03:49:31'),
(557, 53, 6, 'sortie', 2, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-17 05:49:31'),
(558, 54, 6, 'sortie', 11, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 04:49:31'),
(559, 47, 6, 'entree', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 05:49:31'),
(560, 54, 6, 'sortie', 13, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 23:49:31'),
(561, 48, 6, 'entree', 5, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 19:49:31'),
(562, 46, 6, 'sortie', 8, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 19:49:31'),
(563, 53, 6, 'entree', 12, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 02:49:31'),
(564, 50, 6, 'entree', 10, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-16 02:49:31'),
(565, 47, 6, 'sortie', 6, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 22:49:31'),
(566, 53, 6, 'entree', 9, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 23:49:31'),
(567, 46, 6, 'sortie', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 02:49:31'),
(568, 46, 6, 'entree', 8, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 21:49:31'),
(569, 46, 6, 'entree', 15, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 22:49:31'),
(570, 54, 6, 'sortie', 2, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-15 03:49:31'),
(571, 46, 6, 'sortie', 12, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 02:49:31'),
(572, 52, 6, 'entree', 13, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 19:49:31'),
(573, 50, 6, 'entree', 9, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 19:49:31'),
(574, 52, 6, 'sortie', 14, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 23:49:31'),
(575, 50, 6, 'entree', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 19:49:31'),
(576, 50, 6, 'entree', 1, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 23:49:31'),
(577, 46, 6, 'entree', 7, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-14 03:49:31'),
(578, 47, 6, 'entree', 12, 'Mouvement Dashboard', NULL, NULL, NULL, NULL, '2026-02-13 22:49:31'),
(579, 1, 1, 'entree', 18, 'Mise à jour inventaire', 0, 18, NULL, 'Mise à jour manuelle', '2026-02-24 08:49:23'),
(580, 1, 1, 'entree', 15, 'Mise à jour inventaire', 18, 33, NULL, 'Mise à jour manuelle', '2026-02-24 08:49:39'),
(581, 7, 1, 'sortie', 81, 'Mise à jour inventaire', 81, 0, NULL, 'Mise à jour manuelle', '2026-02-24 08:49:51'),
(582, 8, 1, 'sortie', 57, 'Mise à jour inventaire', 69, 12, NULL, 'Mise à jour manuelle', '2026-02-26 10:12:43'),
(583, 8, 1, 'entree', 21, 'Mise à jour inventaire', 12, 33, NULL, 'Mise à jour manuelle', '2026-02-26 10:13:25'),
(584, 8, 1, 'entree', 0, 'Mise à jour inventaire', 33, 33, NULL, 'Mise à jour manuelle', '2026-03-11 15:30:09'),
(585, 55, 1, 'entree', 39, 'Mise à jour inventaire', 0, 39, 'INIT-55', 'Création du produit', '2026-03-11 15:53:29'),
(586, 56, 1, 'entree', 38, 'Mise à jour inventaire', 0, 38, 'INIT-56', 'Création du produit', '2026-03-11 15:58:05'),
(588, 56, 1, 'entree', 0, 'Mise à jour inventaire', 38, 38, NULL, 'Mise à jour manuelle', '2026-03-11 16:20:45'),
(591, 60, 1, 'entree', 20, 'Mise à jour inventaire', 0, 20, 'INIT-60', 'Création du produit', '2026-03-11 16:31:13'),
(592, 61, 1, 'entree', 24, 'Mise à jour inventaire', 0, 24, 'INIT-61', 'Création du produit', '2026-03-11 16:33:32'),
(593, 46, 6, 'entree', 30, 'Mise à jour inventaire', 0, 30, NULL, 'Mise à jour manuelle', '2026-03-11 21:23:24');

-- --------------------------------------------------------

--
-- Structure de la table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `pharmacie_id` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` enum('demande','stock','expiration','message','systeme') DEFAULT 'systeme',
  `lien` varchar(500) DEFAULT NULL,
  `lu` tinyint(1) DEFAULT 0,
  `date_creation` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `notifications`
--

INSERT INTO `notifications` (`id`, `pharmacie_id`, `titre`, `message`, `type`, `lien`, `lu`, `date_creation`) VALUES
(1, 1, 'Stock Faible', 'Votre stock de Doliprane est en dessous du seuil.', 'stock', NULL, 1, '2026-02-18 11:13:01'),
(2, 1, 'Nouvelle Demande', 'Un confrère s\'intéresse à votre annonce.', 'demande', NULL, 1, '2026-02-19 09:13:01'),
(3, 2, 'Stock Faible', 'Votre stock de Doliprane est en dessous du seuil.', 'stock', NULL, 0, '2026-02-18 11:13:01'),
(4, 2, 'Nouvelle Demande', 'Un confrère s\'intéresse à votre annonce.', 'demande', NULL, 0, '2026-02-19 09:13:01'),
(5, 3, 'Stock Faible', 'Votre stock de Doliprane est en dessous du seuil.', 'stock', NULL, 1, '2026-02-18 11:13:01'),
(6, 3, 'Nouvelle Demande', 'Un confrère s\'intéresse à votre annonce.', 'demande', NULL, 1, '2026-02-19 09:13:01'),
(7, 4, 'Stock Faible', 'Votre stock de Doliprane est en dessous du seuil.', 'stock', NULL, 0, '2026-02-18 11:13:01'),
(8, 4, 'Nouvelle Demande', 'Un confrère s\'intéresse à votre annonce.', 'demande', NULL, 0, '2026-02-19 09:13:01'),
(9, 5, 'Stock Faible', 'Votre stock de Doliprane est en dessous du seuil.', 'stock', NULL, 0, '2026-02-18 11:13:02'),
(10, 5, 'Nouvelle Demande', 'Un confrère s\'intéresse à votre annonce.', 'demande', NULL, 0, '2026-02-19 09:13:02'),
(11, 6, 'Stock Faible', 'Votre stock de Doliprane est en dessous du seuil.', 'stock', NULL, 1, '2026-02-18 11:13:02'),
(12, 6, 'Nouvelle Demande', 'Un confrère s\'intéresse à votre annonce.', 'demande', NULL, 1, '2026-02-19 09:13:02'),
(13, 4, 'Demande acceptée', 'La demande pour Besoin Amoxicilline/Acide Clavulanique Nourrisson a été acceptée', 'demande', '/requests', 0, '2026-02-19 10:48:42'),
(14, 1, 'Bienvenue', 'Bienvenue sur PharmShare, votre réseau d\'entraide.', 'systeme', NULL, 1, '2026-02-14 11:49:30'),
(15, 1, 'Alerte Stock', 'Certains de vos produits sont en rupture.', 'stock', NULL, 1, '2026-02-19 09:49:30'),
(16, 2, 'Bienvenue', 'Bienvenue sur PharmShare, votre réseau d\'entraide.', 'systeme', NULL, 0, '2026-02-14 11:49:30'),
(17, 2, 'Alerte Stock', 'Certains de vos produits sont en rupture.', 'stock', NULL, 0, '2026-02-19 09:49:30'),
(18, 3, 'Bienvenue', 'Bienvenue sur PharmShare, votre réseau d\'entraide.', 'systeme', NULL, 1, '2026-02-14 11:49:30'),
(19, 3, 'Alerte Stock', 'Certains de vos produits sont en rupture.', 'stock', NULL, 1, '2026-02-19 09:49:30'),
(20, 4, 'Bienvenue', 'Bienvenue sur PharmShare, votre réseau d\'entraide.', 'systeme', NULL, 0, '2026-02-14 11:49:30'),
(21, 4, 'Alerte Stock', 'Certains de vos produits sont en rupture.', 'stock', NULL, 0, '2026-02-19 09:49:30'),
(22, 5, 'Bienvenue', 'Bienvenue sur PharmShare, votre réseau d\'entraide.', 'systeme', NULL, 0, '2026-02-14 11:49:31'),
(23, 5, 'Alerte Stock', 'Certains de vos produits sont en rupture.', 'stock', NULL, 0, '2026-02-19 09:49:31'),
(24, 6, 'Bienvenue', 'Bienvenue sur PharmShare, votre réseau d\'entraide.', 'systeme', NULL, 1, '2026-02-14 11:49:31'),
(25, 6, 'Alerte Stock', 'Certains de vos produits sont en rupture.', 'stock', NULL, 1, '2026-02-19 09:49:31'),
(26, 1, 'Nouveau message de Pharmacie de la Paix', 'cc', 'message', '/chat', 1, '2026-02-19 11:44:43'),
(27, 6, 'Demande terminée', 'La demande pour Augmentin 1g a été terminée', 'demande', '/requests', 1, '2026-02-19 12:26:27'),
(28, 6, 'Demande terminée', 'La demande pour Augmentin 1g a été terminée', 'demande', '/requests', 1, '2026-02-19 12:26:28'),
(29, 6, 'Demande terminée', 'La demande pour Augmentin 1g a été terminée', 'demande', '/requests', 1, '2026-02-19 12:26:31'),
(30, 4, 'Demande terminée', 'La demande pour Besoin Amoxicilline/Acide Clavulanique Nourrisson a été terminée', 'demande', '/requests', 0, '2026-02-19 12:26:43'),
(31, 6, 'Demande terminée', 'La demande pour Augmentin 1g a été terminée', 'demande', '/requests', 1, '2026-02-19 12:27:17'),
(32, 6, 'Demande terminée', 'La demande pour Augmentin 1g a été terminée', 'demande', '/requests', 1, '2026-02-19 12:27:18'),
(33, 2, 'Demande terminée', 'La demande pour Amoxicilline 500mg a été terminée', 'demande', '/requests', 0, '2026-02-19 12:27:21'),
(34, 2, 'Demande terminée', 'La demande pour Amoxicilline 500mg a été terminée', 'demande', '/requests', 0, '2026-02-19 12:27:21'),
(35, 2, 'Demande terminée', 'La demande pour Amoxicilline 500mg a été terminée', 'demande', '/requests', 0, '2026-02-19 12:27:22'),
(36, 3, 'Demande terminée', 'La demande pour Spasfon a été terminée', 'demande', '/requests', 1, '2026-02-19 12:27:44'),
(37, 6, 'Demande terminée', 'La demande pour Augmentin 1g a été terminée', 'demande', '/requests', 1, '2026-02-19 12:31:04'),
(38, 6, 'Demande terminée', 'La demande pour Augmentin 1g a été terminée', 'demande', '/requests', 1, '2026-02-19 12:36:26'),
(39, 6, 'Demande terminée', 'La demande pour Augmentin 1g a été terminée', 'demande', '/requests', 1, '2026-02-19 13:05:50'),
(40, 6, 'Demande terminée', 'La demande pour Augmentin 1g a été terminée', 'demande', '/requests', 1, '2026-02-19 13:07:13'),
(41, 6, 'Demande terminée', 'La demande pour Augmentin 1g a été terminée', 'demande', '/requests', 1, '2026-02-19 13:07:14'),
(42, 4, 'Demande terminée', 'La demande pour Besoin Amoxicilline/Acide Clavulanique Nourrisson a été terminée', 'demande', '/requests', 0, '2026-02-19 13:07:16'),
(43, 6, 'Demande terminée', 'La demande pour Augmentin 1g a été terminée', 'demande', '/requests', 1, '2026-02-19 13:27:24'),
(44, 6, 'Demande terminée', 'La demande pour Augmentin 1g a été terminée', 'demande', '/requests', 1, '2026-02-19 13:27:24'),
(45, 6, 'Demande terminée', 'La demande pour Augmentin 1g a été terminée', 'demande', '/requests', 1, '2026-02-19 13:27:24'),
(46, 6, 'Demande terminée', 'La demande pour Augmentin 1g a été terminée', 'demande', '/requests', 1, '2026-02-19 13:27:24'),
(47, 2, 'Demande terminée', 'La demande pour Amoxicilline 500mg a été terminée', 'demande', '/requests', 0, '2026-02-19 13:27:32'),
(48, 2, 'Demande terminée', 'La demande pour Amoxicilline 500mg a été terminée', 'demande', '/requests', 0, '2026-02-19 13:27:32'),
(49, 2, 'Demande terminée', 'La demande pour Amoxicilline 500mg a été terminée', 'demande', '/requests', 0, '2026-02-19 13:27:32'),
(50, 2, 'Demande terminée', 'La demande pour Amoxicilline 500mg a été terminée', 'demande', '/requests', 0, '2026-02-19 13:27:33'),
(51, 6, 'Demande terminée', 'La demande pour Augmentin 1g a été terminée', 'demande', '/requests', 1, '2026-02-19 13:28:50'),
(52, 6, 'Demande terminée', 'La demande pour Augmentin 1g a été terminée', 'demande', '/requests', 1, '2026-02-19 13:28:51'),
(53, 6, 'Demande terminée', 'La demande pour Augmentin 1g a été terminée', 'demande', '/requests', 1, '2026-02-19 13:30:51'),
(54, 6, 'Demande terminée', 'La demande pour Augmentin 1g a été terminée', 'demande', '/requests', 1, '2026-02-19 13:31:08'),
(55, 1, 'Nouvelle demande reçue', 'Pharmacie de la Paix souhaite acheter 1 boîtes de TEST DEBUG', 'demande', '/requests', 1, '2026-03-03 11:36:12'),
(56, 3, 'Nouvelle demande reçue', 'Pharmacie de la Paix souhaite acheter 50 boîtes de RECHERCHE URGENTE : Amoxicilline 500mg', 'demande', '/requests', 1, '2026-03-03 11:36:18'),
(57, 1, 'Demande refusée', 'La demande pour TEST DEBUG a été refusée', 'demande', '/requests', 1, '2026-03-03 11:36:43'),
(58, 1, 'Nouvelle demande reçue', 'Pharmacie de la Paix souhaite acheter 17 boîtes de Recherche Glucophage 1000mg', 'demande', '/requests', 1, '2026-03-03 15:14:57'),
(59, 1, 'Nouvelle demande reçue', 'Pharmacie de la Paix souhaite acheter 17 boîtes de Recherche Glucophage 1000mg', 'demande', '/requests', 1, '2026-03-03 15:15:04'),
(60, 1, 'Demande refusée', 'La demande pour Recherche Glucophage 1000mg a été refusée', 'demande', '/requests', 1, '2026-03-03 15:15:38'),
(61, 1, 'Demande refusée', 'La demande pour Recherche Glucophage 1000mg a été refusée', 'demande', '/requests', 1, '2026-03-03 15:15:40'),
(62, 1, 'Nouveau message de Pharmacie de la Paix', 'yo', 'message', '/chat', 1, '2026-03-03 15:19:48'),
(63, 3, 'Nouveau message de Pharmacie de la Paix', 'cc', 'message', '/chat', 1, '2026-03-03 15:20:01'),
(64, 1, 'Nouveau message de Pharmacie St. Pierre', 'bonjour comment puije vous aidez', 'message', '/chat', 1, '2026-03-03 15:44:54'),
(65, 3, 'Nouveau message de Pharmacie de la Paix', 'je recherche du paracetamol', 'message', '/chat', 1, '2026-03-03 15:46:03'),
(66, 1, 'Demande acceptée', 'La demande pour RECHERCHE URGENTE : Amoxicilline 500mg a été acceptée', 'demande', '/requests', 1, '2026-03-04 11:14:44'),
(67, 5, 'Nouvelle demande reçue', 'Pharmacie St. Pierre souhaite acheter 20 boîtes de Besoin de Spasfon Comprimés', 'demande', '/requests', 0, '2026-03-04 12:12:18'),
(68, 5, 'Nouvelle demande reçue', 'Pharmacie St. Pierre souhaite acheter 20 boîtes de Besoin de Spasfon Comprimés', 'demande', '/requests', 0, '2026-03-04 12:12:25'),
(69, 3, 'Nouveau message de Pharmacie Centrale', 'salut', 'message', '/chat', 1, '2026-03-11 17:32:00'),
(70, 3, 'Nouveau message de Pharmacie Centrale', 'salut', 'message', '/chat', 1, '2026-03-11 17:34:44'),
(71, 6, 'Nouveau message de Pharmacie St. Pierre', 'cc', 'message', '/chat', 1, '2026-03-11 17:38:19'),
(72, 1, 'Nouveau message de Pharmacie Centrale', 'cc', 'message', '/chat', 1, '2026-03-11 17:44:27'),
(73, 1, 'Nouvelle demande reçue', 'Pharmacie de la Paix souhaite acheter 13 boîtes de Aspirine', 'demande', '/requests', 1, '2026-03-11 18:02:07'),
(74, 1, 'Nouvelle demande reçue', 'Pharmacie de la Paix souhaite acheter 13 boîtes de Aspirine', 'demande', '/requests', 1, '2026-03-11 18:03:11'),
(75, 3, 'Paiement Reçu (Wave)', 'Pharmacie de la Paix vous a envoyé un paiement Wave de 0.00 FCFA pour RECHERCHE URGENTE : Amoxicilline 500mg.', '', NULL, 1, '2026-03-11 18:04:31'),
(76, 6, 'Fichier reçu de Pharmacie de la Paix', 'Pharmacie de la Paix vous a envoyé une photo.', 'message', '/chat', 1, '2026-03-11 18:22:58'),
(77, 4, 'Paiement Reçu (Wave)', 'Pharmacie Centrale vous a envoyé un paiement Wave de 0.00 FCFA pour Demande Augmentin 1g pour patient.', '', NULL, 0, '2026-03-11 18:43:13'),
(78, 3, 'Nouveau message de Pharmacie Centrale', 'cc', 'message', '/chat', 1, '2026-03-11 21:37:21'),
(79, 6, 'Nouveau message de Pharmacie St. Pierre', 'cc', 'message', '/chat', 1, '2026-03-11 21:47:14'),
(80, 5, 'Demande acceptée', 'La demande pour Amoxicilline 500mg a été acceptée', 'demande', '/requests', 0, '2026-03-11 22:26:43'),
(81, 2, 'Paiement Reçu (Wave)', 'Pharmacie de la Paix vous a envoyé un paiement Wave de 0.00 FCFA pour Amoxicilline 500mg.', '', NULL, 0, '2026-03-25 09:43:00'),
(82, 6, 'Paiement Reçu (Wave)', 'Pharmacie de la Paix vous a envoyé un paiement Wave de 0.00 FCFA pour Cherche Lovenox 4000 UI.', '', NULL, 1, '2026-03-25 10:30:14'),
(83, 6, 'Demande acceptée', 'La demande pour Augmentin 1g a été acceptée', 'demande', '/requests', 1, '2026-03-25 10:30:55'),
(84, 4, 'Demande acceptée', 'La demande pour Besoin Amoxicilline/Acide Clavulanique Nourrisson a été acceptée', 'demande', '/requests', 0, '2026-03-25 10:30:58'),
(85, 5, 'Paiement Reçu (Wave)', 'Pharmacie Centrale vous a envoyé un paiement Wave de 15310.00 FCFA pour Efferalgan 500mg.', '', NULL, 0, '2026-03-25 11:34:42'),
(86, 1, 'Demande acceptée', 'La demande pour Amoxicilline 500mg a été acceptée', 'demande', '/requests', 0, '2026-03-25 11:40:56'),
(87, 1, 'Demande acceptée', 'La demande pour Cherche Lovenox 4000 UI a été acceptée', 'demande', '/requests', 0, '2026-03-25 11:42:09'),
(88, 6, 'Demande acceptée', 'La demande pour Augmentin 1g a été acceptée', 'demande', '/requests', 0, '2026-03-25 11:58:29'),
(89, 1, 'Paiement Reçu (Wave)', 'Pharmacie Centrale vous a envoyé un paiement Wave de 2063.00 FCFA pour Augmentin 1g.', '', NULL, 0, '2026-03-25 11:59:16');

-- --------------------------------------------------------

--
-- Structure de la table `paiements`
--

CREATE TABLE `paiements` (
  `id` int(11) NOT NULL,
  `demande_id` int(11) NOT NULL,
  `pharmacie_id` int(11) NOT NULL,
  `montant` decimal(10,2) NOT NULL,
  `methode` varchar(50) DEFAULT 'wave',
  `statut` varchar(50) DEFAULT 'en_attente',
  `reference_externe` varchar(255) DEFAULT NULL,
  `telephone` varchar(50) DEFAULT NULL,
  `date_creation` datetime DEFAULT current_timestamp(),
  `date_maj` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `paiements`
--

INSERT INTO `paiements` (`id`, `demande_id`, `pharmacie_id`, `montant`, `methode`, `statut`, `reference_externe`, `telephone`, `date_creation`, `date_maj`) VALUES
(1, 54, 1, 0.00, 'wave', 'reussi', 'WAVE_EB06BE1416F6', '05923358', '2026-03-11 18:04:28', '2026-03-11 18:04:31'),
(2, 15, 6, 0.00, 'wave', 'reussi', 'WAVE_5E3E13426EB9', '01020304', '2026-03-11 18:43:10', '2026-03-11 18:43:13'),
(3, 3, 1, 0.00, 'wave', 'reussi', 'WAVE_3F89F2167C56', '45UI7669PO89Ö°6', '2026-03-25 09:42:57', '2026-03-25 09:43:00'),
(4, 30, 1, 0.00, 'wave', 'reussi', 'WAVE_EDEE8D002045', 'tftgh', '2026-03-25 10:30:11', '2026-03-25 10:30:14'),
(5, 48, 6, 15310.00, 'wave', 'reussi', 'WAVE_6C16E3815699', 'h', '2026-03-25 11:34:39', '2026-03-25 11:34:42'),
(6, 1, 6, 2063.00, 'wave', 'reussi', 'WAVE_C31487489B93', '-', '2026-03-25 11:59:13', '2026-03-25 11:59:16');

-- --------------------------------------------------------

--
-- Structure de la table `parametres`
--

CREATE TABLE `parametres` (
  `id` int(11) NOT NULL,
  `pharmacie_id` int(11) NOT NULL,
  `theme` enum('dark','light') DEFAULT 'dark',
  `langue` varchar(10) DEFAULT 'fr',
  `notif_email` tinyint(1) DEFAULT 1,
  `notif_stock` tinyint(1) DEFAULT 1,
  `notif_demandes` tinyint(1) DEFAULT 1,
  `notif_messages` tinyint(1) DEFAULT 1,
  `seuil_alerte_jours` int(11) DEFAULT 90,
  `date_modification` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `parametres`
--

INSERT INTO `parametres` (`id`, `pharmacie_id`, `theme`, `langue`, `notif_email`, `notif_stock`, `notif_demandes`, `notif_messages`, `seuil_alerte_jours`, `date_modification`) VALUES
(1, 1, 'dark', 'fr', 1, 1, 1, 1, 90, '2026-02-13 11:31:01');

-- --------------------------------------------------------

--
-- Structure de la table `pharmacies`
--

CREATE TABLE `pharmacies` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `adresse` varchar(500) DEFAULT NULL,
  `ville` varchar(100) DEFAULT 'Abidjan',
  `quartier` varchar(100) DEFAULT NULL,
  `licence_numero` varchar(100) DEFAULT NULL,
  `responsable` varchar(255) DEFAULT NULL,
  `photo_url` varchar(500) DEFAULT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `date_creation` datetime DEFAULT current_timestamp(),
  `date_modification` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `pharmacies`
--

INSERT INTO `pharmacies` (`id`, `nom`, `email`, `mot_de_passe`, `telephone`, `adresse`, `ville`, `quartier`, `licence_numero`, `responsable`, `photo_url`, `actif`, `date_creation`, `date_modification`) VALUES
(1, 'Pharmacie de la Paix', 'pharmaciedelapaix@pharmshare.ci', '$2y$12$cLVkyMbsGQTDBrpuV/fGhuXpJypfV3a/iFlIzRx4S0dbmMqmeLBfK', '', 'Boulevard Plateau', 'Abidjan', 'Plateau', NULL, 'Dr. Kouassi', NULL, 1, '2026-02-19 09:36:53', '2026-03-11 17:55:42'),
(2, 'Pharmacie du Marché', 'pharmaciedumarche@pharmshare.ci', '$2y$12$cLVkyMbsGQTDBrpuV/fGhuXpJypfV3a/iFlIzRx4S0dbmMqmeLBfK', '0102030405', 'Boulevard Cocody', 'Abidjan', 'Cocody', NULL, 'Dr. Bakayoko', NULL, 1, '2026-02-19 09:36:53', '2026-03-25 11:40:23'),
(3, 'Pharmacie St. Pierre', 'pharmaciest.pierre@pharmshare.ci', '$2y$12$cLVkyMbsGQTDBrpuV/fGhuXpJypfV3a/iFlIzRx4S0dbmMqmeLBfK', '0102030405', 'Boulevard Marcory', 'Abidjan', 'Marcory', NULL, 'Dr. Yao', NULL, 1, '2026-02-19 09:36:54', '2026-02-19 10:10:18'),
(4, 'Pharmacie des Lagunes', 'pharmaciedeslagunes@pharmshare.ci', '$2y$12$cLVkyMbsGQTDBrpuV/fGhuXpJypfV3a/iFlIzRx4S0dbmMqmeLBfK', '0102030405', 'Boulevard Riviera', 'Abidjan', 'Riviera', NULL, 'Dr. Traoré', NULL, 1, '2026-02-19 09:36:54', '2026-02-19 10:10:18'),
(5, 'Pharmacie de l\'Avenir', 'pharmaciedel\'avenir@pharmshare.ci', '$2y$12$cLVkyMbsGQTDBrpuV/fGhuXpJypfV3a/iFlIzRx4S0dbmMqmeLBfK', '0102030405', 'Boulevard Centre', 'Bouaké', 'Centre', NULL, 'Dr. Diallo', NULL, 1, '2026-02-19 09:36:55', '2026-02-19 10:10:18'),
(6, 'Pharmacie Centrale', 'centrale@pharmshare.ci', '$2y$12$cLVkyMbsGQTDBrpuV/fGhuXpJypfV3a/iFlIzRx4S0dbmMqmeLBfK', '', NULL, 'Abidjan', 'Plateau', NULL, 'Dr. Admin', NULL, 1, '2026-02-19 10:07:40', '2026-03-11 17:29:55');

-- --------------------------------------------------------

--
-- Structure de la table `produits`
--

CREATE TABLE `produits` (
  `id` int(11) NOT NULL,
  `pharmacie_id` int(11) NOT NULL,
  `categorie_id` int(11) DEFAULT NULL,
  `nom` varchar(255) NOT NULL,
  `forme` enum('Comprimé','Sirop','Injectable','Sachet','Pommade','Suppositoire','Gélule','Ampoule','Effervescent','Lyophilisat','Autre') DEFAULT 'Comprimé',
  `dosage` varchar(100) DEFAULT NULL,
  `code_barre` varchar(50) DEFAULT NULL,
  `stock_actuel` int(11) NOT NULL DEFAULT 0,
  `stock_reserve` int(11) DEFAULT 0,
  `stock_minimum` int(11) NOT NULL DEFAULT 10,
  `prix_achat` decimal(10,2) DEFAULT NULL,
  `prix_vente` decimal(10,2) DEFAULT NULL,
  `date_expiration` date DEFAULT NULL,
  `lot_numero` varchar(100) DEFAULT NULL,
  `fournisseur` varchar(255) DEFAULT NULL,
  `statut` enum('en_stock','stock_faible','rupture','expire') DEFAULT 'en_stock',
  `image_url` text DEFAULT NULL,
  `date_creation` datetime DEFAULT current_timestamp(),
  `date_modification` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `produits`
--

INSERT INTO `produits` (`id`, `pharmacie_id`, `categorie_id`, `nom`, `forme`, `dosage`, `code_barre`, `stock_actuel`, `stock_reserve`, `stock_minimum`, `prix_achat`, `prix_vente`, `date_expiration`, `lot_numero`, `fournisseur`, `statut`, `image_url`, `date_creation`, `date_modification`) VALUES
(1, 1, NULL, 'Doliprane 1000mg', 'Comprimé', NULL, NULL, 33, 0, 20, NULL, NULL, '2026-03-06', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-24 08:49:39'),
(2, 1, NULL, 'Amoxicilline 500mg', 'Gélule', NULL, NULL, 0, 0, 20, NULL, NULL, '2027-08-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:16:47'),
(3, 1, NULL, 'Efferalgan 500mg', 'Sachet', NULL, NULL, 5, 0, 20, NULL, NULL, '2026-11-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:16:47'),
(4, 1, NULL, 'Spasfon', 'Comprimé', NULL, NULL, 5, 0, 20, NULL, NULL, '2027-05-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:16:47'),
(5, 1, NULL, 'Augmentin 1g', 'Comprimé', NULL, NULL, 143, 0, 20, NULL, NULL, '2026-04-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:13:01'),
(6, 1, NULL, 'Gaviscon', 'Sirop', NULL, NULL, 150, 0, 20, NULL, NULL, '2026-04-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:13:01'),
(7, 1, NULL, 'Vogalène', 'Suppositoire', NULL, NULL, 0, 0, 20, NULL, NULL, '2026-09-19', NULL, NULL, 'rupture', NULL, '2026-02-19 10:13:01', '2026-02-24 08:49:51'),
(8, 1, NULL, 'Clamoxyl', 'Injectable', NULL, NULL, 33, 0, 2, NULL, NULL, '2026-10-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-03-11 15:30:09'),
(9, 1, NULL, 'Imodium 2mg', 'Gélule', NULL, NULL, 64, 0, 20, NULL, NULL, '2026-03-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:13:01'),
(10, 2, NULL, 'Doliprane 1000mg', 'Comprimé', NULL, NULL, 0, 0, 20, NULL, NULL, '2026-03-06', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:16:47'),
(11, 2, NULL, 'Amoxicilline 500mg', 'Gélule', NULL, NULL, 0, 0, 20, NULL, NULL, '2027-05-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:16:47'),
(12, 2, NULL, 'Efferalgan 500mg', 'Sachet', NULL, NULL, 5, 0, 20, NULL, NULL, '2027-02-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:16:47'),
(13, 2, NULL, 'Spasfon', 'Comprimé', NULL, NULL, 5, 0, 20, NULL, NULL, '2026-09-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:16:47'),
(14, 2, NULL, 'Augmentin 1g', 'Comprimé', NULL, NULL, 143, 0, 20, NULL, NULL, '2026-07-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:13:01'),
(15, 2, NULL, 'Gaviscon', 'Sirop', NULL, NULL, 143, 0, 20, NULL, NULL, '2027-06-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:13:01'),
(16, 2, NULL, 'Vogalène', 'Suppositoire', NULL, NULL, 100, 0, 20, NULL, NULL, '2027-05-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:13:01'),
(17, 2, NULL, 'Clamoxyl', 'Injectable', NULL, NULL, 128, 0, 20, NULL, NULL, '2027-08-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:13:01'),
(18, 2, NULL, 'Imodium 2mg', 'Gélule', NULL, NULL, 74, 0, 20, NULL, NULL, '2027-08-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:13:01'),
(19, 3, NULL, 'Doliprane 1000mg', 'Comprimé', NULL, NULL, 0, 0, 20, NULL, NULL, '2026-03-06', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:16:47'),
(20, 3, NULL, 'Amoxicilline 500mg', 'Gélule', NULL, NULL, 0, 0, 20, NULL, NULL, '2027-07-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:16:47'),
(21, 3, NULL, 'Efferalgan 500mg', 'Sachet', NULL, NULL, 5, 0, 20, NULL, NULL, '2027-05-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:16:47'),
(22, 3, NULL, 'Spasfon', 'Comprimé', NULL, NULL, 5, 0, 20, NULL, NULL, '2027-03-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:16:47'),
(23, 3, NULL, 'Augmentin 1g', 'Comprimé', NULL, NULL, 53, 0, 20, NULL, NULL, '2027-06-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:13:01'),
(24, 3, NULL, 'Gaviscon', 'Sirop', NULL, NULL, 11, 0, 20, NULL, NULL, '2027-01-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:13:01'),
(25, 3, NULL, 'Vogalène', 'Suppositoire', NULL, NULL, 110, 0, 20, NULL, NULL, '2027-05-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:13:01'),
(26, 3, NULL, 'Clamoxyl', 'Injectable', NULL, NULL, 122, 0, 20, NULL, NULL, '2027-02-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:13:01'),
(27, 3, NULL, 'Imodium 2mg', 'Gélule', NULL, NULL, 40, 0, 20, NULL, NULL, '2027-08-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:13:01'),
(28, 4, NULL, 'Doliprane 1000mg', 'Comprimé', NULL, NULL, 0, 0, 20, NULL, NULL, '2026-03-06', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:16:47'),
(29, 4, NULL, 'Amoxicilline 500mg', 'Gélule', NULL, NULL, 0, 0, 20, NULL, NULL, '2026-04-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:16:47'),
(30, 4, NULL, 'Efferalgan 500mg', 'Sachet', NULL, NULL, 5, 0, 20, NULL, NULL, '2026-11-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:16:47'),
(31, 4, NULL, 'Spasfon', 'Comprimé', NULL, NULL, 5, 0, 20, NULL, NULL, '2027-05-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:16:47'),
(32, 4, NULL, 'Augmentin 1g', 'Comprimé', NULL, NULL, 104, 0, 20, NULL, NULL, '2026-05-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:13:01'),
(33, 4, NULL, 'Gaviscon', 'Sirop', NULL, NULL, 112, 0, 20, NULL, NULL, '2027-04-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:13:01'),
(34, 4, NULL, 'Vogalène', 'Suppositoire', NULL, NULL, 11, 0, 20, NULL, NULL, '2027-03-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:13:01'),
(35, 4, NULL, 'Clamoxyl', 'Injectable', NULL, NULL, 147, 0, 20, NULL, NULL, '2027-02-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:13:01'),
(36, 4, NULL, 'Imodium 2mg', 'Gélule', NULL, NULL, 119, 0, 20, NULL, NULL, '2027-04-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:13:01'),
(37, 5, NULL, 'Doliprane 1000mg', 'Comprimé', NULL, NULL, 0, 0, 20, NULL, NULL, '2026-03-06', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:16:47'),
(38, 5, NULL, 'Amoxicilline 500mg', 'Gélule', NULL, NULL, 0, 0, 20, NULL, NULL, '2027-02-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:16:47'),
(39, 5, NULL, 'Efferalgan 500mg', 'Sachet', NULL, NULL, 5, 0, 20, NULL, NULL, '2027-07-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:16:47'),
(40, 5, NULL, 'Spasfon', 'Comprimé', NULL, NULL, 5, 0, 20, NULL, NULL, '2027-05-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:16:47'),
(41, 5, NULL, 'Augmentin 1g', 'Comprimé', NULL, NULL, 62, 0, 20, NULL, NULL, '2026-08-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:13:01'),
(42, 5, NULL, 'Gaviscon', 'Sirop', NULL, NULL, 33, 0, 20, NULL, NULL, '2026-07-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:13:01'),
(43, 5, NULL, 'Vogalène', 'Suppositoire', NULL, NULL, 69, 0, 20, NULL, NULL, '2026-12-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:13:01'),
(44, 5, NULL, 'Clamoxyl', 'Injectable', NULL, NULL, 97, 0, 20, NULL, NULL, '2026-09-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:13:01'),
(45, 5, NULL, 'Imodium 2mg', 'Gélule', NULL, NULL, 114, 0, 20, NULL, NULL, '2026-05-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:01', '2026-02-19 10:13:01'),
(46, 6, NULL, 'Doliprane 1000mg', 'Comprimé', NULL, NULL, 30, 0, 20, NULL, NULL, '2026-04-02', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:02', '2026-03-11 21:23:24'),
(47, 6, NULL, 'Amoxicilline 500mg', 'Gélule', NULL, NULL, 0, 0, 20, NULL, NULL, '2027-02-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:02', '2026-02-19 10:16:47'),
(48, 6, NULL, 'Efferalgan 500mg', 'Sachet', NULL, NULL, 5, 0, 20, NULL, NULL, '2026-11-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:02', '2026-02-19 10:16:47'),
(49, 6, NULL, 'Spasfon', 'Comprimé', NULL, NULL, 5, 0, 20, NULL, NULL, '2026-07-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:02', '2026-02-19 10:16:47'),
(50, 6, NULL, 'Augmentin 1g', 'Comprimé', NULL, NULL, 99, 0, 20, NULL, NULL, '2027-04-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:02', '2026-02-19 10:13:02'),
(51, 6, NULL, 'Gaviscon', 'Sirop', NULL, NULL, 114, 0, 20, NULL, NULL, '2026-09-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:02', '2026-02-19 10:13:02'),
(52, 6, NULL, 'Vogalène', 'Suppositoire', NULL, NULL, 69, 0, 20, NULL, NULL, '2027-05-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:02', '2026-02-19 10:13:02'),
(53, 6, NULL, 'Clamoxyl', 'Injectable', NULL, NULL, 105, 0, 20, NULL, NULL, '2026-06-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:02', '2026-02-19 10:13:02'),
(54, 6, NULL, 'Imodium 2mg', 'Gélule', NULL, NULL, 111, 0, 20, NULL, NULL, '2026-09-19', NULL, NULL, 'en_stock', NULL, '2026-02-19 10:13:02', '2026-02-19 10:13:02'),
(55, 1, NULL, 'Aspirine', 'Comprimé', NULL, NULL, 39, 0, 39, NULL, NULL, '2026-03-26', NULL, NULL, 'stock_faible', NULL, '2026-03-11 15:53:29', '2026-03-11 15:53:29'),
(56, 1, NULL, 'paracetamol', 'Comprimé', NULL, NULL, 38, 0, 23, NULL, NULL, '2026-04-02', NULL, NULL, 'en_stock', 'https://www.mon-pharmacien-conseil.com/19987-large_default/paracetamol-1000-mg-pain-and-fever-mylan-viatris-8-scored-tablets.jpg', '2026-03-11 15:58:05', '2026-03-11 16:20:45'),
(60, 1, NULL, 'finifat 500mg', 'Comprimé', NULL, NULL, 20, 0, 19, NULL, NULL, '2027-03-01', NULL, NULL, 'en_stock', NULL, '2026-03-11 16:31:13', '2026-03-11 16:31:13'),
(61, 1, NULL, 'Doliprane 1000mg', 'Comprimé', NULL, NULL, 24, 0, 24, NULL, NULL, '2026-03-25', NULL, NULL, 'stock_faible', NULL, '2026-03-11 16:33:32', '2026-03-11 16:33:32');

-- --------------------------------------------------------

--
-- Structure de la table `rapports`
--

CREATE TABLE `rapports` (
  `id` int(11) NOT NULL,
  `pharmacie_id` int(11) NOT NULL,
  `type_rapport` enum('inventaire','ventes','echanges','expirations','global') DEFAULT 'global',
  `titre` varchar(255) NOT NULL,
  `contenu` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`contenu`)),
  `periode_debut` date DEFAULT NULL,
  `periode_fin` date DEFAULT NULL,
  `date_creation` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `pharmacie_id` int(11) DEFAULT NULL,
  `nom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `role` enum('admin','pharmacien','auxilliaire','super_admin') DEFAULT 'pharmacien',
  `photo_url` varchar(500) DEFAULT NULL,
  `actif` tinyint(1) DEFAULT 1,
  `derniere_connexion` datetime DEFAULT NULL,
  `date_creation` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `pharmacie_id`, `nom`, `email`, `mot_de_passe`, `role`, `photo_url`, `actif`, `derniere_connexion`, `date_creation`) VALUES
(1, 1, 'Dr. Kouassi', 'pharmaciedelapaix@pharmshare.ci', '$2y$12$cLVkyMbsGQTDBrpuV/fGhuXpJypfV3a/iFlIzRx4S0dbmMqmeLBfK', 'admin', 'http://localhost/Pharmshare/api/uploads/avatars/avatar_1_69a02e6503381.png', 1, '2026-04-04 07:22:44', '2026-02-19 09:36:56'),
(2, 1, 'marie konan', 'aux.pharmaciedelapaix@pharmshare.ci', '$2y$12$cLVkyMbsGQTDBrpuV/fGhuXpJypfV3a/iFlIzRx4S0dbmMqmeLBfK', 'auxilliaire', NULL, 1, '2026-03-25 10:01:49', '2026-02-19 09:36:56'),
(3, 2, 'Dr. Bakayoko', 'pharmaciedumarché@pharmshare.ci', '$2y$12$cLVkyMbsGQTDBrpuV/fGhuXpJypfV3a/iFlIzRx4S0dbmMqmeLBfK', 'admin', NULL, 1, '2026-03-25 11:40:30', '2026-02-19 09:36:57'),
(4, 2, 'Auxilliaire Marché', 'aux.pharmaciedumarché@pharmshare.ci', '$2y$12$cLVkyMbsGQTDBrpuV/fGhuXpJypfV3a/iFlIzRx4S0dbmMqmeLBfK', 'auxilliaire', NULL, 1, '2026-02-18 12:36:57', '2026-02-19 09:36:57'),
(5, 3, 'Dr. Yao', 'pharmaciest.pierre@pharmshare.ci', '$2y$12$cLVkyMbsGQTDBrpuV/fGhuXpJypfV3a/iFlIzRx4S0dbmMqmeLBfK', 'admin', NULL, 1, '2026-03-25 08:18:27', '2026-02-19 09:36:58'),
(6, 3, 'Auxilliaire Pierre', 'aux.pharmaciest.pierre@pharmshare.ci', '$2y$12$cLVkyMbsGQTDBrpuV/fGhuXpJypfV3a/iFlIzRx4S0dbmMqmeLBfK', 'auxilliaire', NULL, 1, '2026-02-19 06:36:58', '2026-02-19 09:36:58'),
(7, 4, 'Dr. Traoré', 'pharmaciedeslagunes@pharmshare.ci', '$2y$12$cLVkyMbsGQTDBrpuV/fGhuXpJypfV3a/iFlIzRx4S0dbmMqmeLBfK', 'admin', NULL, 1, '2026-02-19 09:36:58', '2026-02-19 09:36:59'),
(8, 4, 'Auxilliaire Lagunes', 'aux.pharmaciedeslagunes@pharmshare.ci', '$2y$12$cLVkyMbsGQTDBrpuV/fGhuXpJypfV3a/iFlIzRx4S0dbmMqmeLBfK', 'auxilliaire', NULL, 1, '2026-02-17 11:36:59', '2026-02-19 09:37:00'),
(9, 5, 'Dr. Diallo', 'pharmaciedel\'avenir@pharmshare.ci', '$2y$12$cLVkyMbsGQTDBrpuV/fGhuXpJypfV3a/iFlIzRx4S0dbmMqmeLBfK', 'admin', NULL, 1, '2026-02-19 10:37:00', '2026-02-19 09:37:00'),
(10, 5, 'Auxilliaire l\'Avenir', 'aux.pharmaciedel\'avenir@pharmshare.ci', '$2y$12$cLVkyMbsGQTDBrpuV/fGhuXpJypfV3a/iFlIzRx4S0dbmMqmeLBfK', 'auxilliaire', NULL, 1, '2026-02-19 02:37:00', '2026-02-19 09:37:01'),
(11, 6, 'Dr. petey', 'centrale@pharmshare.ci', '$2y$12$cLVkyMbsGQTDBrpuV/fGhuXpJypfV3a/iFlIzRx4S0dbmMqmeLBfK', 'admin', NULL, 1, '2026-03-25 11:58:57', '2026-02-19 10:07:41'),
(13, NULL, 'Super Administrateur', 'admin@pharmshare.ci', '$2y$12$dstvNk5/1M.stpPXeInUUO6vacEkuzf8jV8sJW58ZmD43yT7rR7Aq', 'super_admin', NULL, 1, '2026-04-03 23:07:46', '2026-04-03 22:07:40'),
(14, NULL, 'Dr. Nouvelle Demande', 'nouvelle@pharmshare.ci', 'dummy', 'pharmacien', NULL, 0, NULL, '2026-04-03 23:14:16');

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `vue_alertes_stock`
-- (Voir ci-dessous la vue réelle)
--
CREATE TABLE `vue_alertes_stock` (
`id` int(11)
,`nom` varchar(255)
,`stock_actuel` int(11)
,`stock_minimum` int(11)
,`date_expiration` date
,`pharmacie_nom` varchar(255)
,`alerte_type` varchar(17)
);

-- --------------------------------------------------------

--
-- Doublure de structure pour la vue `vue_dashboard`
-- (Voir ci-dessous la vue réelle)
--
CREATE TABLE `vue_dashboard` (
`pharmacie_id` int(11)
,`total_produits` bigint(21)
,`produits_en_alerte` bigint(21)
,`expirations_proches` bigint(21)
,`notifs_non_lues` bigint(21)
);

-- --------------------------------------------------------

--
-- Structure de la vue `vue_alertes_stock`
--
DROP TABLE IF EXISTS `vue_alertes_stock`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vue_alertes_stock`  AS SELECT `p`.`id` AS `id`, `p`.`nom` AS `nom`, `p`.`stock_actuel` AS `stock_actuel`, `p`.`stock_minimum` AS `stock_minimum`, `p`.`date_expiration` AS `date_expiration`, `ph`.`nom` AS `pharmacie_nom`, CASE WHEN `p`.`stock_actuel` = 0 THEN 'rupture' WHEN `p`.`stock_actuel` <= `p`.`stock_minimum` THEN 'stock_faible' WHEN `p`.`date_expiration` <= curdate() + interval 90 day AND `p`.`stock_actuel` > 0 THEN 'expiration_proche' ELSE 'ok' END AS `alerte_type` FROM (`produits` `p` join `pharmacies` `ph` on(`p`.`pharmacie_id` = `ph`.`id`)) ;

-- --------------------------------------------------------

--
-- Structure de la vue `vue_dashboard`
--
DROP TABLE IF EXISTS `vue_dashboard`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vue_dashboard`  AS SELECT `ph`.`id` AS `pharmacie_id`, (select count(0) from `produits` where `produits`.`pharmacie_id` = `ph`.`id`) AS `total_produits`, (select count(0) from `produits` where `produits`.`pharmacie_id` = `ph`.`id` and (`produits`.`stock_actuel` <= `produits`.`stock_minimum` or `produits`.`stock_actuel` = 0)) AS `produits_en_alerte`, (select count(0) from `produits` where `produits`.`pharmacie_id` = `ph`.`id` and `produits`.`date_expiration` <= curdate() + interval 90 day and `produits`.`stock_actuel` > 0) AS `expirations_proches`, (select count(0) from `notifications` where `notifications`.`pharmacie_id` = `ph`.`id` and `notifications`.`lu` = 0) AS `notifs_non_lues` FROM `pharmacies` AS `ph` ;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `annonces`
--
ALTER TABLE `annonces`
  ADD PRIMARY KEY (`id`),
  ADD KEY `produit_id` (`produit_id`),
  ADD KEY `idx_pharmacie` (`pharmacie_id`),
  ADD KEY `idx_type` (`type_annonce`),
  ADD KEY `idx_statut` (`statut`),
  ADD KEY `idx_date` (`date_creation`);

--
-- Index pour la table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pharmacie_id` (`pharmacie_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Index pour la table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_conversation` (`pharmacie_1_id`,`pharmacie_2_id`),
  ADD KEY `idx_pharmacie1` (`pharmacie_1_id`),
  ADD KEY `idx_pharmacie2` (`pharmacie_2_id`);

--
-- Index pour la table `demandes`
--
ALTER TABLE `demandes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `annonce_id` (`annonce_id`),
  ADD KEY `idx_demandeur` (`demandeur_id`),
  ADD KEY `idx_destinataire` (`destinataire_id`),
  ADD KEY `idx_statut` (`statut`),
  ADD KEY `idx_date` (`date_creation`);

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_conversation` (`conversation_id`),
  ADD KEY `idx_expediteur` (`expediteur_id`),
  ADD KEY `idx_lu` (`lu`),
  ADD KEY `idx_date` (`date_envoi`);

--
-- Index pour la table `mouvements_stock`
--
ALTER TABLE `mouvements_stock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_produit` (`produit_id`),
  ADD KEY `idx_pharmacie` (`pharmacie_id`),
  ADD KEY `idx_type` (`type_mouvement`),
  ADD KEY `idx_date` (`date_mouvement`);

--
-- Index pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pharmacie` (`pharmacie_id`),
  ADD KEY `idx_lu` (`lu`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_date` (`date_creation`);

--
-- Index pour la table `paiements`
--
ALTER TABLE `paiements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `demande_id` (`demande_id`),
  ADD KEY `pharmacie_id` (`pharmacie_id`);

--
-- Index pour la table `parametres`
--
ALTER TABLE `parametres`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `pharmacie_id` (`pharmacie_id`);

--
-- Index pour la table `pharmacies`
--
ALTER TABLE `pharmacies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_ville` (`ville`),
  ADD KEY `idx_actif` (`actif`);

--
-- Index pour la table `produits`
--
ALTER TABLE `produits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categorie_id` (`categorie_id`),
  ADD KEY `idx_pharmacie` (`pharmacie_id`),
  ADD KEY `idx_nom` (`nom`),
  ADD KEY `idx_statut` (`statut`),
  ADD KEY `idx_expiration` (`date_expiration`),
  ADD KEY `idx_stock` (`stock_actuel`);

--
-- Index pour la table `rapports`
--
ALTER TABLE `rapports`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pharmacie` (`pharmacie_id`),
  ADD KEY `idx_type` (`type_rapport`),
  ADD KEY `idx_date` (`date_creation`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `users_ibfk_1` (`pharmacie_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `annonces`
--
ALTER TABLE `annonces`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT pour la table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT pour la table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `demandes`
--
ALTER TABLE `demandes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=319;

--
-- AUTO_INCREMENT pour la table `mouvements_stock`
--
ALTER TABLE `mouvements_stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=594;

--
-- AUTO_INCREMENT pour la table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;

--
-- AUTO_INCREMENT pour la table `paiements`
--
ALTER TABLE `paiements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `parametres`
--
ALTER TABLE `parametres`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `pharmacies`
--
ALTER TABLE `pharmacies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `produits`
--
ALTER TABLE `produits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT pour la table `rapports`
--
ALTER TABLE `rapports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `annonces`
--
ALTER TABLE `annonces`
  ADD CONSTRAINT `annonces_ibfk_1` FOREIGN KEY (`pharmacie_id`) REFERENCES `pharmacies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `annonces_ibfk_2` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`pharmacie_id`) REFERENCES `pharmacies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `audit_logs_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `conversations_ibfk_1` FOREIGN KEY (`pharmacie_1_id`) REFERENCES `pharmacies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `conversations_ibfk_2` FOREIGN KEY (`pharmacie_2_id`) REFERENCES `pharmacies` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `demandes`
--
ALTER TABLE `demandes`
  ADD CONSTRAINT `demandes_ibfk_1` FOREIGN KEY (`annonce_id`) REFERENCES `annonces` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `demandes_ibfk_2` FOREIGN KEY (`demandeur_id`) REFERENCES `pharmacies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `demandes_ibfk_3` FOREIGN KEY (`destinataire_id`) REFERENCES `pharmacies` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`expediteur_id`) REFERENCES `pharmacies` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `mouvements_stock`
--
ALTER TABLE `mouvements_stock`
  ADD CONSTRAINT `mouvements_stock_ibfk_1` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `mouvements_stock_ibfk_2` FOREIGN KEY (`pharmacie_id`) REFERENCES `pharmacies` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`pharmacie_id`) REFERENCES `pharmacies` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `paiements`
--
ALTER TABLE `paiements`
  ADD CONSTRAINT `paiements_ibfk_1` FOREIGN KEY (`demande_id`) REFERENCES `demandes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `paiements_ibfk_2` FOREIGN KEY (`pharmacie_id`) REFERENCES `pharmacies` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `parametres`
--
ALTER TABLE `parametres`
  ADD CONSTRAINT `parametres_ibfk_1` FOREIGN KEY (`pharmacie_id`) REFERENCES `pharmacies` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `produits`
--
ALTER TABLE `produits`
  ADD CONSTRAINT `produits_ibfk_1` FOREIGN KEY (`pharmacie_id`) REFERENCES `pharmacies` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `produits_ibfk_2` FOREIGN KEY (`categorie_id`) REFERENCES `categories_produits` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `rapports`
--
ALTER TABLE `rapports`
  ADD CONSTRAINT `rapports_ibfk_1` FOREIGN KEY (`pharmacie_id`) REFERENCES `pharmacies` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`pharmacie_id`) REFERENCES `pharmacies` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
