import React from 'react';
import { Logo } from './Logo';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
}) => {
  // Current Indonesian date format
  const today = new Date();
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const dateStr = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

  return (
    <header className="top-header">
      <div className="top-header-container">
        <div className="logo" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <a href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }} style={{ display: 'inline-flex', alignItems: 'center' }}>
            <Logo height={38} />
          </a>
        </div>

        <form onSubmit={onSearchSubmit} className="search-box">
          <input
            type="text"
            placeholder="Cari berita, data, atau topik..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" aria-label="Cari Berita">
            🔍
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="date-display">{dateStr}</div>
        </div>
      </div>
    </header>
  );
};

