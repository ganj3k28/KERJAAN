import React, { useState, useEffect } from 'react';
import { NewsArticle, DataboksItem, AboutAsqiData, GlobalAdsSettings } from '../types';
import { DataboksSection } from './DataboksSection';
import { AdBox } from './AdBox';
import { ArrowDown, Radio } from 'lucide-react';

interface NewsFeedSectionProps {
  articles: NewsArticle[];
  databoksItems: DataboksItem[];
  aboutAsqiData?: AboutAsqiData;
  globalAds?: GlobalAdsSettings;
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
  globalAds,
  activeCategory,
  searchQuery,
  onArticleClick,
  onSelectDataboks,
  onClearFilter,
}) => {
  const isMainView = activeCategory === 'Beranda' || activeCategory === 'Berita Terbaru' || activeCategory === 'Telaah' || !activeCategory;
  const isFiltered = !isMainView || searchQuery !== '';
  
  // Continuous vertical scroll pagination state
  const INITIAL_BATCH = 10;
  const [visibleCount, setVisibleCount] = useState<number>(INITIAL_BATCH);

  // Reset batch count if category or search changes
  useEffect(() => {
    setVisibleCount(INITIAL_BATCH);
  }, [activeCategory, searchQuery]);

  // Infinite scroll detector near bottom of window
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 600) {
        setVisibleCount((prev) => Math.min(prev + 5, articles.length));
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [articles.length]);

  const displayedArticles = articles.slice(0, visibleCount);
  const hasMore = visibleCount < articles.length;

  return (
    <section className="section-block">
      <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h3 style={{ margin: 0 }}>
            {searchQuery
              ? `Hasil Pencarian: "${searchQuery}"`
              : !isMainView
              ? `Kategori: ${activeCategory}`
              : 'Berita Terbaru'}
          </h3>
          {isMainView && !searchQuery && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '3px 9px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
              <Radio size={12} className="animate-pulse" /> LIVE STREAM
            </span>
          )}
        </div>

        {isFiltered ? (
          <button
            onClick={onClearFilter}
            style={{
              background: 'none',
              border: 'none',
              color: '#E10600',
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
        <>
          <div className="news-list" style={{ transition: 'all 0.3s ease' }}>
            {displayedArticles.map((article, index) => {
              return (
                <React.Fragment key={article.id}>
                  <article
                    className="news-item"
                    style={{
                      animation: 'fadeInUp 0.3s ease-out forwards',
                    }}
                  >
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
                                backgroundColor: '#E10600',
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
                          <span style={{ fontWeight: 600, color: '#08204D' }}>{article.category}</span> • {article.publishedAt.toUpperCase()} • <span style={{ color: '#E10600', fontWeight: 600 }}>👁️ {(article.views || 0).toLocaleString('id-ID')} dibaca</span>
                        </div>
                      </div>
                      <p className="news-snippet">{article.snippet}</p>
                    </div>
                  </article>

                  {/* Embed Tentang ASQI Widget after 2nd item if not searching */}
                  {index === 1 && !searchQuery && (
                    <DataboksSection databoksItems={databoksItems} onSelectDataboks={onSelectDataboks} aboutAsqiData={aboutAsqiData} />
                  )}

                  {/* Embed Feed Banner Ad after 3rd item */}
                  {index === 3 && globalAds?.feedMiddleBanner?.enabled && (
                    <AdBox ad={globalAds.feedMiddleBanner} placement="feed" />
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Continuous vertical scroll loading / trigger button */}
          {hasMore && (
            <div style={{ textAlign: 'center', marginTop: '24px', paddingBottom: '12px' }}>
              <button
                onClick={() => setVisibleCount((prev) => Math.min(prev + 10, articles.length))}
                style={{
                  backgroundColor: '#08204D',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 28px',
                  borderRadius: '24px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 10px rgba(8, 32, 77, 0.15)',
                  transition: 'all 0.2s ease',
                }}
              >
                <ArrowDown size={16} /> Tampilkan Berita Selanjutnya ({articles.length - visibleCount} Berita Lagi)
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

