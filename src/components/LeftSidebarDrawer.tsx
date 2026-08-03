import React from 'react';
import { X, Search, Crown, LogIn, LogOut, ChevronRight, Newspaper, BarChart2, Image, Video, Calendar, ShieldCheck, User } from 'lucide-react';
import { SubscriberUser } from '../types';
import { Logo } from './Logo';

interface LeftSidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  subscriberUser: SubscriberUser | null;
  onOpenSubscribeModal: () => void;
  onOpenLoginModal: () => void;
  onLogoutSubscriber: () => void;
  onOpenAdminPanel?: () => void;
  onNavigateToPage?: (path: string) => void;
}

export const LeftSidebarDrawer: React.FC<LeftSidebarDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  subscriberUser,
  onOpenSubscribeModal,
  onOpenLoginModal,
  onLogoutSubscriber,
  onOpenAdminPanel,
  onNavigateToPage,
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(3px)',
          zIndex: 99998,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '320px',
          maxWidth: '85vw',
          backgroundColor: '#ffffff',
          zIndex: 99999,
          boxShadow: '4px 0 25px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f8fafc',
          }}
        >
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('Beranda');
              onClose();
            }}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <Logo height={32} />
          </a>
          <button
            onClick={onClose}
            aria-label="Tutup Menu"
            style={{
              background: '#e2e8f0',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#334155',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Container */}
        <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* SEARCH BOX */}
          <form
            onSubmit={(e) => {
              onSearchSubmit(e);
              onClose();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '8px 12px',
            }}
          >
            <input
              type="text"
              placeholder="Cari berita atau isu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '13px',
                color: '#0f172a',
              }}
            />
            <button
              type="submit"
              aria-label="Cari"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
            >
              <Search size={16} />
            </button>
          </form>

          {/* SUBSCRIBER BANNER / CARD */}
          <div
            style={{
              backgroundColor: subscriberUser ? '#0f172a' : '#fff1f2',
              border: subscriberUser ? '1px solid #1e293b' : '1px solid #fecdd3',
              borderRadius: '8px',
              padding: '14px',
              color: subscriberUser ? '#ffffff' : '#881337',
            }}
          >
            {subscriberUser ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Crown size={18} style={{ color: '#fbbf24' }} />
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#fbbf24' }}>
                    Pelanggan Akses Khusus
                  </span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '2px' }}>{subscriberUser.name}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '10px' }}>
                  Paket: <span style={{ textTransform: 'uppercase', color: '#38bdf8' }}>{subscriberUser.plan}</span> (Aktif s/d {subscriberUser.expiresAt})
                </div>
                <button
                  onClick={() => {
                    onLogoutSubscriber();
                    onClose();
                  }}
                  style={{
                    backgroundColor: '#334155',
                    color: '#f8fafc',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <LogOut size={13} /> Keluar Akun Langganan
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Crown size={18} style={{ color: '#E10600' }} />
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#be123c' }}>
                    Berita Berbayar Akses Khusus
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#9f1239', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                  Nikmati investigasi mendalam, analisis ekonomi eksklusif, dan laporan khusus tanpa iklan.
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      onOpenSubscribeModal();
                      onClose();
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: '#E10600',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Langganan
                  </button>
                  <button
                    onClick={() => {
                      onOpenLoginModal();
                      onClose();
                    }}
                    style={{
                      flex: 1,
                      backgroundColor: '#ffffff',
                      color: '#be123c',
                      border: '1px solid #fda4af',
                      padding: '8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                  >
                    <User size={13} /> Masuk
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* NAV SECTION: KANAL & KATEGORI */}
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '10px',
              }}
            >
              Semua Kanal &amp; Kategori Berita
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {/* Specialized Link: Akses Khusus Berbayar */}
              <button
                onClick={() => {
                  onSelectCategory('Akses Khusus');
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  backgroundColor: activeCategory === 'Akses Khusus' ? '#ffe4e6' : '#fff1f2',
                  color: '#be123c',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Crown size={16} style={{ color: '#E10600' }} /> Berita Akses Khusus
                </span>
                <span
                  style={{
                    backgroundColor: '#E10600',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '10px',
                  }}
                >
                  PREMIUM
                </span>
              </button>

              {/* All Dynamic Categories */}
              {categories.map((cat) => {
                const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      onSelectCategory(cat);
                      onClose();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      backgroundColor: isActive ? '#f0f4f8' : 'transparent',
                      color: isActive ? '#08204D' : '#334155',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '13px',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Newspaper size={15} style={{ color: isActive ? '#E10600' : '#94a3b8' }} />
                      {cat}
                    </span>
                    <ChevronRight size={14} style={{ color: '#cbd5e1' }} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* MULTIMEDIA & DOKUMEN SECTION */}
          <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '10px',
              }}
            >
              Layanan Data &amp; Multimedia
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <button
                onClick={() => {
                  onSelectCategory('Databoks');
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#334155',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <BarChart2 size={15} style={{ color: '#E10600' }} /> Databoks &amp; Statistik Publik
              </button>

              <button
                onClick={() => {
                  onSelectCategory('Infografik');
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#334155',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Image size={15} style={{ color: '#16a34a' }} /> Infografik Interaktif
              </button>

              <button
                onClick={() => {
                  onSelectCategory('Video');
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#334155',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Video size={15} style={{ color: '#dc2626' }} /> Video Liputan
              </button>

              <button
                onClick={() => {
                  onSelectCategory('Event');
                  onClose();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  color: '#334155',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <Calendar size={15} style={{ color: '#d97706' }} /> Agenda &amp; Forum Publik
              </button>
            </div>
          </div>

          {/* REDAKSI & LAYANAN PAGES SECTION */}
          <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.5px' }}>
              REDAKSI &amp; INFORMASI
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {[
                { label: 'Tentang ASQI NEWS', path: '/tentang-asqi' },
                { label: 'Pedoman Media Siber', path: '/pedoman-media-siber' },
                { label: 'Siber & Hak Cipta', path: '/hak-cipta' },
                { label: 'Layanan Informasi Data', path: '/layanan-informasi-data' },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    if (onNavigateToPage) onNavigateToPage(item.path);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    color: '#0f172a',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>{item.label}</span>
                  <ChevronRight size={14} style={{ color: '#94a3b8' }} />
                </button>
              ))}
            </div>
          </div>

          {/* ADMIN CMS ACCESS LINK */}
          <div style={{ marginTop: 'auto', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
            <button
              onClick={() => {
                onOpenLoginModal();
                onClose();
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#f8fafc',
                color: '#334155',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <ShieldCheck size={16} style={{ color: '#08204D' }} /> Portal Admin Redaksi / CMS
            </button>
            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '11px', color: '#94a3b8' }}>
              &copy; {new Date().getFullYear()} Portal Berita Akses Khusus. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
