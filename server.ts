import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { initialData } from './src/initialData';
import { AdminUser, NewsArticle, Infographic, DataboksItem } from './src/types';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const NEWS_FILE = path.join(DATA_DIR, 'newsStore.json');
const USERS_FILE = path.join(DATA_DIR, 'usersStore.json');

const DEFAULT_USERS: AdminUser[] = [
  { id: 'usr-1', username: 'admin', name: 'Super Admin ASQI', role: 'superadmin' },
  { id: 'usr-2', username: 'editor', name: 'Chief Editor', role: 'editor' },
  { id: 'usr-3', username: 'jurnalis', name: 'Jurnalis Senior', role: 'author' },
];

function getStoreData() {
  try {
    if (fs.existsSync(NEWS_FILE)) {
      const content = fs.readFileSync(NEWS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading news store:', err);
  }
  return initialData;
}

function saveStoreData(data: any) {
  try {
    fs.writeFileSync(NEWS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving news store:', err);
  }
}

function getUsersData(): AdminUser[] {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const content = fs.readFileSync(USERS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading users store:', err);
  }
  return DEFAULT_USERS;
}

function saveUsersData(users: AdminUser[]) {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving users store:', err);
  }
}

// REST API Endpoints

// GET /api/news
app.get('/api/news', (req, res) => {
  const data = getStoreData();
  let articles: NewsArticle[] = data.articles || [];

  const { category, search } = req.query;

  if (category && typeof category === 'string' && category !== 'Telaah') {
    articles = articles.filter(
      (art) => art.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    articles = articles.filter(
      (art) =>
        art.title.toLowerCase().includes(q) ||
        art.snippet.toLowerCase().includes(q) ||
        art.content.toLowerCase().includes(q) ||
        (art.tags && art.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }

  res.json({ success: true, articles, total: articles.length });
});

// GET /api/news/:id
app.get('/api/news/:id', (req, res) => {
  const data = getStoreData();
  const article = (data.articles || []).find((a: NewsArticle) => a.id === req.params.id);
  if (article) {
    article.views = (article.views || 0) + 1;
    saveStoreData(data);
    res.json({ success: true, article });
  } else {
    res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
  }
});

// POST /api/news
app.post('/api/news', (req, res) => {
  const data = getStoreData();
  const { 
    title, 
    category, 
    snippet, 
    content, 
    author, 
    image, 
    imageCaption, 
    middleImage, 
    middleImageCaption, 
    galleryImages, 
    isFeatured, 
    isPopular, 
    tags 
  } = req.body;

  if (!title || !category || !content) {
    return res.status(400).json({ success: false, message: 'Judul, Kategori, dan Isi Berita wajib diisi' });
  }

  const newArticle: NewsArticle = {
    id: 'art-' + Date.now(),
    title,
    category,
    publishedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase() + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    views: 1,
    snippet: snippet || content.substring(0, 150) + '...',
    content,
    author: author || 'Tim Redaksi ASQI',
    image: image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
    imageCaption: imageCaption || '',
    middleImage: middleImage || '',
    middleImageCaption: middleImageCaption || '',
    galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
    isFeatured: !!isFeatured,
    isPopular: !!isPopular,
    tags: Array.isArray(tags) ? tags : [category],
  };

  data.articles = [newArticle, ...(data.articles || [])];
  saveStoreData(data);

  res.json({ success: true, article: newArticle });
});

// PUT /api/news/:id
app.put('/api/news/:id', (req, res) => {
  const data = getStoreData();
  const index = (data.articles || []).findIndex((a: NewsArticle) => a.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
  }

  const { 
    title, 
    category, 
    snippet, 
    content, 
    author, 
    image, 
    imageCaption, 
    middleImage, 
    middleImageCaption, 
    galleryImages, 
    isFeatured, 
    isPopular, 
    tags 
  } = req.body;
  const existing = data.articles[index];

  data.articles[index] = {
    ...existing,
    title: title || existing.title,
    category: category || existing.category,
    snippet: snippet || existing.snippet,
    content: content || existing.content,
    author: author || existing.author,
    image: image || existing.image,
    imageCaption: imageCaption !== undefined ? imageCaption : existing.imageCaption,
    middleImage: middleImage !== undefined ? middleImage : existing.middleImage,
    middleImageCaption: middleImageCaption !== undefined ? middleImageCaption : existing.middleImageCaption,
    galleryImages: galleryImages !== undefined ? galleryImages : existing.galleryImages,
    isFeatured: isFeatured !== undefined ? isFeatured : existing.isFeatured,
    isPopular: isPopular !== undefined ? isPopular : existing.isPopular,
    tags: tags || existing.tags,
  };

  saveStoreData(data);
  res.json({ success: true, article: data.articles[index] });
});

// DELETE /api/news/:id
app.delete('/api/news/:id', (req, res) => {
  const data = getStoreData();
  data.articles = (data.articles || []).filter((a: NewsArticle) => a.id !== req.params.id);
  saveStoreData(data);
  res.json({ success: true, message: 'Berita berhasil dihapus' });
});

// GET /api/carousel
app.get('/api/carousel', (req, res) => {
  const data = getStoreData();
  res.json({ success: true, slides: data.carousel || [] });
});

// GET /api/popular
app.get('/api/popular', (req, res) => {
  const data = getStoreData();
  const popular = (data.articles || []).filter((a: NewsArticle) => a.isPopular);
  res.json({ success: true, popular });
});

// GET /api/infographics
app.get('/api/infographics', (req, res) => {
  const data = getStoreData();
  res.json({ success: true, infographics: data.infographics || [] });
});

// POST /api/infographics
app.post('/api/infographics', (req, res) => {
  const data = getStoreData();
  const { title, imageUrl } = req.body;
  if (!title || !imageUrl) {
    return res.status(400).json({ success: false, message: 'Judul dan URL gambar wajib diisi' });
  }

  const newInfo: Infographic = {
    id: 'info-' + Date.now(),
    title,
    imageUrl,
    createdAt: 'Terbaru',
  };

  data.infographics = [newInfo, ...(data.infographics || [])];
  saveStoreData(data);
  res.json({ success: true, infographic: newInfo });
});

// DELETE /api/infographics/:id
app.delete('/api/infographics/:id', (req, res) => {
  const data = getStoreData();
  data.infographics = (data.infographics || []).filter((i: Infographic) => i.id !== req.params.id);
  saveStoreData(data);
  res.json({ success: true, message: 'Infografik berhasil dihapus' });
});

// GET /api/databoks
app.get('/api/databoks', (req, res) => {
  const data = getStoreData();
  res.json({ success: true, databoks: data.databoks || [] });
});

// POST /api/databoks
app.post('/api/databoks', (req, res) => {
  const data = getStoreData();
  const { title, category, description } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: 'Judul wajib diisi' });
  }

  const newItem: DataboksItem = {
    id: 'data-' + Date.now(),
    title,
    category: category || 'Data Ekonomi',
    description: description || '',
  };

  data.databoks = [newItem, ...(data.databoks || [])];
  saveStoreData(data);
  res.json({ success: true, item: newItem });
});

// DELETE /api/databoks/:id
app.delete('/api/databoks/:id', (req, res) => {
  const data = getStoreData();
  data.databoks = (data.databoks || []).filter((d: DataboksItem) => d.id !== req.params.id);
  saveStoreData(data);
  res.json({ success: true, message: 'Databoks berhasil dihapus' });
});

// GET /api/videos
app.get('/api/videos', (req, res) => {
  const data = getStoreData();
  res.json({ success: true, videos: data.videos || [] });
});

// POST /api/admin/login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const users = getUsersData();

  let matchedUser: AdminUser | undefined;
  if (username === 'admin' && password === 'admin123') {
    matchedUser = DEFAULT_USERS[0];
  } else if (username === 'editor' && password === 'editor123') {
    matchedUser = DEFAULT_USERS[1];
  } else if (username === 'jurnalis' && password === 'jurnalis123') {
    matchedUser = DEFAULT_USERS[2];
  } else {
    matchedUser = users.find((u) => u.username === username);
  }

  if (matchedUser) {
    res.json({ success: true, user: matchedUser });
  } else {
    res.status(401).json({ success: false, message: 'Username atau password salah' });
  }
});

