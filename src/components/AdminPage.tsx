import React, { useState, useEffect } from 'react';
import { Shield, Lock, UserCheck, Key, LogOut, ExternalLink, Plus, Trash2, Edit, RefreshCw, Layers, FileText, BarChart2, Users, AlertCircle, CheckCircle, Download, Wrench, Power } from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { NewsArticle, Infographic, DataboksItem, AdminUser, AdminRole } from '../types';
import { initialData } from '../initialData';
import { Logo } from './Logo';
import { ImageUploadInput } from './ImageUploadInput';

const DEFAULT_ADMIN_USERS: AdminUser[] = [
  { id: 'usr-1', username: 'admin', name: 'Super Admin ASQI', role: 'superadmin' },
  { id: 'usr-2', username: 'editor', name: 'Chief Editor', role: 'editor' },
  { id: 'usr-3', username: 'jurnalis', name: 'Jurnalis Senior', role: 'author' },
];

interface AdminPageProps {
  articles: NewsArticle[];
  onRefreshData: () => void;
  onNavigateHome: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  articles,
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
  const [activeTab, setActiveTab] = useState<'articles' | 'databoks' | 'users' | 'system'>('articles');

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
                  <span style={{ color: '#94a3b8', fontSize: '11px' }}>Akses penuh: Berita, Databoks, Kelola User &amp; Reset</span>
                </div>
                <span style={{ fontSize: '11px', backgroundColor: '#3b82f6', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>admin123</span>
              </button>

              <button
                type="button"
                onClick={() => fillQuickLogin('editor', 'editor123')}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#0f172a', border: '1px solid #0284c7', borderRadius: '6px', color: '#ffffff', cursor: 'pointer', textAlign: 'left', fontSize: '12px' }}
              >
                <div>
                  <strong style={{ color: '#38bdf8', display: 'block' }}>✏️ Chief Editor (editor)</strong>
                  <span style={{ color: '#94a3b8', fontSize: '11px' }}>Kelola &amp; hapus Berita, Infografik, Databoks</span>
                </div>
                <span style={{ fontSize: '11px', backgroundColor: '#0284c7', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>editor123</span>
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
                <span style={{ fontSize: '11px', backgroundColor: '#10b981', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>jurnalis123</span>
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

        {/* Tab Navigation Menu */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #334155', paddingBottom: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {(user.role === 'superadmin' || user.role === 'editor' || user.role === 'author') && (
            <button
              onClick={() => setActiveTab('articles')}
              style={{
                backgroundColor: activeTab === 'articles' ? '#0284c7' : '#1e293b',
                color: '#ffffff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <FileText size={16} /> Kelola Artikel Berita
            </button>
          )}

          {(user.role === 'superadmin' || user.role === 'editor') && (
            <button
              onClick={() => setActiveTab('databoks')}
              style={{
                backgroundColor: activeTab === 'databoks' ? '#0284c7' : '#1e293b',
                color: '#ffffff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <BarChart2 size={16} /> Infografik &amp; Databoks
            </button>
          )}

          {user.role === 'superadmin' && (
            <button
              onClick={() => setActiveTab('users')}
              style={{
                backgroundColor: activeTab === 'users' ? '#7c3aed' : '#1e293b',
                color: '#ffffff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Users size={16} /> Hak Akses &amp; Manajemen User Admin
            </button>
          )}

          {user.role === 'superadmin' && (
            <button
              onClick={() => setActiveTab('system')}
              style={{
                backgroundColor: activeTab === 'system' ? '#475569' : '#1e293b',
                color: '#ffffff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Layers size={16} /> System &amp; Reset DB
            </button>
          )}
        </div>

        {/* TAB 1: ARTICLES MANAGEMENT (SUPERADMIN, EDITOR, AUTHOR) */}
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
                    <option value="Berita Terbaru">Berita Terbaru</option>
                    <option value="Nasional">Nasional</option>
                    <option value="Daerah">Daerah</option>
                    <option value="Pelayanan Publik">Pelayanan Publik</option>
                    <option value="PROFIL TOKOH PELAYANAN">PROFIL TOKOH PELAYANAN</option>
                    <option value="BUMN & BUMD">BUMN &amp; BUMD</option>
                    <option value="KORPORASI">KORPORASI</option>
                    <option value="Bisnis">Bisnis</option>
                    <option value="ASQI">ASQI</option>
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
                    Tampilkan di Carousel Slider Headline Utama
                  </label>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px' }}>
                    <input type="checkbox" checked={isPopular} onChange={(e) => setIsPopular(e.target.checked)} />
                    Tandai Berita Terpopuler
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
                          <span style={{ color: '#38bdf8' }}>{art.category}</span> • Oleh: {art.author} • {art.publishedAt}
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

        {/* TAB 2: INFOGRAPHICS & DATABOKS (SUPERADMIN & EDITOR) */}
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
      </div>
    </div>
  );
};
