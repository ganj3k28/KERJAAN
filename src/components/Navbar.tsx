import React from 'react';

interface NavbarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeCategory, onSelectCategory }) => {
  const categories = [
    'Beranda',
    'Berita Terbaru',
    'Nasional',
    'Daerah',
    'Pelayanan Publik',
    'PROFIL TOKOH PELAYANAN',
    'BUMN & BUMD',
    'KORPORASI',
    'Bisnis',
    'ASQI',
  ];

  return (
    <nav className="nav-bar">
      <div className="nav-container">
        {categories.map((cat) => {
          const isActive =
            activeCategory.toLowerCase() === cat.toLowerCase() ||
            (cat === 'Beranda' && (activeCategory === 'Beranda' || !activeCategory));

          return (
            <a
              key={cat}
              href={`#${cat.toLowerCase().replace(/\s+/g, '-')}`}
              className={isActive ? 'active' : ''}
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory(cat);
              }}
            >
              {cat}
            </a>
          );
        })}
      </div>
    </nav>
  );
};

