import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool: mysql.Pool | null = null;
let isConnected = false;

export function getMysqlPool(): mysql.Pool | null {
  if (pool) return pool;

  const host = process.env.MYSQL_HOST || process.env.DB_HOST;
  const user = process.env.MYSQL_USER || process.env.DB_USER;
  const password = process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD;
  const database = process.env.MYSQL_DATABASE || process.env.DB_NAME;
  const port = parseInt(process.env.MYSQL_PORT || process.env.DB_PORT || '3306', 10);
  const dbUrl = process.env.DATABASE_URL;

  if (!host && !dbUrl && !user && !database) {
    console.log('ℹ️  MySQL/phpMyAdmin environment variables not configured. Falling back to local JSON/Firestore storage.');
    return null;
  }

  try {
    if (dbUrl) {
      pool = mysql.createPool(dbUrl);
    } else {
      pool = mysql.createPool({
        host: host || 'localhost',
        port: port || 3306,
        user: user || 'root',
        password: password || '',
        database: database || 'asqi_news',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      });
    }
    return pool;
  } catch (err: any) {
    console.warn('⚠️ Failed to create MySQL connection pool:', err?.message || err);
    return null;
  }
}

export async function testAndInitMysql(): Promise<boolean> {
  const p = getMysqlPool();
  if (!p) return false;

  try {
    const connection = await p.getConnection();
    console.log('✅ Connected to MySQL / phpMyAdmin database successfully!');
    connection.release();

    // Auto-initialize tables if they do not exist
    await p.query(`
      CREATE TABLE IF NOT EXISTS \`articles\` (
        \`id\` VARCHAR(255) NOT NULL,
        \`title\` TEXT NOT NULL,
        \`slug\` VARCHAR(255) DEFAULT NULL,
        \`summary\` TEXT DEFAULT NULL,
        \`content\` LONGTEXT DEFAULT NULL,
        \`category\` VARCHAR(100) DEFAULT 'Berita Terbaru',
        \`imageUrl\` TEXT DEFAULT NULL,
        \`caption\` TEXT DEFAULT NULL,
        \`date\` VARCHAR(100) DEFAULT NULL,
        \`readTime\` VARCHAR(50) DEFAULT '3 menit',
        \`author\` VARCHAR(100) DEFAULT 'Redaksi ASQI',
        \`tags\` JSON DEFAULT NULL,
        \`isFeatured\` TINYINT(1) DEFAULT 0,
        \`isPopular\` TINYINT(1) DEFAULT 0,
        \`isHeadlines\` TINYINT(1) DEFAULT 0,
        \`views\` INT DEFAULT 0,
        \`ads\` JSON DEFAULT NULL,
        \`createdAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS \`categories\` (
        \`id\` INT AUTO_INCREMENT NOT NULL,
        \`name\` VARCHAR(100) NOT NULL,
        \`createdAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uniq_category_name\` (\`name\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS \`infographics\` (
        \`id\` VARCHAR(255) NOT NULL,
        \`title\` TEXT NOT NULL,
        \`imageUrl\` TEXT DEFAULT NULL,
        \`downloadUrl\` TEXT DEFAULT NULL,
        \`date\` VARCHAR(100) DEFAULT NULL,
        \`category\` VARCHAR(100) DEFAULT 'Infografik',
        \`views\` INT DEFAULT 0,
        \`createdAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS \`databoks\` (
        \`id\` VARCHAR(255) NOT NULL,
        \`title\` TEXT NOT NULL,
        \`category\` VARCHAR(100) DEFAULT 'Databoks',
        \`date\` VARCHAR(100) DEFAULT NULL,
        \`views\` INT DEFAULT 0,
        \`chartType\` VARCHAR(50) DEFAULT 'bar',
        \`data\` JSON DEFAULT NULL,
        \`createdAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` VARCHAR(255) NOT NULL,
        \`username\` VARCHAR(100) NOT NULL,
        \`name\` VARCHAR(100) NOT NULL,
        \`role\` VARCHAR(50) NOT NULL DEFAULT 'author',
        \`password\` VARCHAR(255) DEFAULT NULL,
        \`createdAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uniq_username\` (\`username\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS \`settings\` (
        \`key_name\` VARCHAR(100) NOT NULL,
        \`data\` JSON NOT NULL,
        \`updatedAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`key_name\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await p.query(`
      CREATE TABLE IF NOT EXISTS \`subscribers\` (
        \`id\` VARCHAR(255) NOT NULL,
        \`email\` VARCHAR(255) NOT NULL,
        \`createdAt\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uniq_email\` (\`email\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    isConnected = true;
    return true;
  } catch (err: any) {
    console.warn('⚠️ MySQL connection check failed:', err?.message || err);
    isConnected = false;
    return false;
  }
}

export function isMysqlConnected(): boolean {
  return isConnected;
}