// GET /api/admin/users
app.get('/api/admin/users', (req, res) => {
  const users = getUsersData();
  res.json({ success: true, users });
});

// POST /api/admin/users
app.post('/api/admin/users', (req, res) => {
  const { username, password, name, role } = req.body;
  if (!username || !password || !name) {
    return res.status(400).json({ success: false, message: 'Username, password, dan nama wajib diisi' });
  }

  const users = getUsersData();
  if (users.some((u) => u.username === username)) {
    return res.status(400).json({ success: false, message: `Username '${username}' sudah terdaftar` });
  }

  const newUser: AdminUser = {
    id: 'usr-' + Date.now(),
    username,
    name,
    role: role || 'editor',
  };

  users.push(newUser);
  saveUsersData(users);

  res.json({ success: true, user: newUser });
});

// DELETE /api/admin/users/:id
app.delete('/api/admin/users/:id', (req, res) => {
  let users = getUsersData();
  users = users.filter((u) => u.id !== req.params.id);
  saveUsersData(users);
  res.json({ success: true, message: 'Pengguna berhasil dihapus' });
});

// POST /api/seed
app.post('/api/seed', (req, res) => {
  saveStoreData(initialData);
  saveUsersData(DEFAULT_USERS);
  res.json({ success: true, message: 'Database berhasil di-reset ke data sampel awal' });
});

