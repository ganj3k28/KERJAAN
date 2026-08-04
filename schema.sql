-- ASQI NEWS MySQL / phpMyAdmin Database Schema
-- Import file ini di phpMyAdmin pada Web Hosting / cPanel Anda

CREATE DATABASE IF NOT EXISTS `u613393677_asqi` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `u613393677_asqi`;

-- Table: articles
CREATE TABLE IF NOT EXISTS `articles` (
  `id` VARCHAR(255) NOT NULL,
  `title` TEXT NOT NULL,
  `slug` VARCHAR(255) DEFAULT NULL,
  `summary` TEXT DEFAULT NULL,
  `content` LONGTEXT DEFAULT NULL,
  `category` VARCHAR(100) DEFAULT 'Berita Terbaru',
  `imageUrl` TEXT DEFAULT NULL,
  `caption` TEXT DEFAULT NULL,
  `date` VARCHAR(100) DEFAULT NULL,
  `readTime` VARCHAR(50) DEFAULT '3 menit',
  `author` VARCHAR(100) DEFAULT 'Redaksi ASQI',
  `tags` JSON DEFAULT NULL,
  `isFeatured` TINYINT(1) DEFAULT 0,
  `isPopular` TINYINT(1) DEFAULT 0,
  `isHeadlines` TINYINT(1) DEFAULT 0,
  `views` INT DEFAULT 0,
  `ads` JSON DEFAULT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_category_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: infographics
CREATE TABLE IF NOT EXISTS `infographics` (
  `id` VARCHAR(255) NOT NULL,
  `title` TEXT NOT NULL,
  `imageUrl` TEXT DEFAULT NULL,
  `downloadUrl` TEXT DEFAULT NULL,
  `date` VARCHAR(100) DEFAULT NULL,
  `category` VARCHAR(100) DEFAULT 'Infografik',
  `views` INT DEFAULT 0,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: databoks
CREATE TABLE IF NOT EXISTS `databoks` (
  `id` VARCHAR(255) NOT NULL,
  `title` TEXT NOT NULL,
  `category` VARCHAR(100) DEFAULT 'Databoks',
  `date` VARCHAR(100) DEFAULT NULL,
  `views` INT DEFAULT 0,
  `chartType` VARCHAR(50) DEFAULT 'bar',
  `data` JSON DEFAULT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: users
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(255) NOT NULL,
  `username` VARCHAR(100) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'author',
  `password` VARCHAR(255) DEFAULT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: settings (Maintenance, Ads, Header, About ASQI)
CREATE TABLE IF NOT EXISTS `settings` (
  `key_name` VARCHAR(100) NOT NULL,
  `data` JSON NOT NULL,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`key_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table: subscribers
CREATE TABLE IF NOT EXISTS `subscribers` (
  `id` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Initial Default Categories
INSERT IGNORE INTO `categories` (`name`) VALUES
('Beranda'),
('Berita Terbaru'),
('Nasional'),
('Daerah'),
('Pelayanan Publik'),
('PROFIL TOKOH PELAYANAN'),
('BUMN'),
('BUMD'),
('KORPORASI'),
('Bisnis'),
('ASQI');

-- Initial Default Admin Users
INSERT IGNORE INTO `users` (`id`, `username`, `name`, `role`) VALUES
('usr-1', 'admin', 'Super Admin ASQI', 'superadmin'),
('usr-2', 'editor', 'Chief Editor', 'editor'),
('usr-3', 'jurnalis', 'Jurnalis Senior', 'author');
