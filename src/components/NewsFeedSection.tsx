import React from 'react';
import { NewsArticle, DataboksItem } from '../types';
import { DataboksSection } from './DataboksSection';

interface NewsFeedSectionProps {
  articles: NewsArticle[];
  databoksItems: DataboksItem[];
  activeCategory: string;
  searchQuery: string;
  onArticleClick: (article: NewsArticle) => void;
  onSelectDataboks?: (item: DataboksItem) => void;
  onClearFilter?: () => void;
}

export const NewsFeedSection: React.FC<NewsFeedSectionProps> = ({
  articles,
  databoksItems,
  activeCategory,
  searchQuery,
  onArticleClick,
  onSelectDataboks,
  onClearFilter,
}) => {
  const isFiltered = activeCategory !== 'Telaah' || searchQuery !== '';

  return (
    <section className="section-block">
      <div className="section-header">
        <h3>
          {searchQuery
            ? `Hasil Pencarian: "${searchQuery}"`
            : activeCategory !== 'Telaah'
            ? `Kategori: ${activeCategory}`
            : 'Berita Terbaru Lainnya'}
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
                      >
                        {article.title}
                      </a>
                      <div className="news-meta">
                        {article.category} • {article.publishedAt.toUpperCase()}
                      </div>
                    </div>
                    <p className="news-snippet">{article.snippet}</p>
                  </div>
                </article>

                {/* Embed Databoks Widget after 2nd item if not heavily filtered */}
                {index === 1 && databoksItems.length > 0 && !searchQuery && (
                  <DataboksSection databoksItems={databoksItems} onSelectDataboks={onSelectDataboks} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </section>
  );
};
