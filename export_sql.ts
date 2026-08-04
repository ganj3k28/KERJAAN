import fs from 'fs';
import path from 'path';

function escapeSql(str: any) {
  if (str === null || str === undefined) return 'NULL';
  if (typeof str === 'boolean') return str ? '1' : '0';
  if (typeof str === 'number') return str;
  if (typeof str === 'object') str = JSON.stringify(str);
  return "'" + String(str).replace(/\\/g, '\\\\').replace(/'/g, "''").replace(/\r/g, '\\r').replace(/\n/g, '\\n') + "'";
}

const newsStorePath = path.join(process.cwd(), 'data', 'newsStore.json');
const store = JSON.parse(fs.readFileSync(newsStorePath, 'utf8'));

let sql = `-- ============================================================
-- DATABASE SCHEMA & FULL DATA EXPORT FOR ASQI NEWS (phpMyAdmin / MySQL)
-- Exported on: ${new Date().toISOString()}
-- Total Articles Included: ${store.articles ? store.articles.length : 0}
-- ============================================================
-- PETUNJUK IMPORT KE phpMyAdmin:
-- 1. Buka cPanel / Hosting Anda -> phpMyAdmin
-- 2. Buat database baru (misal: asqinews_db)
-- 3. Klik nama database -> pilih tab "Import" (Impor)
-- 4. Pilih file SQL ini (asqinews_database.sql) lalu klik "Go" / "Kirim"
-- ============================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------
-- Table structure for \`articles\` (Berita & Artikel)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS \`articles\` (
  \`id\` VARCHAR(100) NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`category\` VARCHAR(100) NOT NULL DEFAULT 'Berita Terbaru',
  \`publishedAt\` VARCHAR(100) DEFAULT NULL,
  \`views\` INT(11) DEFAULT 0,
  \`snippet\` TEXT DEFAULT NULL,
  \`content\` LONGTEXT NOT NULL,
  \`author\` VARCHAR(100) DEFAULT 'Redaksi ASQI',
  \`image\` TEXT DEFAULT NULL,
  \`imageCaption\` TEXT DEFAULT NULL,
  \`middleImage\` TEXT DEFAULT NULL,
  \`middleImageCaption\` TEXT DEFAULT NULL,
  \`isFeatured\` TINYINT(1) DEFAULT 0,
  \`isPopular\` TINYINT(1) DEFAULT 0,
  \`tags\` TEXT DEFAULT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for \`infographics\` (Infografis)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS \`infographics\` (
  \`id\` VARCHAR(100) NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`category\` VARCHAR(100) DEFAULT 'Infografis',
  \`publishedAt\` VARCHAR(100) DEFAULT NULL,
  \`image\` TEXT NOT NULL,
  \`imageCaption\` TEXT DEFAULT NULL,
  \`downloadUrl\` TEXT DEFAULT NULL,
  \`views\` INT(11) DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for \`databoks\` (Data & Grafik)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS \`databoks\` (
  \`id\` VARCHAR(100) NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`category\` VARCHAR(100) DEFAULT 'Data',
  \`publishedAt\` VARCHAR(100) DEFAULT NULL,
  \`chartType\` VARCHAR(50) DEFAULT 'bar',
  \`chartData\` LONGTEXT DEFAULT NULL,
  \`source\` VARCHAR(255) DEFAULT 'Riset ASQI',
  \`description\` TEXT DEFAULT NULL,
  \`views\` INT(11) DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for \`categories\` (Kategori Menu)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS \`categories\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`categories_json\` LONGTEXT NOT NULL,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for \`header_settings\` (Setelan Header)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS \`header_settings\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`logoUrl\` TEXT DEFAULT NULL,
  \`siteTitle\` VARCHAR(255) DEFAULT 'ASQI NEWS',
  \`tagLine\` VARCHAR(255) DEFAULT 'Portal Berita Layanan & Ekonomi Indonesia',
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for \`global_ads\` (Setelan Iklan Banner)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS \`global_ads\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`ads_json\` LONGTEXT DEFAULT NULL,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for \`about_asqi\` (Setelan Tentang ASQI)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS \`about_asqi\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`logoUrl\` TEXT DEFAULT NULL,
  \`targetUrl\` VARCHAR(255) DEFAULT 'https://asqi.or.id/',
  \`title\` VARCHAR(255) DEFAULT 'TENTANG ASQI',
  \`companyName\` VARCHAR(255) DEFAULT 'Asosiasi Service Quality Indonesia (ASQI)',
  \`description\` TEXT DEFAULT NULL,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for \`maintenance\` (Status Pemeliharaan)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS \`maintenance\` (
  \`id\` INT(11) NOT NULL AUTO_INCREMENT,
  \`enabled\` TINYINT(1) DEFAULT 0,
  \`message\` TEXT DEFAULT NULL,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for \`admin_users\` (User Admin)
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS \`admin_users\` (
  \`id\` VARCHAR(100) NOT NULL,
  \`username\` VARCHAR(100) NOT NULL,
  \`password\` VARCHAR(255) DEFAULT 'asqinews2026',
  \`name\` VARCHAR(100) NOT NULL,
  \`role\` VARCHAR(50) DEFAULT 'admin',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`username\` (\`username\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DUMP DATA UTAMA
-- ============================================================

INSERT INTO \`categories\` (\`id\`, \`categories_json\`) VALUES (1, '["Berita Terbaru","Nasional","Syariah","Otomotif","Digital","Pelayanan Publik","BUMN","Internasional"]') ON DUPLICATE KEY UPDATE \`categories_json\` = VALUES(\`categories_json\`);

INSERT INTO \`header_settings\` (\`id\`, \`logoUrl\`, \`siteTitle\`, \`tagLine\`) VALUES (1, '/asqi-logo.svg', 'ASQI NEWS', 'Portal Berita Layanan & Ekonomi Indonesia') ON DUPLICATE KEY UPDATE \`siteTitle\` = VALUES(\`siteTitle\`);

INSERT INTO \`about_asqi\` (\`id\`, \`logoUrl\`, \`targetUrl\`, \`title\`, \`companyName\`, \`description\`) VALUES (1, '/asqi-logo-about.svg', 'https://asqi.or.id/', 'TENTANG ASQI', 'Asosiasi Service Quality Indonesia (ASQI)', 'Asosiasi Service Quality Indonesia (ASQI) adalah wadah profesional terdepan yang berdedikasi meningkatkan standar kualitas pelayanan dan kepuasan pelanggan di berbagai sektor industri di Indonesia.') ON DUPLICATE KEY UPDATE \`title\` = VALUES(\`title\`);

INSERT INTO \`maintenance\` (\`id\`, \`enabled\`, \`message\`) VALUES (1, 0, 'Website ASQI NEWS sedang dalam pemeliharaan sistem rutin.') ON DUPLICATE KEY UPDATE \`enabled\` = VALUES(\`enabled\`);

INSERT INTO \`admin_users\` (\`id\`, \`username\`, \`password\`, \`name\`, \`role\`) VALUES ('usr-1', 'admin', 'asqinews2026', 'Super Admin ASQI', 'superadmin') ON DUPLICATE KEY UPDATE \`name\` = VALUES(\`name\`);

`;

// Insert Articles
sql += `-- INSERT ${store.articles ? store.articles.length : 0} ARTIKEL BERITA\n`;
if (store.articles && store.articles.length > 0) {
  store.articles.forEach((art: any) => {
    sql += `INSERT INTO \`articles\` (\`id\`, \`title\`, \`category\`, \`publishedAt\`, \`views\`, \`snippet\`, \`content\`, \`author\`, \`image\`, \`imageCaption\`, \`middleImage\`, \`middleImageCaption\`, \`isFeatured\`, \`isPopular\`, \`tags\`) VALUES (${escapeSql(art.id)}, ${escapeSql(art.title)}, ${escapeSql(art.category || 'Berita Terbaru')}, ${escapeSql(art.publishedAt)}, ${art.views || 0}, ${escapeSql(art.snippet)}, ${escapeSql(art.content)}, ${escapeSql(art.author || 'Redaksi ASQI')}, ${escapeSql(art.image)}, ${escapeSql(art.imageCaption || '')}, ${escapeSql(art.middleImage || '')}, ${escapeSql(art.middleImageCaption || '')}, ${art.isFeatured ? 1 : 0}, ${art.isPopular ? 1 : 0}, ${escapeSql(JSON.stringify(art.tags || []))}) ON DUPLICATE KEY UPDATE \`title\`=VALUES(\`title\`), \`content\`=VALUES(\`content\`), \`image\`=VALUES(\`image\`);\n`;
  });
}

sql += `\n-- INSERT INFOGRAFIS\n`;
if (store.infographics && store.infographics.length > 0) {
  store.infographics.forEach((info: any) => {
    sql += `INSERT INTO \`infographics\` (\`id\`, \`title\`, \`category\`, \`publishedAt\`, \`image\`, \`imageCaption\`, \`downloadUrl\`, \`views\`) VALUES (${escapeSql(info.id)}, ${escapeSql(info.title)}, ${escapeSql(info.category || 'Infografis')}, ${escapeSql(info.publishedAt || info.createdAt)}, ${escapeSql(info.image || info.imageUrl)}, ${escapeSql(info.imageCaption || '')}, ${escapeSql(info.downloadUrl || '')}, ${info.views || 0}) ON DUPLICATE KEY UPDATE \`title\`=VALUES(\`title\`), \`image\`=VALUES(\`image\`);\n`;
  });
}

sql += `\n-- INSERT DATABOKS\n`;
if (store.databoks && store.databoks.length > 0) {
  store.databoks.forEach((dbk: any) => {
    sql += `INSERT INTO \`databoks\` (\`id\`, \`title\`, \`category\`, \`publishedAt\`, \`chartType\`, \`chartData\`, \`source\`, \`description\`, \`views\`) VALUES (${escapeSql(dbk.id)}, ${escapeSql(dbk.title)}, ${escapeSql(dbk.category || 'Data')}, ${escapeSql(dbk.publishedAt)}, ${escapeSql(dbk.chartType || 'bar')}, ${escapeSql(dbk.chartData ? JSON.stringify(dbk.chartData) : '')}, ${escapeSql(dbk.source || 'Riset ASQI')}, ${escapeSql(dbk.description || '')}, ${dbk.views || 0}) ON DUPLICATE KEY UPDATE \`title\`=VALUES(\`title\`), \`description\`=VALUES(\`description\`);\n`;
  });
}

sql += `\nCOMMIT;\n\n/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;\n/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;\n/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;\n`;

fs.writeFileSync(path.join(process.cwd(), 'public', 'asqinews_database.sql'), sql, 'utf8');
fs.writeFileSync(path.join(process.cwd(), 'asqinews_database.sql'), sql, 'utf8');
console.log('Successfully generated SQL export with', store.articles.length, 'articles. Total size:', sql.length, 'bytes');
