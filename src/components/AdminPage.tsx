import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  UserCheck,
  Key,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  Layers,
  FileText,
  BarChart2,
  Users,
  AlertCircle,
  CheckCircle,
  Download,
  Wrench,
  Power,
  Eye,
  TrendingUp,
  FolderPlus,
  Tag,
  PieChart,
  Sliders,
  Menu,
  Globe,
} from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { NewsArticle, Infographic, DataboksItem, AdminUser, AdminRole, HeaderSettings, HeaderQuickLink } from '../types';
import { initialData } from '../initialData';
import { Logo } from './Logo';
import { ImageUploadInput } from './ImageUploadInput';

const DEFAULT_ADMIN_USERS: AdminUser[] = [
  { id: 'usr-1', username: 'admin', name: 'Super Admin ASQI', role: 'superadmin' },
  { id: 'usr-2', username: 'editor', name: 'Chief Editor', role: 'editor' },
  { id: 'usr-3', username: 'jurnalis', name: 'Jurnalis Senior', role: 'author' },
];

const DEFAULT_CATEGORIES_FALLBACK = [
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

interface AdminPageProps {
  articles: NewsArticle[];
  categories?: string[];
  headerSettings?: HeaderSettings;
  onRefreshCategories?: () => void;
  onRefreshHeaderSettings?: () => void;
  onRefreshData: () => void;
  onNavigateHome: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  articles,
  categories = [],
  headerSettings,
  onRefreshCategories,
  onRefreshHeaderSettings,
  onRefreshData,
  onNavigateHome,
}) => {
  // Session State
  const [user, setUser] = useState<{ id: string; username: string; name: string; role: AdminRole } | null>(() => {
    try {
      const saved = localStorage.getItem('asqi_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Login Form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // Admin CMS Tabs
  const [activeTab, setActiveTab] = useState<'articles' | 'header' | 'categories' | 'insight' | 'databoks' | 'about_asqi' | 'users' | 'system'>('articles');

  // Tentang ASQI State
  const [aboutLogoUrl, setAboutLogoUrl] = useState('/asqi-logo-about.svg');
  const [aboutTargetUrl, setAboutTargetUrl] = useState('https://asqi.or.id/');
  const [aboutTitle, setAboutTitle] = useState('TENTANG ASQI');
  const [aboutCompanyName, setAboutCompanyName] = useState('Asosiasi Service Quality Indonesia (ASQI)');
  const [aboutDescription, setAboutDescription] = useState('Wadah jaringan profesional, pakar, dan praktisi manajemen mutu layanan terbesar di Indonesia.');
  const [isSavingAbout, setIsSavingAbout] = useState(false);

  useEffect(() => {
    fetch('/api/about-asqi')
      .then((r) => r.json())
      .then((res) => {
        if (res?.success && res.aboutAsqi) {
          setAboutLogoUrl(res.aboutAsqi.logoUrl || '/asqi-logo-about.svg');
          setAboutTargetUrl(res.aboutAsqi.targetUrl || 'https://asqi.or.id/');
          setAboutTitle(res.aboutAsqi.title || 'TENTANG ASQI');
          setAboutCompanyName(res.aboutAsqi.companyName || 'Asosiasi Service Quality Indonesia (ASQI)');
          setAboutDescription(res.aboutAsqi.description || '');
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveAboutAsqi = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingAbout(true);
    setMsg(null);
    try {
      const payload = {
        logoUrl: aboutLogoUrl,
        targetUrl: aboutTargetUrl,
        title: aboutTitle,
        companyName: aboutCompanyName,
        description: aboutDescription,
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'settings', 'about_asqi'), payload).catch(() => {});

      const res = await fetch('/api/about-asqi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).then((r) => r.json());

      if (res?.success) {
        setMsg({ type: 'success', text: 'Pengaturan Tentang ASQI berhasil disimpan!' });
      } else {
        setMsg({ type: 'error', text: res?.message || 'Gagal menyimpan data Tentang ASQI' });
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err?.message || 'Terjadi kesalahan saat menyimpan' });
    } finally {
      setIsSavingAbout(false);
    }
  };

  // Header Management State
  const [localHeaderSettings, setLocalHeaderSettings] = useState<HeaderSettings>(() => {
    return (
      headerSettings || {
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
      }
    );
  });
  const [isSavingHeader, setIsSavingHeader] = useState(false);
  const [newQlLabel, setNewQlLabel] = useState('');
  const [newQlCategory, setNewQlCategory] = useState('');
  const [newQlIcon, setNewQlIcon] = useState('none');
  const [newQlHighlighted, setNewQlHighlighted] = useState(false);

  useEffect(() => {
    if (headerSettings) {
      setLocalHeaderSettings(headerSettings);
    }
  }, [headerSettings]);

  // Category Management State
  const [newCatName, setNewCatName] = useState('');
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  // Form states for Articles
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Berita Terbaru');
  const [snippet, setSnippet] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [middleImage, setMiddleImage] = useState('');
  const [middleImageCaption, setMiddleImageCaption] = useState('');
  const [galleryImages, setGalleryImages] = useState<{ url: string; caption?: string }[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [tags, setTags] = useState('');
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  // Form states for Infographic & Databoks
  const [infoTitle, setInfoTitle] = useState('');
  const [infoImageUrl, setInfoImageUrl] = useState('');
  const [dataTitle, setDataTitle] = useState('');
  const [dataCategory, setDataCategory] = useState('');
  const [dataDesc, setDataDesc] = useState('');

  // User Management State (Super Admin Only)
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<AdminRole>('editor');

  // Notification / Message
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Maintenance State
  const [maintenanceEnabled, setMaintenanceEnabled] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState('Website ASQI NEWS sedang dalam pemeliharaan sistem rutin untuk peningkatan infrastruktur & performa. Kami akan segera kembali!');
  const [isSavingMaintenance, setIsSavingMaintenance] = useState(false);

  // Load maintenance status
  useEffect(() => {
    fetch('/api/maintenance')
      .then((r) => r.json())
      .then((res) => {
        if (res?.success && res.maintenance) {
          setMaintenanceEnabled(!!res.maintenance.enabled);
          if (res.maintenance.message) setMaintenanceMessage(res.maintenance.message);
        }
      })
      .catch(() => {});
  }, []);

  const handleToggleMaintenance = async (targetState: boolean) => {
    setIsSavingMaintenance(true);
    try {
      // 1. Save directly to Firestore Cloud Database
      await setDoc(doc(db, 'settings', 'maintenance'), {
        enabled: targetState,
        message: maintenanceMessage,
        updatedAt: new Date().toISOString(),
      }).catch(() => {});

      // 2. Save via REST API
      await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: targetState, message: maintenanceMessage }),
      });

      setMaintenanceEnabled(targetState);
      setMsg({
        type: 'success',
        text: targetState
          ? '🔴 MODE PERAWATAN DI-AKTIFKAN! Pembaca/Pengunjung umum sekarang melihat halaman Maintenance.'
          : '🟢 MODE PERAWATAN DI-MATIKAN! Website ASQI NEWS sekarang kembali aktif secara publik.',
      });
    } catch (err) {
      console.error('Toggle maintenance error:', err);
      setMsg({ type: 'error', text: 'Gagal memperbarui status Mode Perawatan.' });
    } finally {
      setIsSavingMaintenance(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    setIsSavingCategory(true);

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmed }),
      }).then((r) => r.json());

      if (res.success) {
        setMsg({ type: 'success', text: `Kategori '${trimmed}' berhasil ditambahkan!` });
        setNewCatName('');
        if (onRefreshCategories) onRefreshCategories();
      } else {
        setMsg({ type: 'error', text: res.message || 'Gagal menambahkan kategori baru' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Gagal terhubung ke server saat menyimpan kategori baru' });
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (catName: string) => {
    if (!window.confirm(`Hapus kategori '${catName}' secara permanen?`)) return;

    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(catName)}`, {
        method: 'DELETE',
      }).then((r) => r.json());

      if (res.success) {
        setMsg({ type: 'success', text: `Kategori '${catName}' berhasil dihapus.` });
        if (onRefreshCategories) onRefreshCategories();
      } else {
        setMsg({ type: 'error', text: res.message || 'Gagal menghapus kategori' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Gagal terhubung ke server saat menghapus kategori' });
    }
  };

  const effectiveCategories = categories && categories.length > 0
    ? categories
    : DEFAULT_CATEGORIES_FALLBACK;

  const totalViews = articles.reduce((acc, a) => acc + (a.views || 0), 0);
  const sortedArticlesByViews = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0));

  // Set default author when user logs in
  useEffect(() => {
    if (user && !author) {
      setAuthor(user.name);
    }
  }, [user, author]);

  // Fetch admin users list if superadmin
  useEffect(() => {
    if (user && user.role === 'superadmin') {
      fetchAdminUsers();
    }
  }, [user]);

  const fetchAdminUsers = () => {
    try {
      const saved = localStorage.getItem('asqi_admin_users');
      if (saved) {
        setAdminUsers(JSON.parse(saved));
      } else {
        localStorage.setItem('asqi_admin_users', JSON.stringify(DEFAULT_ADMIN_USERS));
        setAdminUsers(DEFAULT_ADMIN_USERS);
      }
    } catch (err) {
      console.error('Failed to load admin users from localStorage:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsSubmittingLogin(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword }),
      });
      const data = await res.json();

      if (data?.success) {
        setUser(data.user);
        setAuthor(data.user.name);
        localStorage.setItem('asqi_admin_user', JSON.stringify(data.user));
        setMsg({ type: 'success', text: `Selamat datang kembali, ${data.user.name}!` });
        setIsSubmittingLogin(false);
        return;
      }
    } catch {
      // Fallback to local authentication
    }

    try {
      const savedUsersStr = localStorage.getItem('asqi_admin_users');
      const usersList: AdminUser[] = savedUsersStr ? JSON.parse(savedUsersStr) : DEFAULT_ADMIN_USERS;

      let matchedUser: AdminUser | undefined;
      if (loginUsername === 'admin' && loginPassword === 'admin123') {
        matchedUser = DEFAULT_ADMIN_USERS[0];
      } else if (loginUsername === 'editor' && loginPassword === 'editor123') {
        matchedUser = DEFAULT_ADMIN_USERS[1];
      } else if (loginUsername === 'jurnalis' && loginPassword === 'jurnalis123') {
        matchedUser = DEFAULT_ADMIN_USERS[2];
      } else {
        matchedUser = usersList.find((u) => u.username === loginUsername);
      }

      if (matchedUser) {
        setUser(matchedUser);
        setAuthor(matchedUser.name);
        localStorage.setItem('asqi_admin_user', JSON.stringify(matchedUser));
        setMsg({ type: 'success', text: `Selamat datang kembali, ${matchedUser.name}!` });
      } else {
        setLoginError('Username atau password tidak valid.');
      }
    } catch {
      setLoginError('Terjadi kesalahan saat memproses login.');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  const fillQuickLogin = (uname: string, pass: string) => {
    setLoginUsername(uname);
    setLoginPassword(pass);
    setLoginError('');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('asqi_admin_user');
    setMsg(null);
  };

  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !content) {
      setMsg({ type: 'error', text: 'Judul, Kategori, dan Isi Berita wajib diisi!' });
      return;
    }

    const articleId = editingArticleId || ('art-' + Date.now());
    const fullArticle: NewsArticle = {
      id: articleId,
      title: title.trim(),
      category: category.trim(),
      publishedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase() + ', ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      views: 1,
      snippet: (snippet || content.substring(0, 150) + '...').trim(),
      content: content.trim(),
      author: (author || (user ? user.name : 'Redaksi ASQI NEWS')).trim(),
      image: (image || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80').trim(),
      imageCaption: (imageCaption || '').trim(),
      middleImage: (middleImage || '').trim(),
      middleImageCaption: (middleImageCaption || '').trim(),
      galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
      isFeatured: !!isFeatured,
      isPopular: !!isPopular,
      isPremium: !!isPremium,
      tags: tags ? tags.split(',').map((t) => t.trim()) : [category],
    };

    let firestoreSaved = false;
    let apiSaved = false;

    // 1. Direct write to Firebase Firestore Cloud Database (Instant, real-time sync)
    try {
      const cleanDoc = JSON.parse(JSON.stringify(fullArticle, (k, v) => (v === undefined ? '' : v)));
      await setDoc(doc(db, 'articles', articleId), cleanDoc);
      firestoreSaved = true;
    } catch (fsErr) {
      console.warn('Direct Firestore save notice:', fsErr);
    }

    // 2. Call REST API Server
    try {
      let response;
      if (editingArticleId) {
        response = await fetch(`/api/news/${editingArticleId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fullArticle),
        });
      } else {
        response = await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fullArticle),
        });
      }

      if (response && response.ok) {
        apiSaved = true;
      }
    } catch (apiErr) {
      console.warn('REST API save notice:', apiErr);
    }

    if (firestoreSaved || apiSaved) {
      setMsg({
        type: 'success',
        text: editingArticleId
          ? 'Berita berhasil diperbarui secara live di database cloud!'
          : 'Berita baru berhasil diterbitkan secara live di database cloud!',
      });
      resetArticleForm();
      await onRefreshData();
    } else {
      setMsg({ type: 'error', text: 'Gagal menyimpan berita. Silakan periksa koneksi internet Anda.' });
    }
  };

  const handleEditClick = (article: NewsArticle) => {
    setEditingArticleId(article.id);
    setTitle(article.title);
    setCategory(article.category);
    setSnippet(article.snippet);
    setContent(article.content);
    setAuthor(article.author);
    setImage(article.image);
    setImageCaption(article.imageCaption || '');
    setMiddleImage(article.middleImage || '');
    setMiddleImageCaption(article.middleImageCaption || '');
    setGalleryImages(article.galleryImages || []);
    setIsFeatured(Boolean(article.isFeatured));
    setIsPopular(Boolean(article.isPopular));
    setIsPremium(Boolean(article.isPremium));
    setTags(article.tags ? article.tags.join(', ') : '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus artikel berita ini dari server?')) return;
    try {
      const res = await fetch(`/api/news/${id}`, { method: 'DELETE' }).then((r) => r.json());
      if (res?.success) {
        setMsg({ type: 'success', text: 'Artikel berita berhasil dihapus dari server!' });
        await onRefreshData();
      } else {
        setMsg({ type: 'error', text: res?.message || 'Gagal menghapus artikel dari server' });
      }
    } catch (err) {
      console.error('Delete article error:', err);
      setMsg({ type: 'error', text: 'Gagal terhubung ke server untuk menghapus artikel' });
    }
  };

  const resetArticleForm = () => {
    setEditingArticleId(null);
    setTitle('');
    setCategory('Berita Terbaru');
    setSnippet('');
    setContent('');
    setImage('');
    setImageCaption('');
    setMiddleImage('');
    setMiddleImageCaption('');
    setGalleryImages([]);
    setIsFeatured(false);
    setIsPopular(false);
    setIsPremium(false);
    setTags('');
  };

  const handleAddInfographic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!infoTitle || !infoImageUrl) return;
    try {
      const res = await fetch('/api/infographics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: infoTitle, imageUrl: infoImageUrl }),
      }).then((r) => r.json());

      if (res?.success) {
        setMsg({ type: 'success', text: 'Infografik baru berhasil ditambahkan ke server' });
        setInfoTitle('');
        setInfoImageUrl('');
        await onRefreshData();
      } else {
        setMsg({ type: 'error', text: res?.message || 'Gagal menambahkan infografik' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Gagal menghubungkan ke server' });
    }
  };

  const handleDeleteInfographic = async (id: string) => {
    if (!confirm('Hapus infografik ini?')) return;
    try {
      const res = await fetch(`/api/infographics/${id}`, { method: 'DELETE' }).then((r) => r.json());
      if (res?.success) {
        setMsg({ type: 'success', text: 'Infografik berhasil dihapus' });
        await onRefreshData();
      }
    } catch {
      setMsg({ type: 'error', text: 'Gagal menghapus infografik' });
    }
  };

  const handleAddDataboks = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataTitle) return;
    try {
      const res = await fetch('/api/databoks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: dataTitle, category: dataCategory || 'Data Ekonomi', description: dataDesc }),
      }).then((r) => r.json());

      if (res?.success) {
        setMsg({ type: 'success', text: 'Item Databoks berhasil ditambahkan ke server' });
        setDataTitle('');
        setDataCategory('');
        setDataDesc('');
        await onRefreshData();
      } else {
        setMsg({ type: 'error', text: res?.message || 'Gagal menambahkan databoks' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Gagal me-refresh databoks' });
    }
  };

  const handleDeleteDataboks = async (id: string) => {
    if (!confirm('Hapus item databoks ini?')) return;
    try {
      const res = await fetch(`/api/databoks/${id}`, { method: 'DELETE' }).then((r) => r.json());
      if (res?.success) {
        setMsg({ type: 'success', text: 'Item databoks berhasil dihapus' });
        await onRefreshData();
      }
    } catch {
      setMsg({ type: 'error', text: 'Gagal menghapus item databoks' });
    }
  };

  // Header Settings Handlers
  const handleSaveHeaderSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingHeader(true);

    try {
      const res = await fetch('/api/header-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: localHeaderSettings }),
      }).then((r) => r.json());

      if (res.success) {
        setMsg({ type: 'success', text: 'Pengaturan Header Bar berhasil diperbarui dan disinkronkan!' });
        if (onRefreshHeaderSettings) onRefreshHeaderSettings();
      } else {
        setMsg({ type: 'error', text: res.message || 'Gagal menyimpan pengaturan header' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Gagal terhubung ke server saat menyimpan pengaturan header' });
    } finally {
      setIsSavingHeader(false);
    }
  };

  const handleAddQuickLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQlLabel.trim()) return;

    const newItem: HeaderQuickLink = {
      id: 'ql-' + Date.now(),
      label: newQlLabel.trim(),
      category: newQlCategory,
      icon: newQlIcon === 'none' ? '' : newQlIcon,
      isHighlighted: newQlHighlighted,
    };

    setLocalHeaderSettings((prev) => ({
      ...prev,
      quickLinks: [...prev.quickLinks, newItem],
    }));

    setNewQlLabel('');
    setNewQlCategory('');
    setNewQlIcon('none');
    setNewQlHighlighted(false);
  };

  const handleDeleteQuickLink = (id: string) => {
    setLocalHeaderSettings((prev) => ({
      ...prev,
      quickLinks: prev.quickLinks.filter((item) => item.id !== id),
    }));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword || !newName) {
      setMsg({ type: 'error', text: 'Isi semua data pengguna baru' });
      return;
    }

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          name: newName,
          role: newRole,
        }),
      }).then((r) => r.json());

      if (res?.success) {
        setMsg({ type: 'success', text: `Pengguna admin baru (${newUsername}) berhasil dibuat di server!` });
        setNewUsername('');
        setNewPassword('');
        setNewName('');
        setNewRole('editor');
        fetchAdminUsers();
      } else {
        setMsg({ type: 'error', text: res?.message || 'Gagal menambah akun pengguna admin' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Gagal menghubungkan ke server' });
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Hapus akses akun admin ini dari server?')) return;
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' }).then((r) => r.json());
      if (res?.success) {
        setMsg({ type: 'success', text: 'Pengguna berhasil dihapus' });
        fetchAdminUsers();
      } else {
        setMsg({ type: 'error', text: res?.message || 'Gagal menghapus pengguna' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Gagal terhubung ke server' });
    }
  };

  const handleResetSeed = async () => {
    if (!confirm('RESET SIMPANAN SERVER: Semua data berita akan di-reset ke data awal sampel?')) return;
    try {
      const res = await fetch('/api/seed', { method: 'POST' }).then((r) => r.json());
      if (res?.success) {
        localStorage.removeItem('asqi_articles');
        localStorage.removeItem('asqi_carousel');
        localStorage.removeItem('asqi_infographics');
        localStorage.removeItem('asqi_databoks');
        localStorage.removeItem('asqi_videos');
        localStorage.removeItem('asqi_admin_users');
        setMsg({ type: 'success', text: 'Data server berhasil di-reset ke sampel awal!' });
        await onRefreshData();
        fetchAdminUsers();
      } else {
        setMsg({ type: 'error', text: 'Gagal me-reset data server' });
      }
    } catch {
      setMsg({ type: 'error', text: 'Gagal me-reset data' });
    }
  };

  // Helper role badge
  const renderRoleBadge = (role: AdminRole) => {
    switch (role) {
      case 'superadmin':
        return (
          <span style={{ background: '#7c3aed', color: '#ffffff', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
            SUPER ADMIN
          </span>
        );
      case 'editor':
        return (
          <span style={{ background: '#0284c7', color: '#ffffff', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
            EDITOR
          </span>
        );
      case 'author':
        return (
          <span style={{ background: '#059669', color: '#ffffff', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
            JURNALIS / AUTHOR
          </span>
        );
      default:
        return null;
    }
  };

  // IF NOT LOGGED IN: SHOW LOGIN SCREEN
  if (!user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', color: '#ffffff', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ maxWidth: '480px', width: '100%', backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', padding: '32px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#0284c7', color: '#ffffff', marginBottom: '12px' }}>
              <Shield size={24} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
              <Logo height={42} />
            </div>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>
              Sistem Autentikasi Admin &amp; Hak Akses Berbeda (CMS Client-Side)
            </p>
          </div>

          {loginError && (
            <div style={{ backgroundColor: '#7f1d1d', border: '1px solid #b91c1c', color: '#fca5a5', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} /> {loginError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Username
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  placeholder="Masukkan username admin..."
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px', outline: 'none' }}
                />
                <UserCheck size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  required
                  placeholder="Masukkan password..."
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px 10px 36px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px', outline: 'none' }}
                />
                <Key size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingLogin}
              style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 0.2s', marginTop: '8px' }}
            >
              <Lock size={16} /> {isSubmittingLogin ? 'Memverifikasi...' : 'Masuk ke Panel CMS'}
            </button>
          </form>

          {/* Demo User Credential Presets */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #334155' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginBottom: '10px', textAlign: 'center' }}>
              KLIK PILIH AKUN DEMO PERAN / HAK AKSES:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => fillQuickLogin('admin', 'admin123')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#0f172a', border: '1px solid #3b82f6', borderRadius: '6px', color: '#ffffff', cursor: 'pointer', textAlign: 'left', fontSize: '12px' }}
              >
                <div>
                  <strong style={{ color: '#a78bfa', display: 'block' }}>👑 Super Admin (admin)</strong>
                  <span style={{ color: '#94a3b8', fontSize: '11px' }}>Akses penuh: Berita, Kategori, Insight, User &amp; Maintenance</span>
                </div>
                <span style={{ fontSize: '11px', backgroundColor: '#334155', color: '#cbd5e1', padding: '2px 8px', borderRadius: '4px' }}>Pilih Akun</span>
              </button>

              <button
                type="button"
                onClick={() => fillQuickLogin('editor', 'editor123')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#0f172a', border: '1px solid #0284c7', borderRadius: '6px', color: '#ffffff', cursor: 'pointer', textAlign: 'left', fontSize: '12px' }}
              >
                <div>
                  <strong style={{ color: '#38bdf8', display: 'block' }}>✏️ Chief Editor (editor)</strong>
                  <span style={{ color: '#94a3b8', fontSize: '11px' }}>Kelola Berita, Kategori, Infografik, Databoks</span>
                </div>
                <span style={{ fontSize: '11px', backgroundColor: '#334155', color: '#cbd5e1', padding: '2px 8px', borderRadius: '4px' }}>Pilih Akun</span>
              </button>

              <button
                type="button"
                onClick={() => fillQuickLogin('jurnalis', 'jurnalis123')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#0f172a', border: '1px solid #10b981', borderRadius: '6px', color: '#ffffff', cursor: 'pointer', textAlign: 'left', fontSize: '12px' }}
              >
                <div>
                  <strong style={{ color: '#34d399', display: 'block' }}>✍️ Jurnalis Senior (jurnalis)</strong>
                  <span style={{ color: '#94a3b8', fontSize: '11px' }}>Hak akses menerbitkan &amp; me-review berita</span>
                </div>
                <span style={{ fontSize: '11px', backgroundColor: '#334155', color: '#cbd5e1', padding: '2px 8px', borderRadius: '4px' }}>Pilih Akun</span>
              </button>
            </div>
          </div>

          {/* Navigation back */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              onClick={onNavigateHome}
              style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}
            >
              ← Kembali ke Portal Berita publik (domain.com)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // LOGGED IN ADMIN DASHBOARD VIEW
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Top Navbar Header */}
      <header style={{ backgroundColor: '#1e293b', borderBottom: '1px solid #334155', padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Logo height={32} />
            <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 700 }}>CMS</span>
          </div>
          <span style={{ backgroundColor: '#0369a1', color: '#e0f2fe', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
            Domain Routing /admin
          </span>
          {user.role === 'superadmin' && (
            <button
              type="button"
              onClick={() => handleToggleMaintenance(!maintenanceEnabled)}
              title="Klik untuk mengubah Mode Perawatan secara instant"
              style={{
                backgroundColor: maintenanceEnabled ? '#7f1d1d' : '#064e3b',
                color: maintenanceEnabled ? '#fca5a5' : '#a7f3d0',
                border: `1px solid ${maintenanceEnabled ? '#ef4444' : '#10b981'}`,
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Wrench size={13} />
              {maintenanceEnabled ? 'MAINTENANCE MODE: AKTIF 🔴' : 'MAINTENANCE MODE: OFF 🟢'}
            </button>
          )}
        </div>

        {/* User Info & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#0f172a', padding: '6px 12px', borderRadius: '20px', border: '1px solid #334155' }}>
            <UserCheck size={16} style={{ color: '#38bdf8' }} />
            <span style={{ fontSize: '13px', fontWeight: 600 }}>{user.name}</span>
            {renderRoleBadge(user.role)}
          </div>

          <button
            onClick={onNavigateHome}
            style={{ backgroundColor: '#334155', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <ExternalLink size={14} /> Lihat Portal (domain.com/)
          </button>

          <button
            onClick={handleLogout}
            style={{ backgroundColor: '#991b1b', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <LogOut size={14} /> Keluar (Logout)
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px 16px' }}>
        {/* Banner Alert Message */}
        {msg && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: msg.type === 'success' ? '#064e3b' : '#7f1d1d',
              border: `1px solid ${msg.type === 'success' ? '#059669' : '#b91c1c'}`,
              color: '#ffffff',
              fontSize: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {msg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              <span>{msg.text}</span>
            </div>
            <button onClick={() => setMsg(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
          </div>
        )}

        {/* Admin Dashboard Grid Layout: Left Sidebar + Right Content */}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
          {/* LEFT SIDEBAR NAVIGATION MENU */}
          <aside style={{ width: '250px', flexShrink: 0, backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase', paddingBottom: '8px', borderBottom: '1px solid #334155' }}>
              PANEL MENU ADMIN
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(user.role === 'superadmin' || user.role === 'editor' || user.role === 'author') && (
                <button
                  onClick={() => setActiveTab('articles')}
                  style={{
                    backgroundColor: activeTab === 'articles' ? '#0284c7' : '#0f172a',
                    color: '#ffffff',
                    border: `1px solid ${activeTab === 'articles' ? '#38bdf8' : '#334155'}`,
                    padding: '10px 14px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <FileText size={16} style={{ color: activeTab === 'articles' ? '#ffffff' : '#38bdf8' }} /> Kelola Berita
                </button>
              )}

              {(user.role === 'superadmin' || user.role === 'editor' || user.role === 'author') && (
                <button
                  onClick={() => setActiveTab('header')}
                  style={{
                    backgroundColor: activeTab === 'header' ? '#0284c7' : '#0f172a',
                    color: '#ffffff',
                    border: `1px solid ${activeTab === 'header' ? '#38bdf8' : '#334155'}`,
                    padding: '10px 14px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <Sliders size={16} style={{ color: activeTab === 'header' ? '#ffffff' : '#f43f5e' }} /> Kelola Header Bar
                </button>
              )}

              {(user.role === 'superadmin' || user.role === 'editor' || user.role === 'author') && (
                <button
                  onClick={() => setActiveTab('categories')}
                  style={{
                    backgroundColor: activeTab === 'categories' ? '#0284c7' : '#0f172a',
                    color: '#ffffff',
                    border: `1px solid ${activeTab === 'categories' ? '#38bdf8' : '#334155'}`,
                    padding: '10px 14px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <FolderPlus size={16} style={{ color: activeTab === 'categories' ? '#ffffff' : '#a78bfa' }} /> Kelola Kategori
                </button>
              )}

              {(user.role === 'superadmin' || user.role === 'editor' || user.role === 'author') && (
                <button
                  onClick={() => setActiveTab('insight')}
                  style={{
                    backgroundColor: activeTab === 'insight' ? '#0284c7' : '#0f172a',
                    color: '#ffffff',
                    border: `1px solid ${activeTab === 'insight' ? '#38bdf8' : '#334155'}`,
                    padding: '10px 14px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <Eye size={16} style={{ color: activeTab === 'insight' ? '#ffffff' : '#34d399' }} /> Insight Pembaca
                </button>
              )}

              {(user.role === 'superadmin' || user.role === 'editor') && (
                <button
                  onClick={() => setActiveTab('databoks')}
                  style={{
                    backgroundColor: activeTab === 'databoks' ? '#0284c7' : '#0f172a',
                    color: '#ffffff',
                    border: `1px solid ${activeTab === 'databoks' ? '#38bdf8' : '#334155'}`,
                    padding: '10px 14px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <BarChart2 size={16} style={{ color: activeTab === 'databoks' ? '#ffffff' : '#f59e0b' }} /> Databoks &amp; Infografik
                </button>
              )}

              {(user.role === 'superadmin' || user.role === 'editor') && (
                <button
                  onClick={() => setActiveTab('about_asqi')}
                  style={{
                    backgroundColor: activeTab === 'about_asqi' ? '#0284c7' : '#0f172a',
                    color: '#ffffff',
                    border: `1px solid ${activeTab === 'about_asqi' ? '#38bdf8' : '#334155'}`,
                    padding: '10px 14px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <Globe size={16} style={{ color: activeTab === 'about_asqi' ? '#ffffff' : '#38bdf8' }} /> Tentang ASQI (Banner)
                </button>
              )}

              {user.role === 'superadmin' && (
                <button
                  onClick={() => setActiveTab('users')}
                  style={{
                    backgroundColor: activeTab === 'users' ? '#7c3aed' : '#0f172a',
                    color: '#ffffff',
                    border: `1px solid ${activeTab === 'users' ? '#a78bfa' : '#334155'}`,
                    padding: '10px 14px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <Users size={16} style={{ color: activeTab === 'users' ? '#ffffff' : '#a78bfa' }} /> Kelola User &amp; Akses
                </button>
              )}

              {user.role === 'superadmin' && (
                <button
                  onClick={() => setActiveTab('system')}
                  style={{
                    backgroundColor: activeTab === 'system' ? '#475569' : '#0f172a',
                    color: '#ffffff',
                    border: `1px solid ${activeTab === 'system' ? '#94a3b8' : '#334155'}`,
                    padding: '10px 14px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <Layers size={16} style={{ color: activeTab === 'system' ? '#ffffff' : '#cbd5e1' }} /> Sistem &amp; Maintenance
                </button>
              )}
            </div>

            {/* Sidebar Quick Stats Widget */}
            <div style={{ marginTop: 'auto', backgroundColor: '#0f172a', padding: '12px', borderRadius: '6px', border: '1px solid #334155', fontSize: '11px', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '2px' }}>📊 Ringkasan Portal:</div>
              <div>📄 Total Berita: <strong style={{ color: '#38bdf8' }}>{articles.length}</strong></div>
              <div>📂 Total Kategori: <strong style={{ color: '#a78bfa' }}>{effectiveCategories.length}</strong></div>
              <div>👁️ Total Pembaca: <strong style={{ color: '#34d399' }}>{totalViews.toLocaleString('id-ID')}</strong></div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main style={{ flex: 1, minWidth: '300px' }}>
            {/* TAB 1: ARTICLES MANAGEMENT */}
            {activeTab === 'articles' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                {/* Form Create/Edit Article */}
            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', padding: '24px', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} style={{ color: '#38bdf8' }} /> {editingArticleId ? 'Edit Artikel Berita' : 'Tulis &amp; Terbitkan Berita Baru'}
              </h3>

              <form onSubmit={handleSaveArticle} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Judul Berita *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: IHSG Menguat ke 7.300 di Tengah Lonjakan Investasi..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Kategori Berita *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px' }}
                  >
                    {effectiveCategories
                      .filter((c) => c !== 'Beranda')
                      .map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Penulis / Author
                  </label>
                  <input
                    type="text"
                    value={author}
                    readOnly={user.role === 'author'}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Tim Redaksi ASQI NEWS"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: user.role === 'author' ? '#334155' : '#0f172a', color: '#ffffff', fontSize: '14px' }}
                  />
                </div>

                {/* 1. Gambar Sampul Utama (Header/Hero) */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <ImageUploadInput
                    label="1. Gambar Sampul Utama (Header / Hero Headline)"
                    value={image}
                    onChange={setImage}
                    captionValue={imageCaption}
                    onCaptionChange={setImageCaption}
                    captionPlaceholder="Contoh: Suasana Rapat Paripurna DPR RI di Jakarta / Foto: Antara"
                    helperText="Upload foto utama dari komputer/HP Anda. Foto ini tampil di headline utama dan thumbnail berita."
                  />
                </div>

                {/* 2. Gambar Sisipan Tengah Artikel */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <ImageUploadInput
                    label="2. Gambar Sisipan Tengah Artikel (Tersisip di Tengah Paragraf)"
                    value={middleImage}
                    onChange={setMiddleImage}
                    captionValue={middleImageCaption}
                    onCaptionChange={setMiddleImageCaption}
                    captionPlaceholder="Contoh: Grafik pertumbuhan ekonomi kuartal III / Sumber: BPS"
                    helperText="Foto opsional yang akan ditampilkan di pertengahan paragraf bacaan artikel."
                  />
                </div>

                {/* 3. Galeri Foto Liputan Tambahan */}
                <div style={{ gridColumn: '1 / -1', backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc' }}>
                      3. Foto Liputan Tambahan / Galeri Liputan ({galleryImages.length} Foto)
                    </label>
                    <button
                      type="button"
                      onClick={() => setGalleryImages([...galleryImages, { url: '', caption: '' }])}
                      style={{
                        backgroundColor: '#0284c7',
                        color: '#ffffff',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Plus size={14} /> Tambah Foto Galeri
                    </button>
                  </div>

                  {galleryImages.length === 0 ? (
                    <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: '12px', backgroundColor: '#020617', borderRadius: '6px' }}>
                      Belum ada foto galeri tambahan. Klik tombol di atas untuk menambah dokumentasi foto liputan.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {galleryImages.map((gImg, idx) => (
                        <div key={idx} style={{ position: 'relative' }}>
                          <ImageUploadInput
                            label={`Foto Galeri #${idx + 1}`}
                            value={gImg.url}
                            onChange={(newUrl) => {
                              const updated = [...galleryImages];
                              updated[idx].url = newUrl;
                              setGalleryImages(updated);
                            }}
                            captionValue={gImg.caption || ''}
                            onCaptionChange={(newCap) => {
                              const updated = [...galleryImages];
                              updated[idx].caption = newCap;
                              setGalleryImages(updated);
                            }}
                            captionPlaceholder="Keterangan foto galeri..."
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setGalleryImages(galleryImages.filter((_, i) => i !== idx));
                            }}
                            style={{
                              position: 'absolute',
                              top: '12px',
                              right: '12px',
                              backgroundColor: '#991b1b',
                              color: '#ffffff',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Trash2 size={12} /> Hapus Foto Ini
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Ringkasan Berita (Snippet)
                  </label>
                  <input
                    type="text"
                    value={snippet}
                    onChange={(e) => setSnippet(e.target.value)}
                    placeholder="Ringkasan singkat 1-2 kalimat..."
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Isi Lengkap Berita (Paragraf) *
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Tulis artikel berita secara lengkap di sini..."
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px', lineHeight: 1.6 }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Tags (Pisahkan koma)
                  </label>
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="IHSG, Saham, Investasi"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
                    Tampilkan di Carousel Slider Headline Utama
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input type="checkbox" checked={isPopular} onChange={(e) => setIsPopular(e.target.checked)} />
                    Tandai Berita Terpopuler
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', backgroundColor: '#881337', padding: '6px 12px', borderRadius: '6px', color: '#ffffff' }}>
                    <input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} />
                    🔒 Berita Akses Khusus (Berbayar Akses Khusus)
                  </label>
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button
                    type="submit"
                    style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
                  >
                    {editingArticleId ? 'Simpan Perubahan Berita' : 'Terbitkan Berita Sekarang'}
                  </button>

                  {editingArticleId && (
                    <button
                      type="button"
                      onClick={resetArticleForm}
                      style={{ backgroundColor: '#475569', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}
                    >
                      Batal Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List of Published Articles */}
            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', padding: '24px', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginTop: 0, marginBottom: '16px' }}>
                Daftar Artikel Berita Terbit ({articles.length} Artikel)
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {articles.map((art) => (
                  <div
                    key={art.id}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', padding: '12px 16px', borderRadius: '6px', border: '1px solid #334155', gap: '16px' }}
                  >
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <img src={art.image} alt={art.title} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff' }}>{art.title}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                          <span style={{ color: '#38bdf8' }}>{art.category}</span> • Oleh: {art.author} • {art.publishedAt} • <strong style={{ color: '#34d399' }}>👁️ {(art.views || 0).toLocaleString('id-ID')} dibaca</strong>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {(user.role === 'superadmin' || user.role === 'editor' || art.author === user.name) && (
                        <button
                          onClick={() => handleEditClick(art)}
                          style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '6px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Edit size={12} /> Edit
                        </button>
                      )}

                      {(user.role === 'superadmin' || user.role === 'editor') && (
                        <button
                          onClick={() => handleDeleteArticle(art.id)}
                          style={{ backgroundColor: '#991b1b', color: '#ffffff', border: 'none', padding: '6px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Trash2 size={12} /> Hapus
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB HEADER: KELOLA HEADER BAR (ALL ROLES) */}
        {activeTab === 'header' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Header Settings Form: General Controls */}
            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', padding: '24px', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#f8fafc' }}>
                <Sliders size={18} style={{ color: '#f43f5e' }} /> Pengaturan Tombol &amp; Tampilan Header Bar
              </h3>

              <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px', lineHeight: 1.5 }}>
                Sesuaikan teks tombol, warna, serta opsi pencarian dan menu cepat yang muncul di sebelah kanan logo portal berita.
              </p>

              <form onSubmit={handleSaveHeaderSettings} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Teks Tombol Langganan
                  </label>
                  <input
                    type="text"
                    value={localHeaderSettings.subscribeButtonText}
                    onChange={(e) => setLocalHeaderSettings({ ...localHeaderSettings, subscribeButtonText: e.target.value })}
                    placeholder="Langganan"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Warna Background Tombol Langganan
                  </label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                      type="color"
                      value={localHeaderSettings.subscribeButtonBgColor}
                      onChange={(e) => setLocalHeaderSettings({ ...localHeaderSettings, subscribeButtonBgColor: e.target.value })}
                      style={{ width: '42px', height: '42px', border: 'none', borderRadius: '6px', cursor: 'pointer', backgroundColor: 'transparent' }}
                    />
                    <input
                      type="text"
                      value={localHeaderSettings.subscribeButtonBgColor}
                      onChange={(e) => setLocalHeaderSettings({ ...localHeaderSettings, subscribeButtonBgColor: e.target.value })}
                      style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Teks Tombol Masuk / Login
                  </label>
                  <input
                    type="text"
                    value={localHeaderSettings.loginButtonText}
                    onChange={(e) => setLocalHeaderSettings({ ...localHeaderSettings, loginButtonText: e.target.value })}
                    placeholder="Masuk"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px' }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'center' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#f1f5f9', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={localHeaderSettings.showSearchBox}
                      onChange={(e) => setLocalHeaderSettings({ ...localHeaderSettings, showSearchBox: e.target.checked })}
                      style={{ width: '16px', height: '16px', accentColor: '#0284c7' }}
                    />
                    Tampilkan Kotak Pencarian Kompak di Header
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#f1f5f9', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={localHeaderSettings.showQuickLinks}
                      onChange={(e) => setLocalHeaderSettings({ ...localHeaderSettings, showQuickLinks: e.target.checked })}
                      style={{ width: '16px', height: '16px', accentColor: '#0284c7' }}
                    />
                    Tampilkan Quick Links Menu di Samping Logo
                  </label>
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button
                    type="submit"
                    disabled={isSavingHeader}
                    style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '12px 24px', borderRadius: '6px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <CheckCircle size={16} /> {isSavingHeader ? 'Menyimpan...' : 'Simpan Pengaturan Header Bar'}
                  </button>
                </div>
              </form>
            </div>

            {/* Manage Quick Links List */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              {/* Form Add Quick Link */}
              <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', padding: '24px', border: '1px solid #334155' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, marginTop: 0, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8' }}>
                  <Plus size={16} /> Tambah Menu / Quick Link Baru
                </h4>

                <form onSubmit={handleAddQuickLink} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      Label Menu (Contoh: Harian, Mingguan, ASQI Plus...) *
                    </label>
                    <input
                      type="text"
                      required
                      value={newQlLabel}
                      onChange={(e) => setNewQlLabel(e.target.value)}
                      placeholder="Judul menu di samping logo"
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      Target Kategori Berita (Opsional)
                    </label>
                    <select
                      value={newQlCategory}
                      onChange={(e) => setNewQlCategory(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px' }}
                    >
                      <option value="">-- Pilih Kategori Tujuan --</option>
                      {effectiveCategories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      Tipe Icon
                    </label>
                    <select
                      value={newQlIcon}
                      onChange={(e) => setNewQlIcon(e.target.value)}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px' }}
                    >
                      <option value="none">Tanpa Icon (Teks Biasa)</option>
                      <option value="menu">Icon Menu Hamburg (☰)</option>
                      <option value="badge">Badge Merah Plus (A+)</option>
                    </select>
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#f1f5f9' }}>
                    <input
                      type="checkbox"
                      checked={newQlHighlighted}
                      onChange={(e) => setNewQlHighlighted(e.target.checked)}
                      style={{ accentColor: '#ef4444' }}
                    />
                    Tandai Sebagai Menu Khusus (Font Tebal + Warna Spesial)
                  </label>

                  <button
                    type="submit"
                    style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                  >
                    <Plus size={16} /> Tambahkan ke Daftar Header Link
                  </button>
                </form>
              </div>

              {/* Quick Links List */}
              <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', padding: '24px', border: '1px solid #334155' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, marginTop: 0, marginBottom: '14px', color: '#a78bfa' }}>
                  Daftar Quick Links Aktif ({localHeaderSettings.quickLinks.length})
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {localHeaderSettings.quickLinks.map((item, idx) => (
                    <div
                      key={item.id}
                      style={{
                        backgroundColor: '#0f172a',
                        padding: '12px 14px',
                        borderRadius: '6px',
                        border: '1px solid #334155',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>#{idx + 1}</span>
                        {item.icon === 'menu' && <span style={{ color: '#38bdf8' }}>☰</span>}
                        {item.icon === 'badge' && <span style={{ backgroundColor: '#dc2626', color: '#ffffff', fontSize: '10px', fontWeight: 800, padding: '1px 4px', borderRadius: '2px' }}>A+</span>}
                        <div>
                          <strong style={{ color: '#ffffff', fontSize: '13px', display: 'block' }}>{item.label}</strong>
                          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                            {item.category ? `Kategori: ${item.category}` : 'Navigasi umum'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteQuickLink(item.id)}
                        style={{ backgroundColor: '#7f1d1d', border: 'none', color: '#fca5a5', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                        title="Hapus Link"
                      >
                        <Trash2 size={12} /> Hapus
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: KELOLA KATEGORI (SUPERADMIN, EDITOR, AUTHOR) */}
        {activeTab === 'categories' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {/* Form Add New Category */}
            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', padding: '24px', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FolderPlus size={18} style={{ color: '#38bdf8' }} /> Buat Kategori Berita Baru
              </h3>

              <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.5, marginBottom: '16px' }}>
                Admin dapat menambah kategori berita secara terpisah 1 per 1. Kategori baru akan langsung sinkron ke menu navigasi header portal dan pilihan penulisan berita.
              </p>

              <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                    Nama Kategori Baru *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Contoh: Kesehatan, Pendidikan, Otomotif, Hukum..."
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSavingCategory}
                  style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <Plus size={16} /> {isSavingCategory ? 'Menyimpan...' : 'Tambah Kategori Baru'}
                </button>
              </form>
            </div>

            {/* Category List */}
            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', padding: '24px', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={18} style={{ color: '#a78bfa' }} /> Daftar Kategori Terdaftar ({effectiveCategories.length})
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                {effectiveCategories.map((cat) => {
                  const articleCount = articles.filter((a) => a.category.toLowerCase() === cat.toLowerCase()).length;
                  const isDefault = ['Beranda', 'Berita Terbaru', 'Nasional', 'Daerah', 'Pelayanan Publik'].includes(cat);

                  return (
                    <div
                      key={cat}
                      style={{
                        backgroundColor: '#0f172a',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: '1px solid #334155',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <strong style={{ color: '#ffffff', fontSize: '13px', display: 'block' }}>{cat}</strong>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{articleCount} berita</span>
                      </div>

                      {!isDefault && (user.role === 'superadmin' || user.role === 'editor') && (
                        <button
                          onClick={() => handleDeleteCategory(cat)}
                          style={{ backgroundColor: '#7f1d1d', border: 'none', color: '#fca5a5', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                          title="Hapus Kategori"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INSIGHT PEMBACA & BERITA TERPOPULER AUTOMATIC (ALL ROLES) */}
        {activeTab === 'insight' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Summary Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #38bdf8' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Total Pembaca Akumulatif</div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#38bdf8', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Eye size={22} /> {totalViews.toLocaleString('id-ID')}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Total pembaca berita</div>
              </div>

              <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #a78bfa' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Total Berita Terbit</div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#a78bfa', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={22} /> {articles.length}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Artikel terpublikasi</div>
              </div>

              <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #34d399' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Rata-Rata Pembaca / Berita</div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#34d399', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BarChart2 size={22} /> {articles.length > 0 ? Math.round(totalViews / articles.length).toLocaleString('id-ID') : 0}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Rerata ketertarikan pembaca</div>
              </div>

              <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px', border: '1px solid #f59e0b' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>Berita Terpopuler #1 Saat Ini</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', marginTop: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {sortedArticlesByViews[0]?.title || 'Belum ada data'}
                </div>
                <div style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 700, marginTop: '4px' }}>
                  👁️ {(sortedArticlesByViews[0]?.views || 0).toLocaleString('id-ID')} dibaca
                </div>
              </div>
            </div>

            {/* Automatic Ranking Table */}
            <div style={{ backgroundColor: '#1e293b', padding: '24px', borderRadius: '8px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={18} style={{ color: '#ef4444' }} /> Ranking Berita Terpopuler Otomatis Teratas (Berdasarkan Pembaca)
                </h3>
                <span style={{ fontSize: '12px', color: '#34d399', backgroundColor: '#0f172a', padding: '4px 10px', borderRadius: '20px', border: '1px solid #059669' }}>
                  🟢 Update Otomatis
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #334155', color: '#94a3b8' }}>
                      <th style={{ padding: '10px 12px', width: '70px' }}>Peringkat</th>
                      <th style={{ padding: '10px 12px' }}>Judul Berita</th>
                      <th style={{ padding: '10px 12px', width: '140px' }}>Kategori</th>
                      <th style={{ padding: '10px 12px', width: '130px' }}>Penulis</th>
                      <th style={{ padding: '10px 12px', width: '140px', textAlign: 'right' }}>Jumlah Pembaca</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedArticlesByViews.map((art, idx) => (
                      <tr key={art.id} style={{ borderBottom: '1px solid #334155' }}>
                        <td style={{ padding: '12px', fontWeight: 800, color: idx < 3 ? '#f59e0b' : '#94a3b8' }}>
                          {idx === 0 ? '🥇 #1' : idx === 1 ? '🥈 #2' : idx === 2 ? '🥉 #3' : `#${idx + 1}`}
                        </td>
                        <td style={{ padding: '12px', fontWeight: 700, color: '#f8fafc' }}>
                          {art.title}
                        </td>
                        <td style={{ padding: '12px' }}>
                          <span style={{ backgroundColor: '#0f172a', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', color: '#38bdf8', border: '1px solid #334155' }}>
                            {art.category}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: '#cbd5e1' }}>{art.author || 'Tim Redaksi'}</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: '#38bdf8' }}>
                          👁️ {(art.views || 0).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: INFOGRAPHICS & DATABOKS */}
        {activeTab === 'databoks' && (user.role === 'superadmin' || user.role === 'editor') && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Infographic Form */}
            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', padding: '24px', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginTop: 0, marginBottom: '16px' }}>
                Tambah Infografik Berita
              </h3>
              <form onSubmit={handleAddInfographic} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Judul Infografik</label>
                  <input
                    type="text"
                    required
                    value={infoTitle}
                    onChange={(e) => setInfoTitle(e.target.value)}
                    placeholder="Contoh: Peta Kekuatan Saham Perbankan..."
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>URL Gambar Infografik</label>
                  <input
                    type="url"
                    required
                    value={infoImageUrl}
                    onChange={(e) => setInfoImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px' }}
                  />
                </div>
                <button type="submit" style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '6px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                  Tambah Infografik
                </button>
              </form>
            </div>

            {/* Databoks Form */}
            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', padding: '24px', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginTop: 0, marginBottom: '16px' }}>
                Tambah Data / Databoks
              </h3>
              <form onSubmit={handleAddDataboks} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Judul Databoks</label>
                  <input
                    type="text"
                    required
                    value={dataTitle}
                    onChange={(e) => setDataTitle(e.target.value)}
                    placeholder="Contoh: Pertumbuhan GDP Kuartal II..."
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Kategori / Label Data</label>
                  <input
                    type="text"
                    value={dataCategory}
                    onChange={(e) => setDataCategory(e.target.value)}
                    placeholder="Makro Ekonomi"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Deskripsi Singkat Data</label>
                  <textarea
                    rows={3}
                    value={dataDesc}
                    onChange={(e) => setDataDesc(e.target.value)}
                    placeholder="Catatan analisis statistik singkat..."
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px' }}
                  />
                </div>
                <button type="submit" style={{ backgroundColor: '#0284c7', color: '#ffffff', border: 'none', padding: '10px', borderRadius: '6px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                  Tambah Databoks
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB: TENTANG ASQI (BANNER MANAGEMENT) */}
        {activeTab === 'about_asqi' && (user.role === 'superadmin' || user.role === 'editor') && (
          <div style={{ backgroundColor: '#1e293b', padding: '28px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={20} color="#38bdf8" /> Pengaturan Banner / Logo "Tentang ASQI"
            </h3>
            <p style={{ margin: '0 0 24px 0', fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
              Upload gambar logo/banner ASQI asli secara langsung dan atur tautan tujuan ketika pengunjung mengeklik banner di halaman utama.
            </p>

            <form onSubmit={handleSaveAboutAsqi} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <ImageUploadInput
                  label="Upload Gambar / Logo ASQI Asli"
                  value={aboutLogoUrl}
                  onChange={(val) => setAboutLogoUrl(val)}
                  helperText="Klik atau tarik file gambar logo ASQI Anda ke kotak ini (PNG, JPG, WEBP, SVG) atau gunakan URL gambar."
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>
                    Judul Header Section
                  </label>
                  <input
                    type="text"
                    value={aboutTitle}
                    onChange={(e) => setAboutTitle(e.target.value)}
                    placeholder="Contoh: TENTANG ASQI"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid #334155',
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      fontSize: '14px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>
                    Tautan / Link Tujuan (URL)
                  </label>
                  <input
                    type="url"
                    value={aboutTargetUrl}
                    onChange={(e) => setAboutTargetUrl(e.target.value)}
                    placeholder="https://asqi.or.id/"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid #334155',
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      fontSize: '14px',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>
                  Nama Organisasi / Perusahaan (Opsional)
                </label>
                <input
                  type="text"
                  value={aboutCompanyName}
                  onChange={(e) => setAboutCompanyName(e.target.value)}
                  placeholder="Contoh: Asosiasi Service Quality Indonesia (ASQI)"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid #334155',
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    fontSize: '14px',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#e2e8f0', marginBottom: '6px' }}>
                  Deskripsi / Keterangan Singkat (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={aboutDescription}
                  onChange={(e) => setAboutDescription(e.target.value)}
                  placeholder="Keterangan singkat tentang ASQI (dapat dikosongkan jika gambar yang diunggah sudah berisi teks lengkap)."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid #334155',
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    fontSize: '14px',
                    resize: 'vertical',
                  }}
                />
              </div>

              {/* Pratinjau Tampilan Live */}
              <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '8px', border: '1px solid #334155' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Pratinjau Tampilan di Halaman Depan (Preview)
                </div>
                <div style={{ background: '#ffffff', borderRadius: '10px', padding: '16px', border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0284c7', marginBottom: '10px', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                    {aboutTitle || 'TENTANG ASQI'}
                  </div>
                  <a
                    href={aboutTargetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                  >
                    {aboutLogoUrl ? (
                      <img
                        src={aboutLogoUrl}
                        alt="Preview Logo ASQI"
                        style={{ maxWidth: '100%', maxHeight: '160px', objectFit: 'contain' }}
                      />
                    ) : (
                      <div style={{ color: '#94a3b8', fontSize: '13px', padding: '20px' }}>Belum ada gambar logo yang dipilih</div>
                    )}
                    {aboutCompanyName && <div style={{ fontSize: '14px', fontWeight: 700, color: '#0369a1' }}>{aboutCompanyName}</div>}
                    {aboutDescription && <div style={{ fontSize: '12px', color: '#475569', textAlign: 'center' }}>{aboutDescription}</div>}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="submit"
                  disabled={isSavingAbout}
                  style={{
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: isSavingAbout ? 'not-allowed' : 'pointer',
                    opacity: isSavingAbout ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  {isSavingAbout ? 'Menyimpan...' : 'Simpan Pengaturan tentang ASQI'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: USER & ROLE MANAGEMENT (SUPERADMIN ONLY) */}
        {activeTab === 'users' && user.role === 'superadmin' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
            {/* Create User Form */}
            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', padding: '24px', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} style={{ color: '#a78bfa' }} /> Tambah Pengguna Admin Baru
              </h3>

              <form onSubmit={handleCreateUser} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Nama Lengkap Pengguna *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Username *</label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="username_baru"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Password *</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>Peran / Hak Akses *</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as AdminRole)}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#ffffff', fontSize: '14px' }}
                  >
                    <option value="editor">Editor (Dapat mengelola Berita &amp; Databoks)</option>
                    <option value="author">Jurnalis (Hanya dapat menulis &amp; me-review Berita)</option>
                    <option value="superadmin">Super Admin (Akses Penuh &amp; User Management)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  style={{ backgroundColor: '#7c3aed', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', marginTop: '10px' }}
                >
                  Buat Pengguna Admin
                </button>
              </form>
            </div>

            {/* List of Admin Users */}
            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', padding: '24px', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginTop: 0, marginBottom: '16px' }}>
                Daftar Akun Pengguna Admin Terdaftar
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {adminUsers.map((u) => (
                  <div
                    key={u.id}
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', padding: '14px 18px', borderRadius: '6px', border: '1px solid #334155' }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>{u.name}</span>
                        {renderRoleBadge(u.role)}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                        Username: <code style={{ color: '#38bdf8' }}>{u.username}</code> • Dibuat: {u.createdAt || '2026-01-01'}
                      </div>
                    </div>

                    <div>
                      {u.username !== 'admin' && (
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          style={{ backgroundColor: '#991b1b', color: '#ffffff', border: 'none', padding: '6px 10px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Trash2 size={12} /> Hapus Akun
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM & DATABASE RESET (SUPERADMIN ONLY) */}
        {activeTab === 'system' && user.role === 'superadmin' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
            {/* Maintenance Mode Control Card */}
            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', padding: '24px', border: `2px solid ${maintenanceEnabled ? '#ef4444' : '#10b981'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Wrench size={20} style={{ color: maintenanceEnabled ? '#f87171' : '#34d399' }} /> Mode Perawatan (Maintenance Mode)
                </h3>
                <span
                  style={{
                    backgroundColor: maintenanceEnabled ? '#7f1d1d' : '#064e3b',
                    color: maintenanceEnabled ? '#fca5a5' : '#a7f3d0',
                    border: `1px solid ${maintenanceEnabled ? '#b91c1c' : '#059669'}`,
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: maintenanceEnabled ? '#ef4444' : '#10b981' }} />
                  {maintenanceEnabled ? 'MODE MAINTENANCE AKTIF' : 'WEBSITE AKTIF (NORMAL)'}
                </span>
              </div>

              <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#cbd5e1', marginBottom: '16px' }}>
                Aktifkan fitur ini jika Anda sedang melakukan pemeliharaan server, pembaruan skema, atau perbaikan jaringan. Saat aktif, pembaca umum akan diarahkan ke halaman khusus pemeliharaan sistem, sementara tim redaksi tetap dapat mengakses admin panel secara penuh.
              </p>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                  Pesan Pemeliharaan Sistem untuk Pembaca:
                </label>
                <textarea
                  rows={3}
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '6px',
                    border: '1px solid #475569',
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    fontSize: '13px',
                    lineHeight: 1.5,
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                {maintenanceEnabled ? (
                  <button
                    type="button"
                    disabled={isSavingMaintenance}
                    onClick={() => handleToggleMaintenance(false)}
                    style={{
                      backgroundColor: '#059669',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px 18px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flex: 1,
                      justifyContent: 'center',
                    }}
                  >
                    <Power size={16} /> {isSavingMaintenance ? 'Memproses...' : 'MATIKAN MODE MAINTENANCE (KEMBALI NORMAL)'}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSavingMaintenance}
                    onClick={() => handleToggleMaintenance(true)}
                    style={{
                      backgroundColor: '#dc2626',
                      color: '#ffffff',
                      border: 'none',
                      padding: '12px 18px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      flex: 1,
                      justifyContent: 'center',
                    }}
                  >
                    <Wrench size={16} /> {isSavingMaintenance ? 'Memproses...' : 'AKTIFKAN MODE MAINTENANCE'}
                  </button>
                )}
              </div>
            </div>

            {/* Database SQL Dump Export Card */}
            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', padding: '24px', border: '1px solid #38bdf8' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginTop: 0, marginBottom: '12px', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🗄️ Database SQL File (phpMyAdmin Ready)
              </h3>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#cbd5e1', marginBottom: '16px' }}>
                Seluruh berita, gambar, galeri, dan akun admin kini tersimpan terpusat di Server API. Anda dapat mengunduh skema &amp; isi data langsung dalam format file <code style={{ color: '#38bdf8' }}>.sql</code> untuk di-import ke <strong>phpMyAdmin / cPanel / MariaDB Hosting</strong> Anda.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a
                  href="/api/export-sql"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    padding: '12px 18px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    textAlign: 'center'
                  }}
                >
                  <Download size={16} /> Download File .SQL (asquinews_database.sql)
                </a>

                <button
                  type="button"
                  onClick={async () => {
                    await onRefreshData();
                    setMsg({ type: 'success', text: 'Data dari server backend berhasil disinkronkan!' });
                  }}
                  style={{
                    backgroundColor: '#0f172a',
                    color: '#38bdf8',
                    border: '1px solid #38bdf8',
                    padding: '10px 16px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <RefreshCw size={14} /> Sinkronkan Server Live Sekarang
                </button>
              </div>

              <div style={{ marginTop: '16px', padding: '10px', backgroundColor: '#0f172a', borderRadius: '6px', fontSize: '11px', color: '#94a3b8' }}>
                ℹ️ <strong>Informasi Koneksi SQL Hosting:</strong> Konfigurasi database MySQL dapat diatur melalui file <code style={{ color: '#f8fafc' }}>.env.example</code> (MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE).
              </div>
            </div>

            {/* System Status & Reset */}
            <div style={{ backgroundColor: '#1e293b', borderRadius: '8px', padding: '24px', border: '1px solid #334155' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginTop: 0, marginBottom: '16px', color: '#f8fafc' }}>
                Status Backend &amp; Data Persisten
              </h3>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#cbd5e1' }}>
                Sistem backend menggunakan Node.js + Express REST API dengan JSON Store persisten (<code style={{ color: '#38bdf8' }}>data/newsStore.json</code> &amp; <code style={{ color: '#38bdf8' }}>data/usersStore.json</code>) yang terhubung ke seluruh browser client secara otomatis.
              </p>

              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #334155' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#fca5a5', marginBottom: '10px' }}>
                  Reset Database Ke Data Sampel Awal
                </h4>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px' }}>
                  Jika Anda ingin mengembalikan sampel data berita ke keadaan bawaan awal, klik tombol di bawah ini.
                </p>
                <button
                  onClick={handleResetSeed}
                  style={{ backgroundColor: '#dc2626', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <RefreshCw size={14} /> Reset Data Sampel Awal
                </button>
              </div>
            </div>
          </div>
        )}
          </main>
        </div>
      </div>
    </div>
  );
};
