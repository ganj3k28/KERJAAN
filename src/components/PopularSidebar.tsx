import React from 'react';
import { Eye, TrendingUp } from 'lucide-react';
import { NewsArticle } from '../types';

interface PopularSidebarProps {
  popularArticles: NewsArticle[];
  onArticleClick: (article: NewsArticle) => void;
}

export const PopularSidebar: React.FC<PopularSidebarProps> = ({
  popularArticles,
  onArticleClick,
}) => {
  // Sort articles by views descending to ensure most viewed articles are at the top automatically
  const sortedPopular = [...popularArticles].sort((a, b) => (b.views || 0) - (a.views || 0));

  return (
    <section className="section-block">
      <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={18} style={{ color: '#dc2626' }} /> Artikel Terpopuler
        </h3>
        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Otomatis Teratas</span>
      </div>
      <ol className="popular-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {sortedPopular.slice(0, 6).map((article, idx) => (
          <li
            key={article.id}
            className="popular-item"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '10px 0',
              borderBottom: '1px solid #e2e8f0',
            }}
          >
            <span
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: idx === 0 ? '#dc2626' : idx === 1 ? '#ea580c' : idx === 2 ? '#d97706' : '#94a3b8',
                minWidth: '22px',
                textAlign: 'center',
                lineHeight: 1.2,
              }}
            >
              0{idx + 1}
            </span>
            <div style={{ flex: 1 }}>
              <a
                href={`#popular-${article.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  onArticleClick(article);
                }}
                style={{
                  fontWeight: 700,
                  fontSize: '13px',
                  color: '#1e293b',
                  textDecoration: 'none',
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {article.title}
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', fontSize: '11px', color: '#64748b' }}>
                <span style={{ backgroundColor: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontWeight: 600, color: '#0369a1' }}>
                  {article.category}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600, color: '#0284c7' }}>
                  <Eye size={12} /> {(article.views || 0).toLocaleString('id-ID')} pembaca
                </span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};

