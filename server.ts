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
app.use(express.json());

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
  const { title, category, snippet, content, author, image, isFeatured, isPopular, tags } = req.body;

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

  const { title, category, snippet, content, author, image, isFeatured, isPopular, tags } = req.body;
  const existing = data.articles[index];

  data.articles[index] = {
    ...existing,
    title: title || existing.title,
    category: category || existing.category,
    snippet: snippet || existing.snippet,
    content: content || existing.content,
    author: author || existing.author,
    image: image || existing.image,
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

// Vite Middleware for Development
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
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ASQI NEWS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
