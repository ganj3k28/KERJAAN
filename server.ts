import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { initialData } from './src/initialData';
import { InitialData, NewsArticle, Infographic, DataboksItem, VideoItem, EventItem, AdminUser, AdminRole } from './src/types';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Persistent Data Storage Path
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'newsStore.json');
const USERS_FILE = path.join(DATA_DIR, 'usersStore.json');

const initialUsers: AdminUser[] = [
  { id: 'usr-1', username: 'admin', password: 'admin123', name: 'Super Administrator', role: 'superadmin', createdAt: '2026-01-01' },
  { id: 'usr-2', username: 'editor', password: 'editor123', name: 'Chief Editor', role: 'editor', createdAt: '2026-01-02' },
  { id: 'usr-3', username: 'jurnalis', password: 'jurnalis123', name: 'Jurnalis Senior', role: 'author', createdAt: '2026-01-03' },
];

function loadUsers(): AdminUser[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(USERS_FILE)) {
      const content = fs.readFileSync(USERS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error loading users store:', err);
  }
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(initialUsers, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving initial users:', err);
  }
  return initialUsers;
}

function saveUsers(users: AdminUser[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving users store:', err);
  }
}

let usersStore = loadUsers();

// Ensure Data Store Directory and File Exist
function loadStore(): InitialData {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(fileContent);
    }
  } catch (err) {
    console.error('Error reading store file, resetting to initial data:', err);
  }

  // Write default seed data
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing initial store:', err);
  }
  return initialData;
}

function saveStore(data: InitialData) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store:', err);
  }
}

let store = loadStore();

// --- REST API ENDPOINTS ---

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'ASQI NEWS API Backend',
    timestamp: new Date().toISOString(),
    totalArticles: store.articles.length + store.carousel.length,
  });
});

// GET /api/news - List news with category filter and search
app.get('/api/news', (req: Request, res: Response) => {
  const { category, search, limit, isPopular } = req.query;
  let result = [...store.articles];

  // Category filter
  if (category && typeof category === 'string' && category.toLowerCase() !== 'semua' && category.toLowerCase() !== 'telaah') {
    const catLower = category.toLowerCase().trim();
    result = result.filter(item => item.category.toLowerCase().includes(catLower) || (item.tags && item.tags.some(t => t.toLowerCase().includes(catLower))));
  }

  // Search filter
  if (search && typeof search === 'string' && search.trim() !== '') {
    const sLower = search.toLowerCase().trim();
    result = result.filter(item =>
      item.title.toLowerCase().includes(sLower) ||
      item.snippet.toLowerCase().includes(sLower) ||
      item.content.toLowerCase().includes(sLower) ||
      item.category.toLowerCase().includes(sLower) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(sLower)))
    );
  }

  // Popular filter
  if (isPopular === 'true') {
    result = result.filter(item => item.isPopular);
  }

  // Sorting: latest first
  result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime() || b.views - a.views);

  if (limit && !isNaN(Number(limit))) {
    result = result.slice(0, Number(limit));
  }

  res.json({
    success: true,
    total: result.length,
    articles: result,
  });
});

// GET /api/news/:id - Single Article Detail & increment view count
app.get('/api/news/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  
  // Search in main articles or carousel
  let article = store.articles.find(a => a.id === id) || store.carousel.find(c => c.id === id);
  
  if (!article) {
    return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
  }

  // Increment view count
  article.views = (article.views || 0) + 1;
  saveStore(store);

  // Get related articles (same category or general)
  const related = store.articles
    .filter(a => a.id !== id && (a.category === article?.category || true))
    .slice(0, 3);

  res.json({
    success: true,
    article,
    related,
  });
});

