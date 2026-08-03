import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';
import { initialData } from './src/initialData';
import { AdminUser, NewsArticle, Infographic, DataboksItem } from './src/types';

const app = express();
const PORT = 3000;

// Initialize Firebase Firestore Cloud Database
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Prevent browser caching for all API endpoints so all browsers get instant live news
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

// Ensure local data directory exists
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

// Sync memory store with Firestore Cloud Database
async function syncFromFirestore() {
  try {
    // 1. Articles
    const articlesSnap = await getDocs(collection(db, 'articles'));
    let articles: NewsArticle[] = [];
    if (!articlesSnap.empty) {
      articles = articlesSnap.docs.map((d) => d.data() as NewsArticle);
    } else {
      console.log('Seeding initial articles to Firestore Cloud Database...');
      for (const art of initialData.articles) {
        await setDoc(doc(db, 'articles', art.id), art);
      }
      articles = [...initialData.articles];
    }

    // 2. Infographics
    const infoSnap = await getDocs(collection(db, 'infographics'));
    let infographics: Infographic[] = [];
    if (!infoSnap.empty) {
      infographics = infoSnap.docs.map((d) => d.data() as Infographic);
    } else {
      for (const info of initialData.infographics) {
        await setDoc(doc(db, 'infographics', info.id), info);
      }
      infographics = [...initialData.infographics];
    }

    // 3. Databoks
    const dataSnap = await getDocs(collection(db, 'databoks'));
    let databoks: DataboksItem[] = [];
    if (!dataSnap.empty) {
      databoks = dataSnap.docs.map((d) => d.data() as DataboksItem);
    } else {
      for (const item of initialData.databoks) {
        await setDoc(doc(db, 'databoks', item.id), item);
      }
      databoks = [...initialData.databoks];
    }

    const carousel = articles.filter((a) => a.isFeatured);
    let carouselSlides = carousel.length > 0 ? carousel : articles;
    if (carouselSlides.length < 5) {
      const existingIds = new Set(carouselSlides.map((a) => a.id));
      const extra = articles.filter((a) => !existingIds.has(a.id));
      carouselSlides = [...carouselSlides, ...extra];
    }
    carouselSlides = carouselSlides.slice(0, 5);

    const store = {
      articles,
      carousel: carouselSlides,
      infographics,
      databoks,
      videos: initialData.videos,
    };
    saveStoreData(store);
    return store;
  } catch (err) {
    console.error('Firestore sync error:', err);
    return getStoreData();
  }
}

// Initial sync on startup
syncFromFirestore().catch((err) => console.error('Initial Firestore sync failed:', err));

// REST API Endpoints

// GET /api/news
app.get('/api/news', async (req, res) => {
  let data = getStoreData();
  // If data is empty or missing, sync from Firestore
  if (!data.articles || data.articles.length === 0) {
    data = await syncFromFirestore();
  }

  let articles: NewsArticle[] = data.articles || [];

  const { category, search } = req.query;

  if (category && typeof category === 'string') {
    if (category.toLowerCase() === 'akses khusus') {
      articles = articles.filter((art) => art.isPremium === true);
    } else if (category !== 'Telaah') {
      articles = articles.filter(
        (art) => art.category.toLowerCase() === category.toLowerCase()
      );
    }
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
    setDoc(doc(db, 'articles', article.id), sanitizeForFirestore(article)).catch(() => {});
    res.json({ success: true, article });
  } else {
    res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
  }
});

// POST /api/news/:id/view - Explicit view count increment
app.post('/api/news/:id/view', (req, res) => {
  const data = getStoreData();
  const article = (data.articles || []).find((a: NewsArticle) => a.id === req.params.id);
  if (article) {
    article.views = (article.views || 0) + 1;
    saveStoreData(data);
    setDoc(doc(db, 'articles', article.id), sanitizeForFirestore(article)).catch(() => {});
    res.json({ success: true, views: article.views });
  } else {
    res.status(404).json({ success: false, message: 'Berita tidak ditemukan' });
  }
});

// Helper to remove undefined fields for Firestore
function sanitizeForFirestore(obj: any): any {
  if (!obj) return {};
  return JSON.parse(JSON.stringify(obj, (key, value) => (value === undefined ? '' : value)));
}

// Global Maintenance Mode State
let maintenanceSettings = {
  enabled: false,
  message: 'Website ASQI NEWS sedang dalam pemeliharaan sistem rutin untuk peningkatan infrastruktur & performa. Kami akan segera kembali dengan sajian berita dan data terkini.',
  updatedAt: new Date().toISOString(),
};

// GET /api/maintenance
app.get('/api/maintenance', (req, res) => {
  const data = getStoreData();
  const current = data.maintenance || maintenanceSettings;
  res.json({ success: true, maintenance: current });
});

