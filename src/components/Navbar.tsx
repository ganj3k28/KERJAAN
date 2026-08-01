import React from 'react';

interface NavbarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeCategory, onSelectCategory }) => {
  const categories = [
    'Telaah',
    'Sorot',
    'Analisis Data',
    'Infografis',
    'Opini',
    'Laporan Khusus',
    'Finansial',
    'Digital',
    'Monopedia',
    'Ekonomi Hijau',
    'Otomotif',
  ];

  return (
    <nav className="nav-bar">
      <div className="nav-container">
        {categories.map((cat) => (
          <a
            key={cat}
            href={`#${cat.toLowerCase()}`}
            className={activeCategory.toLowerCase() === cat.toLowerCase() ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory(cat);
            }}
          >
            {cat}
          </a>
        ))}
      </div>
    </nav>
  );
};