// POST /api/news - Create new article
app.post('/api/news', (req: Request, res: Response) => {
  const { title, category, snippet, content, author, image, isFeatured, isPopular, tags } = req.body;

  if (!title || !category || !content) {
    return res.status(400).json({ success: false, message: 'Judul, kategori, dan isi berita wajib diisi' });
  }

  const now = new Date();
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const formattedDate = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}, ${String(now.getHours()).padStart(2, '0')}.${String(now.getMinutes()).padStart(2, '0')}`;

  const newArticle: NewsArticle = {
    id: `art-${Date.now()}`,
    title,
    category: category.toUpperCase(),
    publishedAt: formattedDate,
    views: 1,
    snippet: snippet || content.substring(0, 150) + '...',
    content,
    author: author || 'Tim Redaksi ASQI NEWS',
    image: image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
    isFeatured: Boolean(isFeatured),
    isPopular: Boolean(isPopular),
    tags: Array.isArray(tags) ? tags : (tags ? String(tags).split(',').map(t => t.trim()) : [category]),
  };

  if (newArticle.isFeatured) {
    store.carousel.unshift(newArticle);
  } else {
    store.articles.unshift(newArticle);
  }

  saveStore(store);

  res.status(201).json({
    success: true,
    message: 'Berita berhasil diterbitkan',
    article: newArticle,
  });
});

// PUT /api/news/:id - Update existing article
app.put('/api/news/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  let index = store.articles.findIndex(a => a.id === id);
  let isCarousel = false;

  if (index === -1) {
    index = store.carousel.findIndex(c => c.id === id);
    isCarousel = true;
  }

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
  }

  const targetList = isCarousel ? store.carousel : store.articles;
  const current = targetList[index];

  const updated: NewsArticle = {
    ...current,
    ...req.body,
    id: current.id, // prevent ID mutation
  };

  targetList[index] = updated;
  saveStore(store);

  res.json({
    success: true,
    message: 'Berita berhasil diperbarui',
    article: updated,
  });
});

// DELETE /api/news/:id - Delete article
app.delete('/api/news/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const initialCount = store.articles.length + store.carousel.length;

  store.articles = store.articles.filter(a => a.id !== id);
  store.carousel = store.carousel.filter(c => c.id !== id);

  const newCount = store.articles.length + store.carousel.length;

  if (initialCount === newCount) {
    return res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
  }

  saveStore(store);

  res.json({
    success: true,
    message: 'Berita berhasil dihapus',
  });
});

// GET /api/carousel - Get headline carousel slides
app.get('/api/carousel', (req: Request, res: Response) => {
  res.json({
    success: true,
    slides: store.carousel,
  });
});

// GET /api/popular - Get popular news (top 5 by views)
app.get('/api/popular', (req: Request, res: Response) => {
  const allArticles = [...store.articles, ...store.carousel];
  const sorted = allArticles.sort((a, b) => b.views - a.views).slice(0, 5);
  res.json({
    success: true,
    popular: sorted,
  });
});

// GET & POST /api/infographics
app.get('/api/infographics', (req: Request, res: Response) => {
  res.json({ success: true, infographics: store.infographics });
});

app.post('/api/infographics', (req: Request, res: Response) => {
  const { title, imageUrl } = req.body;
  if (!title || !imageUrl) {
    return res.status(400).json({ success: false, message: 'Judul dan URL Gambar wajib diisi' });
  }
  const newInfo: Infographic = {
    id: `info-${Date.now()}`,
    title,
    imageUrl,
    createdAt: new Date().toISOString().split('T')[0],
  };
  store.infographics.unshift(newInfo);
  saveStore(store);
  res.status(201).json({ success: true, infographic: newInfo });
});

// GET & POST /api/databoks
app.get('/api/databoks', (req: Request, res: Response) => {
  res.json({ success: true, databoks: store.databoks });
});

app.post('/api/databoks', (req: Request, res: Response) => {
  const { title, category, description } = req.body;
  if (!title) {
    return res.status(400).json({ success: false, message: 'Judul databoks wajib diisi' });
  }
  const newItem: DataboksItem = {
    id: `data-${Date.now()}`,
    title,
    category: category || 'Data',
    description: description || '',
  };
  store.databoks.unshift(newItem);
  saveStore(store);
  res.status(201).json({ success: true, databoks: newItem });
});

// GET /api/videos & GET /api/events
app.get('/api/videos', (req: Request, res: Response) => {
  res.json({ success: true, videos: store.videos });
});

app.get('/api/events', (req: Request, res: Response) => {
  res.json({ success: true, events: store.events });
});

app.post('/api/events/subscribe', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Email tidak valid' });
  }
  res.json({ success: true, message: `Email ${email} berhasil terdaftar untuk langganan Kalender Event ASQI NEWS!` });
});

// POST /api/seed - Reset data to initial default state
app.post('/api/seed', (req: Request, res: Response) => {
  store = JSON.parse(JSON.stringify(initialData));
  saveStore(store);
  res.json({ success: true, message: 'Database berita berhasil di-reset ke data awal' });
});

// --- ADMIN AUTH & MANAGEMENT API ENDPOINTS ---

// POST /api/admin/login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username dan password wajib diisi' });
  }

  const user = usersStore.find(
    (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ success: false, message: 'Username atau password tidak valid' });
  }

  const token = `token-${user.id}-${Date.now()}`;
  const safeUser = { id: user.id, username: user.username, name: user.name, role: user.role };

  res.json({
    success: true,
    message: 'Login berhasil',
    token,
    user: safeUser,
  });
});

// GET /api/admin/users - List admin users
app.get('/api/admin/users', (req: Request, res: Response) => {
  const safeUsers = usersStore.map((u) => ({
    id: u.id,
    username: u.username,
    name: u.name,
    role: u.role,
    createdAt: u.createdAt || '2026-01-01',
  }));
  res.json({ success: true, users: safeUsers });
});

// POST /api/admin/users - Create new admin user
app.post('/api/admin/users', (req: Request, res: Response) => {
  const { username, password, name, role } = req.body;
  if (!username || !password || !name || !role) {
    return res.status(400).json({ success: false, message: 'Semua bidang (username, password, nama, role) wajib diisi' });
  }

  const existing = usersStore.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());
  if (existing) {
    return res.status(400).json({ success: false, message: 'Username sudah terdaftar' });
  }

  const newUser: AdminUser = {
    id: `usr-${Date.now()}`,
    username: username.trim(),
    password,
    name: name.trim(),
    role: role as AdminRole,
    createdAt: new Date().toISOString().split('T')[0],
  };

  usersStore.push(newUser);
  saveUsers(usersStore);

  res.status(201).json({
    success: true,
    message: 'Pengguna admin berhasil ditambahkan',
    user: { id: newUser.id, username: newUser.username, name: newUser.name, role: newUser.role },
  });
});

// DELETE /api/admin/users/:id - Delete admin user
app.delete('/api/admin/users/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const targetUser = usersStore.find((u) => u.id === id);

  if (!targetUser) {
    return res.status(404).json({ success: false, message: 'Pengguna tidak ditemukan' });
  }

  if (targetUser.username === 'admin') {
    return res.status(400).json({ success: false, message: 'Akun utama Super Admin bawaan tidak dapat dihapus' });
  }

  usersStore = usersStore.filter((u) => u.id !== id);
  saveUsers(usersStore);

  res.json({ success: true, message: 'Pengguna admin berhasil dihapus' });
});

// --- VITE MIDDLEWARE SETUP ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server ASQI NEWS.com running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