// POST /api/maintenance
app.post('/api/maintenance', (req, res) => {
  try {
    const { enabled, message } = req.body;
    const data = getStoreData();
    const updated = {
      enabled: !!enabled,
      message: message !== undefined ? String(message).trim() : (data.maintenance?.message || maintenanceSettings.message),
      updatedAt: new Date().toISOString(),
    };
    data.maintenance = updated;
    saveStoreData(data);

    // Sync to Firestore in background
    setDoc(doc(db, 'settings', 'maintenance'), updated).catch((err) => console.error('Firestore maintenance save error:', err));

    return res.json({ success: true, maintenance: updated });
  } catch (err: any) {
    console.error('Error POST /api/maintenance:', err);
    return res.status(500).json({ success: false, message: 'Gagal memperbarui status maintenance' });
  }
});

// POST /api/news
app.post('/api/news', (req, res) => {
  try {
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
      title: String(title).trim(),
      category: String(category).trim(),
      publishedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase() + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      views: 1,
      snippet: snippet ? String(snippet).trim() : String(content).trim().substring(0, 150) + '...',
      content: String(content).trim(),
      author: author ? String(author).trim() : 'Tim Redaksi ASQI',
      image: image ? String(image).trim() : 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
      imageCaption: imageCaption ? String(imageCaption).trim() : '',
      middleImage: middleImage ? String(middleImage).trim() : '',
      middleImageCaption: middleImageCaption ? String(middleImageCaption).trim() : '',
      galleryImages: Array.isArray(galleryImages) 
        ? galleryImages.map((g: any) => ({
            url: typeof g === 'string' ? g : (g?.url || ''),
            caption: typeof g === 'object' ? (g?.caption || '') : '',
          })) 
        : [],
      isFeatured: !!isFeatured,
      isPopular: !!isPopular,
      isPremium: !!req.body.isPremium,
      tags: Array.isArray(tags) ? tags : [category],
    };

    data.articles = [newArticle, ...(data.articles || [])];
    if (newArticle.isFeatured) {
      data.carousel = [newArticle, ...(data.carousel || [])];
    }
    saveStoreData(data);

    // Non-blocking background sync to Firebase Firestore Cloud Database
    const cleanDoc = sanitizeForFirestore(newArticle);
    setDoc(doc(db, 'articles', newArticle.id), cleanDoc).catch((err) => {
      console.error('Failed to save article to Firestore background:', err);
    });

    return res.json({ success: true, article: newArticle });
  } catch (err: any) {
    console.error('Error in POST /api/news:', err);
    return res.status(500).json({ success: false, message: err?.message || 'Gagal memproses berita di server' });
  }
});

// PUT /api/news/:id
app.put('/api/news/:id', (req, res) => {
  try {
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

    const updatedArticle = {
      ...existing,
      title: title !== undefined ? String(title).trim() : existing.title,
      category: category !== undefined ? String(category).trim() : existing.category,
      snippet: snippet !== undefined ? String(snippet).trim() : existing.snippet,
      content: content !== undefined ? String(content).trim() : existing.content,
      author: author !== undefined ? String(author).trim() : existing.author,
      image: image !== undefined ? String(image).trim() : existing.image,
      imageCaption: imageCaption !== undefined ? String(imageCaption).trim() : existing.imageCaption,
      middleImage: middleImage !== undefined ? String(middleImage).trim() : existing.middleImage,
      middleImageCaption: middleImageCaption !== undefined ? String(middleImageCaption).trim() : existing.middleImageCaption,
      galleryImages: galleryImages !== undefined 
        ? (Array.isArray(galleryImages) ? galleryImages.map((g: any) => ({ url: typeof g === 'string' ? g : (g?.url || ''), caption: typeof g === 'object' ? (g?.caption || '') : '' })) : [])
        : existing.galleryImages,
      isFeatured: isFeatured !== undefined ? !!isFeatured : existing.isFeatured,
      isPopular: isPopular !== undefined ? !!isPopular : existing.isPopular,
      isPremium: req.body.isPremium !== undefined ? !!req.body.isPremium : existing.isPremium,
      tags: tags !== undefined ? (Array.isArray(tags) ? tags : [category]) : existing.tags,
    };

    data.articles[index] = updatedArticle;
    saveStoreData(data);

    // Non-blocking background sync to Firebase Firestore Cloud Database
    const cleanDoc = sanitizeForFirestore(updatedArticle);
    setDoc(doc(db, 'articles', updatedArticle.id), cleanDoc).catch((err) => {
      console.error('Failed to update article in Firestore background:', err);
    });

    return res.json({ success: true, article: updatedArticle });
  } catch (err: any) {
    console.error('Error in PUT /api/news/:id:', err);
    return res.status(500).json({ success: false, message: err?.message || 'Gagal memperbarui berita di server' });
  }
});

