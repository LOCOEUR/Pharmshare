-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mer. 11 mars 2026 à 20:52
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
(2, 'Pharmacie du Marché', 'pharmaciedumarché@pharmshare.ci', '$2y$12$cLVkyMbsGQTDBrpuV/fGhuXpJypfV3a/iFlIzRx4S0dbmMqmeLBfK', '0102030405', 'Boulevard Cocody', 'Abidjan', 'Cocody', NULL, 'Dr. Bakayoko', NULL, 1, '2026-02-19 09:36:53', '2026-02-19 10:10:18'),
(3, 'Pharmacie St. Pierre', 'pharmaciest.pierre@pharmshare.ci', '$2y$12$cLVkyMbsGQTDBrpuV/fGhuXpJypfV3a/iFlIzRx4S0dbmMqmeLBfK', '0102030405', 'Boulevard Marcory', 'Abidjan', 'Marcory', NULL, 'Dr. Yao', NULL, 1, '2026-02-19 09:36:54', '2026-02-19 10:10:18'),
(4, 'Pharmacie des Lagunes', 'pharmaciedeslagunes@pharmshare.ci', '$2y$12$cLVkyMbsGQTDBrpuV/fGhuXpJypfV3a/iFlIzRx4S0dbmMqmeLBfK', '0102030405', 'Boulevard Riviera', 'Abidjan', 'Riviera', NULL, 'Dr. Traoré', NULL, 1, '2026-02-19 09:36:54', '2026-02-19 10:10:18'),
(5, 'Pharmacie de l\'Avenir', 'pharmaciedel\'avenir@pharmshare.ci', '$2y$12$cLVkyMbsGQTDBrpuV/fGhuXpJypfV3a/iFlIzRx4S0dbmMqmeLBfK', '0102030405', 'Boulevard Centre', 'Bouaké', 'Centre', NULL, 'Dr. Diallo', NULL, 1, '2026-02-19 09:36:55', '2026-02-19 10:10:18'),
(6, 'Pharmacie Centrale', 'centrale@pharmshare.ci', '$2y$12$cLVkyMbsGQTDBrpuV/fGhuXpJypfV3a/iFlIzRx4S0dbmMqmeLBfK', '', NULL, 'Abidjan', 'Plateau', NULL, 'Dr. Admin', NULL, 1, '2026-02-19 10:07:40', '2026-03-11 17:29:55');

--
-- Index pour les tables déchargées
--

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
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `pharmacies`
--
ALTER TABLE `pharmacies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
