import React from 'react';
import { NewsArticle, DataboksItem, AboutAsqiData } from '../types';
import { DataboksSection } from './DataboksSection';

interface NewsFeedSectionProps {
  articles: NewsArticle[];
  databoksItems: DataboksItem[];
  aboutAsqiData?: AboutAsqiData;
  activeCategory: string;
  searchQuery: string;
  onArticleClick: (article: NewsArticle) => void;
  onSelectDataboks?: (item: DataboksItem) => void;
  onClearFilter?: () => void;
}

export const NewsFeedSection: React.FC<NewsFeedSectionProps> = ({
  articles,
  databoksItems,
  aboutAsqiData,
  activeCategory,
  searchQuery,
  onArticleClick,
  onSelectDataboks,
  onClearFilter,
}) => {
  const isMainView = activeCategory === 'Beranda' || activeCategory === 'Berita Terbaru' || activeCategory === 'Telaah' || !activeCategory;
  const isFiltered = !isMainView || searchQuery !== '';

  return (
    <section className="section-block">
      <div className="section-header">
        <h3>
          {searchQuery
            ? `Hasil Pencarian: "${searchQuery}"`
            : !isMainView
            ? `Kategori: ${activeCategory}`
            : 'Berita Terbaru'}
        </h3>
        {isFiltered ? (
          <button
            onClick={onClearFilter}
            style={{
              background: 'none',
              border: 'none',
              color: '#0284c7',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Tampilkan Semua ›
          </button>
        ) : (
          <a href="#indeks" className="see-all">
            Indeks berita ›
          </a>
        )}
      </div>

      {articles.length === 0 ? (
        <div style={{ padding: '40px 0', textAlign: 'center', color: '#64748b' }}>
          <p style={{ fontSize: '15px', fontWeight: 600 }}>Tidak ada berita ditemukan</p>
          <p style={{ fontSize: '13px', marginTop: '4px' }}>Cobalah mencari dengan kata kunci lain atau pilih kategori berbeda.</p>
        </div>
      ) : (
        <div className="news-list">
          {articles.map((article, index) => {
            return (
              <React.Fragment key={article.id}>
                <article className="news-item">
                  <img
                    className="news-thumbnail"
                    src={article.image}
                    alt={article.title}
                    style={{ cursor: 'pointer' }}
                    onClick={() => onArticleClick(article)}
                  />
                  <div className="news-content">
                    <div>
                      <a
                        href={`#read-${article.id}`}
                        className="news-title"
                        onClick={(e) => {
                          e.preventDefault();
                          onArticleClick(article);
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}
                      >
                        {article.isPremium && (
                          <span
                            style={{
                              backgroundColor: '#e11d48',
                              color: '#ffffff',
                              fontSize: '10px',
                              fontWeight: 800,
                              padding: '2px 6px',
                              borderRadius: '3px',
                              lineHeight: 1,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                            }}
                          >
                            🔒 AKSES KHUSUS
                          </span>
                        )}
                        <span>{article.title}</span>
                      </a>
                      <div className="news-meta">
                        <span style={{ fontWeight: 600, color: '#0369a1' }}>{article.category}</span> • {article.publishedAt.toUpperCase()} • <span style={{ color: '#0284c7', fontWeight: 600 }}>👁️ {(article.views || 0).toLocaleString('id-ID')} dibaca</span>
                      </div>
                    </div>
                    <p className="news-snippet">{article.snippet}</p>
                  </div>
                </article>

                {/* Embed Tentang ASQI Widget after 2nd item if not searching */}
                {index === 1 && !searchQuery && (
                  <DataboksSection databoksItems={databoksItems} onSelectDataboks={onSelectDataboks} aboutAsqiData={aboutAsqiData} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </section>
  );
};