// DELETE /api/news/:id
app.delete('/api/news/:id', (req, res) => {
  const data = getStoreData();
  data.articles = (data.articles || []).filter((a: NewsArticle) => a.id !== req.params.id);
  data.carousel = (data.carousel || []).filter((a: NewsArticle) => a.id !== req.params.id);
  saveStoreData(data);

  // Non-blocking background delete from Firebase Firestore
  deleteDoc(doc(db, 'articles', req.params.id)).catch((err) => {
    console.error('Failed to delete article from Firestore background:', err);
  });

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

// DEFAULT CATEGORIES
const DEFAULT_CATEGORIES_LIST = [
  'Beranda',
  'Berita Terbaru',
  'Nasional',
  'Daerah',
  'Pelayanan Publik',
  'PROFIL TOKOH PELAYANAN',
  'BUMN',
  'BUMD',
  'KORPORASI',
  'Bisnis',
  'ASQI',
];

// GET /api/categories
app.get('/api/categories', (req, res) => {
  const data = getStoreData();
  const categories = data.categories && data.categories.length > 0 ? data.categories : DEFAULT_CATEGORIES_LIST;
  res.json({ success: true, categories });
});

// POST /api/categories
app.post('/api/categories', (req, res) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi' });
    }

    const catName = name.trim();
    const data = getStoreData();
    let currentCats: string[] = data.categories && data.categories.length > 0 ? data.categories : [...DEFAULT_CATEGORIES_LIST];

    if (currentCats.some((c) => c.toLowerCase() === catName.toLowerCase())) {
      return res.status(400).json({ success: false, message: `Kategori '${catName}' sudah ada` });
    }

    currentCats.push(catName);
    data.categories = currentCats;
    saveStoreData(data);

    // Sync to Firestore
    setDoc(doc(db, 'settings', 'categories'), { list: currentCats, updatedAt: new Date().toISOString() }).catch(() => {});

    res.json({ success: true, categories: currentCats, message: `Kategori '${catName}' berhasil ditambahkan` });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Gagal menambahkan kategori' });
  }
});

// DELETE /api/categories/:name
app.delete('/api/categories/:name', (req, res) => {
  try {
    const target = decodeURIComponent(req.params.name).trim();
    const data = getStoreData();
    let currentCats: string[] = data.categories && data.categories.length > 0 ? data.categories : [...DEFAULT_CATEGORIES_LIST];

    currentCats = currentCats.filter((c) => c.toLowerCase() !== target.toLowerCase());
    data.categories = currentCats;
    saveStoreData(data);

    // Sync to Firestore
    setDoc(doc(db, 'settings', 'categories'), { list: currentCats, updatedAt: new Date().toISOString() }).catch(() => {});

    res.json({ success: true, categories: currentCats, message: `Kategori '${target}' berhasil dihapus` });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Gagal menghapus kategori' });
  }
});

// DEFAULT HEADER SETTINGS
const DEFAULT_HEADER_SETTINGS = {
  showQuickLinks: true,
  quickLinks: [
    { id: 'ql-1', label: 'Menu', category: '', icon: 'menu' },
    { id: 'ql-2', label: 'Harian', category: 'Berita Terbaru', icon: '' },
    { id: 'ql-3', label: 'Mingguan', category: 'Telaah', icon: '' },
    { id: 'ql-4', label: 'ASQI Plus', category: 'ASQI', icon: 'badge', isHighlighted: true },
  ],
  subscribeButtonText: 'Langganan',
  subscribeButtonBgColor: '#e11d48',
  loginButtonText: 'Masuk',
  showSearchBox: true,
};

// GET /api/header-settings
app.get('/api/header-settings', (req, res) => {
  const data = getStoreData();
  const settings = data.headerSettings || DEFAULT_HEADER_SETTINGS;
  res.json({ success: true, settings });
});

// POST /api/header-settings
app.post('/api/header-settings', (req, res) => {
  try {
    const { settings } = req.body;
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ success: false, message: 'Data pengaturan header tidak valid' });
    }

    const data = getStoreData();
    data.headerSettings = settings;
    saveStoreData(data);

    // Sync to Firestore
    setDoc(doc(db, 'settings', 'header'), { ...settings, updatedAt: new Date().toISOString() }).catch((err) => {
      console.error('Firestore header settings save error:', err);
    });

    res.json({ success: true, settings, message: 'Pengaturan header berhasil diperbarui' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err?.message || 'Gagal menyimpan pengaturan header' });
  }
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
