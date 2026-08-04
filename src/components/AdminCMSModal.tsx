import React, { useState } from 'react';
import { NewsArticle, Infographic, DataboksItem } from '../types';
import { X, Plus, Trash2, Edit3, RefreshCw, CheckCircle, FileText, Image, Database } from 'lucide-react';
import { initialData } from '../initialData';

interface AdminCMSModalProps {
  articles: NewsArticle[];
  onClose: () => void;
  onRefreshData: () => void;
}

export const AdminCMSModal: React.FC<AdminCMSModalProps> = ({ articles, onClose, onRefreshData }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'infographics' | 'databoks'>('create');
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('INDUSTRI');
  const [author, setAuthor] = useState('Tim Redaksi ASQI');
  const [imageUrl, setImageUrl] = useState('');
  const [snippet, setSnippet] = useState('');
  const [content, setContent] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [tags, setTags] = useState('');

  // Infographic Form
  const [infoTitle, setInfoTitle] = useState('');
  const [infoImage, setInfoImage] = useState('');

  // Databoks Form
  const [dataTitle, setDataTitle] = useState('');
  const [dataDesc, setDataDesc] = useState('');

  const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleCreateArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category || !content) {
      showMessage('Judul, Kategori, dan Isi Berita wajib diisi!', 'error');
      return;
    }

    try {
      const saved = localStorage.getItem('asqi_articles');
      const articlesList: NewsArticle[] = saved ? JSON.parse(saved) : [...articles];

      const newArticle: NewsArticle = {
        id: 'art-' + Date.now(),
        title,
        category,
        author: author || 'Tim Redaksi ASQI',
        image: imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=800&q=80',
        publishedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase(),
        views: 0,
        snippet: snippet || content.substring(0, 150) + '...',
        content,
        isFeatured,
        isPopular,
        tags: tags ? tags.split(',').map(t => t.trim()) : [category],
      };

      articlesList.unshift(newArticle);
      localStorage.setItem('asqi_articles', JSON.stringify(articlesList));

      showMessage('Berita berhasil diterbitkan ke Penyimpanan Lokal!');
      setTitle('');
      setSnippet('');
      setContent('');
      setImageUrl('');
      setTags('');
      onRefreshData();
    } catch {
      showMessage('Terjadi kesalahan saat menyimpan berita', 'error');
    }
  };

  const handleDeleteArticle = (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;
    try {
      const saved = localStorage.getItem('asqi_articles');
      let articlesList: NewsArticle[] = saved ? JSON.parse(saved) : [...articles];
      articlesList = articlesList.filter((a) => a.id !== id);

      localStorage.setItem('asqi_articles', JSON.stringify(articlesList));
      showMessage('Berita berhasil dihapus!');
      onRefreshData();
    } catch {
      showMessage('Gagal menghapus berita', 'error');
    }
  };

  const handleAddInfographic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!infoTitle || !infoImage) return;
    try {
      const saved = localStorage.getItem('asqi_infographics');
      const infoList: Infographic[] = saved ? JSON.parse(saved) : initialData.infographics;

      const newInfo: Infographic = {
        id: 'info-' + Date.now(),
        title: infoTitle,
        imageUrl: infoImage,
        createdAt: 'Terbaru',
      };

      localStorage.setItem('asqi_infographics', JSON.stringify([newInfo, ...infoList]));
      showMessage('Infografik berhasil ditambahkan!');
      setInfoTitle('');
      setInfoImage('');
      onRefreshData();
    } catch {
      showMessage('Gagal menambah infografik', 'error');
    }
  };

  const handleAddDataboks = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataTitle) return;
    try {
      const saved = localStorage.getItem('asqi_databoks');
      const databoksList: DataboksItem[] = saved ? JSON.parse(saved) : initialData.databoks;

      const newItem: DataboksItem = {
        id: 'data-' + Date.now(),
        title: dataTitle,
        category: 'Data Ekonomi',
        description: dataDesc,
      };

      localStorage.setItem('asqi_databoks', JSON.stringify([newItem, ...databoksList]));
      showMessage('Item databoks berhasil ditambahkan!');
      setDataTitle('');
      setDataDesc('');
      onRefreshData();
    } catch {
      showMessage('Gagal menambah item databoks', 'error');
    }
  };

  const handleResetData = () => {
    if (!confirm('Reset seluruh berita ke data awal sampel?')) return;
    try {
      localStorage.removeItem('asqi_articles');
      localStorage.removeItem('asqi_carousel');
      localStorage.removeItem('asqi_infographics');
      localStorage.removeItem('asqi_databoks');
      localStorage.removeItem('asqi_videos');
      showMessage('Database berita berhasil di-reset!');
      onRefreshData();
    } catch {
      showMessage('Gagal reset database', 'error');
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(4px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>ASQI NEWS Content Management System</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>
              Express Backend API &amp; Persistensi Manajemen Konten Berita
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Status Notification */}
        {message && (
          <div
            style={{
              padding: '10px 24px',
              backgroundColor: message.type === 'success' ? '#dcfce7' : '#fee2e2',
              color: message.type === 'success' ? '#166534' : '#991b1b',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <CheckCircle size={16} />
            {message.text}
          </div>
        )}

        {/* Tab Navigation Bar */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            padding: '0 24px',
          }}
        >
          <button
            onClick={() => setActiveTab('create')}
            style={{
              padding: '12px 18px',
              fontSize: '13px',
              fontWeight: 700,
              border: 'none',
              borderBottom: activeTab === 'create' ? '3px solid #0284c7' : '3px solid transparent',
              background: 'none',
              color: activeTab === 'create' ? '#0284c7' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Plus size={15} /> Tambah Berita Baru
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            style={{
              padding: '12px 18px',
              fontSize: '13px',
              fontWeight: 700,
              border: 'none',
              borderBottom: activeTab === 'manage' ? '3px solid #0284c7' : '3px solid transparent',
              background: 'none',
              color: activeTab === 'manage' ? '#0284c7' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FileText size={15} /> Kelola Database Berita ({articles.length})
          </button>
          <button
            onClick={() => setActiveTab('infographics')}
            style={{
              padding: '12px 18px',
              fontSize: '13px',
              fontWeight: 700,
              border: 'none',
              borderBottom: activeTab === 'infographics' ? '3px solid #0284c7' : '3px solid transparent',
              background: 'none',
              color: activeTab === 'infographics' ? '#0284c7' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Image size={15} /> Infografik
          </button>
          <button
            onClick={() => setActiveTab('databoks')}
            style={{
              padding: '12px 18px',
              fontSize: '13px',
              fontWeight: 700,
              border: 'none',
              borderBottom: activeTab === 'databoks' ? '3px solid #0284c7' : '3px solid transparent',
              background: 'none',
              color: activeTab === 'databoks' ? '#0284c7' : '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Database size={15} /> Databoks
          </button>
        </div>

        {/* Tab Body Container */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'create' && (
            <form onSubmit={handleCreateArticle} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Judul Berita *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masukkan judul berita utama..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Kategori Berita *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  >
                    <option value="INDUSTRI">INDUSTRI</option>
                    <option value="ENERGI">ENERGI</option>
                    <option value="BURSA">BURSA</option>
                    <option value="TEKNOLOGI">TEKNOLOGI</option>
                    <option value="BERITA TERBARU">BERITA TERBARU</option>
                    <option value="OTOMOTIF">OTOMOTIF</option>
                    <option value="OPINI">OPINI</option>
                    <option value="EKONOMI HIJAU">EKONOMI HIJAU</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Penulis / Jurnalis
                  </label>
                  <input
                    type="text"
                    placeholder="Nama Penulis..."
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    URL Gambar Sampul
                  </label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Ringkasan / Snippet Berita
                </label>
                <input
                  type="text"
                  placeholder="Ringkasan singkat berita untuk feed..."
                  value={snippet}
                  onChange={(e) => setSnippet(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Isi Lengkap Artikel Berita *
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Tuliskan isi berita selengkapnya..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', lineHeight: 1.5 }}
                />
              </div>

              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                  />
                  Tampilkan di Headline Carousel Utama
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                  />
                  Tandai sebagai Artikel Terpopuler
                </label>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Tags (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  placeholder="Berita, Ekonomi, Properti..."
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  alignSelf: 'flex-start',
                }}
              >
                Terbitkan Berita Baru
              </button>
            </form>
          )}

          {activeTab === 'manage' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                  Total {articles.length} artikel tersimpan di Express Store.
                </span>
                <button
                  onClick={handleResetData}
                  style={{
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <RefreshCw size={13} /> Reset Seed Data Default
                </button>
              </div>

              <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1' }}>
                    <tr>
                      <th style={{ padding: '10px 12px' }}>Judul Berita</th>
                      <th style={{ padding: '10px 12px' }}>Kategori</th>
                      <th style={{ padding: '10px 12px' }}>Tanggal</th>
                      <th style={{ padding: '10px 12px' }}>Dibaca</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((art) => (
                      <tr key={art.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '10px 12px', fontWeight: 600, color: '#1e293b' }}>
                          {art.title.length > 50 ? art.title.substring(0, 50) + '...' : art.title}
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                            {art.category}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', color: '#64748b', fontSize: '12px' }}>
                          {art.publishedAt}
                        </td>
                        <td style={{ padding: '10px 12px', color: '#64748b' }}>
                          {art.views || 0}
                        </td>
                        <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                          <button
                            onClick={() => handleDeleteArticle(art.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                            }}
                            title="Hapus berita"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'infographics' && (
            <form onSubmit={handleAddInfographic} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Judul Infografik
                </label>
                <input
                  type="text"
                  required
                  placeholder="Judul infografik baru..."
                  value={infoTitle}
                  onChange={(e) => setInfoTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  URL Gambar Infografik
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={infoImage}
                  onChange={(e) => setInfoImage(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>
              <button
                type="submit"
                style={{
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  alignSelf: 'flex-start',
                }}
              >
                Tambah Infografik
              </button>
            </form>
          )}

          {activeTab === 'databoks' && (
            <form onSubmit={handleAddDataboks} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Judul Ringkasan Databoks
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Gempa Bumi M 5.1 Guncang Filipina..."
                  value={dataTitle}
                  onChange={(e) => setDataTitle(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Keterangan Singkat
                </label>
                <input
                  type="text"
                  placeholder="Deskripsi singkat..."
                  value={dataDesc}
                  onChange={(e) => setDataDesc(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>
              <button
                type="submit"
                style={{
                  backgroundColor: '#0284c7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  alignSelf: 'flex-start',
                }}
              >
                Tambah Databoks
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
