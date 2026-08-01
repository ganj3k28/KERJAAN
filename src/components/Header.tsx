import React from 'react';
import { Search, Settings, ShieldCheck } from 'lucide-react';

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
        <div className="logo" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <a href="/">A S Q I NEWS<span>.com</span></a>
          <span 
            className="admin-badge"
            title="Sistem Manajemen Konten Backend (Express + REST API)"
            style={{
              fontSize: '10px',
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              padding: '2px 6px',
              borderRadius: '12px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px'
            }}
          >
            <ShieldCheck size={11} /> Express API
          </span>
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
