import React from 'react';
import { Search, User, Menu, Crown } from 'lucide-react';
import { Logo } from './Logo';
import { HeaderSettings, HeaderQuickLink, SubscriberUser } from '../types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  headerSettings?: HeaderSettings;
  onSelectCategory?: (category: string) => void;
  onOpenLoginModal?: () => void;
  onOpenSubscribeModal?: () => void;
  onOpenLeftDrawer?: () => void;
  subscriberUser?: SubscriberUser | null;
  onLogoutSubscriber?: () => void;
}

const DEFAULT_HEADER_SETTINGS_FALLBACK: HeaderSettings = {
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

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  headerSettings,
  onSelectCategory,
  onOpenLoginModal,
  onOpenSubscribeModal,
  onOpenLeftDrawer,
  subscriberUser,
  onLogoutSubscriber,
}) => {
  const settings = headerSettings || DEFAULT_HEADER_SETTINGS_FALLBACK;

  const handleLinkClick = (item: HeaderQuickLink) => {
    if (item.icon === 'menu' || item.label.toLowerCase() === 'menu') {
      if (onOpenLeftDrawer) {
        onOpenLeftDrawer();
        return;
      }
    }

    if (item.category && onSelectCategory) {
      onSelectCategory(item.category);
    } else if (item.url) {
      if (item.url.startsWith('http')) {
        window.open(item.url, '_blank');
      } else if (onSelectCategory) {
        onSelectCategory(item.url);
      }
    } else if (onSelectCategory) {
      onSelectCategory('Beranda');
    }
  };

  return (
    <header className="top-header" style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
      <div
        className="top-header-container"
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        {/* LEFT SECTION: LOGO + QUICK LINKS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {/* LOGO */}
          <div className="logo" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                if (onSelectCategory) onSelectCategory('Beranda');
                else window.location.href = '/';
              }}
              style={{ display: 'inline-flex', alignItems: 'center' }}
            >
              <Logo height={36} />
            </a>
          </div>

          {/* QUICK LINKS RIGHT NEXT TO LOGO */}
          {settings.showQuickLinks && settings.quickLinks && settings.quickLinks.length > 0 && (
            <nav
              aria-label="Quick Links Header"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#1e293b',
              }}
            >
              {settings.quickLinks.map((item, index) => {
                const isPlusBadge = item.isHighlighted || item.icon === 'badge' || item.label.toLowerCase().includes('plus');

                return (
                  <React.Fragment key={item.id || index}>
                    {index > 0 && index === 2 && (
                      <span style={{ color: '#cbd5e1', fontWeight: 300, userSelect: 'none', margin: '0 2px' }}>|</span>
                    )}

                    <button
                      type="button"
                      onClick={() => handleLinkClick(item)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '4px 6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '14px',
                        fontWeight: isPlusBadge ? 700 : 600,
                        color: isPlusBadge ? '#0f172a' : '#334155',
                        transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#dc2626';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = isPlusBadge ? '#0f172a' : '#334155';
                      }}
                    >
                      {item.icon === 'menu' && <Menu size={18} style={{ color: '#0f172a' }} />}

                      {isPlusBadge && (
                        <span
                          style={{
                            backgroundColor: '#dc2626',
                            color: '#ffffff',
                            fontWeight: 800,
                            fontSize: '11px',
                            padding: '2px 5px',
                            borderRadius: '3px',
                            lineHeight: 1,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          A+
                        </span>
                      )}

                      <span>{item.label}</span>
                    </button>
                  </React.Fragment>
                );
              })}
            </nav>
          )}
        </div>

        {/* RIGHT SECTION: COMPACT SEARCH + SUBSCRIBE + LOGIN BUTTON */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto', flexWrap: 'nowrap' }}>
          {/* COMPACT SEARCH BOX */}
          {settings.showSearchBox && (
            <form
              onSubmit={onSearchSubmit}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                padding: '4px 10px',
                width: '180px',
                transition: 'all 0.2s ease',
              }}
            >
              <input
                type="text"
                placeholder="Cari berita..."
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
                aria-label="Cari Berita"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '2px',
                }}
              >
                <Search size={15} />
              </button>
            </form>
          )}

          {/* LANGGANAN (SUBSCRIBE) BUTTON */}
          <button
            type="button"
            onClick={onOpenSubscribeModal}
            style={{
              backgroundColor: settings.subscribeButtonBgColor || '#e11d48',
              color: '#ffffff',
              border: 'none',
              padding: '8px 18px',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 4px rgba(225, 29, 72, 0.2)',
              transition: 'opacity 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            <Crown size={15} />
            <span>{settings.subscribeButtonText || 'Langganan'}</span>
          </button>

          {/* MASUK (LOGIN) / SUBSCRIBER STATE BUTTON */}
          {subscriberUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                onClick={onOpenLeftDrawer}
                title="Lihat Status Langganan &amp; Menu"
                style={{
                  backgroundColor: '#0f172a',
                  color: '#ffffff',
                  border: '1px solid #334155',
                  padding: '7px 14px',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                }}
              >
                <Crown size={15} style={{ color: '#fbbf24' }} />
                <span>{subscriberUser.name}</span>
                <span
                  style={{
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 5px',
                    borderRadius: '3px',
                    lineHeight: 1,
                  }}
                >
                  AKSES KHUSUS
                </span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLoginModal}
              style={{
                backgroundColor: '#ffffff',
                color: '#0f172a',
                border: '1px solid #0f172a',
                padding: '7px 16px',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                transition: 'background-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              <User size={16} />
              <span>{settings.loginButtonText || 'Masuk'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