// Helper to escape SQL string literal
function sqlEscape(val: any): string {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number' || typeof val === 'boolean') return val ? '1' : '0';
  const str = typeof val === 'object' ? JSON.stringify(val) : String(val);
  return "'" + str.replace(/\\/g, '\\\\').replace(/'/g, "''").replace(/\n/g, '\\n').replace(/\r/g, '\\r') + "'";
}

// GET /api/export-sql - Generate phpMyAdmin SQL Dump file
app.get('/api/export-sql', (req, res) => {
  const data = getStoreData();
  const users = getUsersData();

  let sql = `-- ========================================================\n`;
  sql += `-- ASQI NEWS.com Database Dump (phpMyAdmin / MySQL Ready)\n`;
  sql += `-- Export Date: ${new Date().toISOString()}\n`;
  sql += `-- ========================================================\n\n`;

  sql += `SET FOREIGN_KEY_CHECKS = 0;\n`;
  sql += `SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";\n`;
  sql += `START TRANSACTION;\n`;
  sql += `SET time_zone = "+00:00";\n\n`;

  // 1. Table articles
  sql += `-- --------------------------------------------------------\n`;
  sql += `-- Table structure for \`articles\`\n`;
  sql += `-- --------------------------------------------------------\n`;
  sql += `CREATE TABLE IF NOT EXISTS \`articles\` (\n`;
  sql += `  \`id\` varchar(64) NOT NULL,\n`;
  sql += `  \`title\` varchar(500) NOT NULL,\n`;
  sql += `  \`category\` varchar(100) NOT NULL,\n`;
  sql += `  \`publishedAt\` varchar(100) DEFAULT NULL,\n`;
  sql += `  \`views\` int(11) DEFAULT 1,\n`;
  sql += `  \`snippet\` text DEFAULT NULL,\n`;
  sql += `  \`content\` longtext NOT NULL,\n`;
  sql += `  \`author\` varchar(150) DEFAULT 'Redaksi ASQI',\n`;
  sql += `  \`image\` longtext DEFAULT NULL,\n`;
  sql += `  \`imageCaption\` text DEFAULT NULL,\n`;
  sql += `  \`middleImage\` longtext DEFAULT NULL,\n`;
  sql += `  \`middleImageCaption\` text DEFAULT NULL,\n`;
  sql += `  \`galleryImages\` longtext DEFAULT NULL,\n`;
  sql += `  \`isFeatured\` tinyint(1) DEFAULT 0,\n`;
  sql += `  \`isPopular\` tinyint(1) DEFAULT 0,\n`;
  sql += `  \`tags\` text DEFAULT NULL,\n`;
  sql += `  PRIMARY KEY (\`id\`)\n`;
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  if (data.articles && data.articles.length > 0) {
    sql += `-- Dumping data for table \`articles\`\n`;
    data.articles.forEach((art: NewsArticle) => {
      sql += `INSERT INTO \`articles\` (\`id\`, \`title\`, \`category\`, \`publishedAt\`, \`views\`, \`snippet\`, \`content\`, \`author\`, \`image\`, \`imageCaption\`, \`middleImage\`, \`middleImageCaption\`, \`galleryImages\`, \`isFeatured\`, \`isPopular\`, \`tags\`) VALUES (\n`;
      sql += `  ${sqlEscape(art.id)},\n`;
      sql += `  ${sqlEscape(art.title)},\n`;
      sql += `  ${sqlEscape(art.category)},\n`;
      sql += `  ${sqlEscape(art.publishedAt)},\n`;
      sql += `  ${art.views || 1},\n`;
      sql += `  ${sqlEscape(art.snippet)},\n`;
      sql += `  ${sqlEscape(art.content)},\n`;
      sql += `  ${sqlEscape(art.author)},\n`;
      sql += `  ${sqlEscape(art.image)},\n`;
      sql += `  ${sqlEscape(art.imageCaption || '')},\n`;
      sql += `  ${sqlEscape(art.middleImage || '')},\n`;
      sql += `  ${sqlEscape(art.middleImageCaption || '')},\n`;
      sql += `  ${sqlEscape(art.galleryImages || [])},\n`;
      sql += `  ${art.isFeatured ? 1 : 0},\n`;
      sql += `  ${art.isPopular ? 1 : 0},\n`;
      sql += `  ${sqlEscape(art.tags || [])}\n`;
      sql += `) ON DUPLICATE KEY UPDATE \`title\`=VALUES(\`title\`), \`content\`=VALUES(\`content\`), \`image\`=VALUES(\`image\`);\n\n`;
    });
  }

  // 2. Table admin_users
  sql += `-- --------------------------------------------------------\n`;
  sql += `-- Table structure for \`admin_users\`\n`;
  sql += `-- --------------------------------------------------------\n`;
  sql += `CREATE TABLE IF NOT EXISTS \`admin_users\` (\n`;
  sql += `  \`id\` varchar(64) NOT NULL,\n`;
  sql += `  \`username\` varchar(100) NOT NULL,\n`;
  sql += `  \`name\` varchar(150) NOT NULL,\n`;
  sql += `  \`role\` varchar(50) DEFAULT 'editor',\n`;
  sql += `  PRIMARY KEY (\`id\`),\n`;
  sql += `  UNIQUE KEY \`username\` (\`username\`)\n`;
  sql += `) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;\n\n`;

  if (users && users.length > 0) {
    sql += `-- Dumping data for table \`admin_users\`\n`;
    users.forEach((u: AdminUser) => {
      sql += `INSERT INTO \`admin_users\` (\`id\`, \`username\`, \`name\`, \`role\`) VALUES (${sqlEscape(u.id)}, ${sqlEscape(u.username)}, ${sqlEscape(u.name)}, ${sqlEscape(u.role)}) ON DUPLICATE KEY UPDATE \`name\`=VALUES(\`name\`);\n`;
    });
    sql += `\n`;
  }

  sql += `SET FOREIGN_KEY_CHECKS = 1;\n`;
  sql += `COMMIT;\n`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="asquinews_database.sql"');
  res.send(sql);
});

// Vite Middleware for Development & SPA Fallback
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      try {
        const url = req.originalUrl;
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get(['/admin', '/admin/*', '*'], (req, res, next) => {
      if (req.originalUrl.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ASQI NEWS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
