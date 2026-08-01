import React, { useEffect, useState, useCallback } from 'react';
import { NewsArticle, Infographic, DataboksItem, VideoItem } from './types';
import { initialData } from './initialData';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { CarouselSection } from './components/CarouselSection';
import { InfographicsSection } from './components/InfographicsSection';
import { NewsFeedSection } from './components/NewsFeedSection';
import { PopularSidebar } from './components/PopularSidebar';
import { EventWidget } from './components/EventWidget';
import { VideoSection } from './components/VideoSection';
import { ArticleModal } from './components/ArticleModal';
import { AdminPage } from './components/AdminPage';
import { SubscribeModal } from './components/SubscribeModal';
import { VideoModal } from './components/VideoModal';

export default function App() {
  const [articles, setArticles] = useState<NewsArticle[]>(initialData.articles);
  const [carouselSlides, setCarouselSlides] = useState<NewsArticle[]>(initialData.carousel);
  const [popularArticles, setPopularArticles] = useState<NewsArticle[]>(initialData.articles);
  const [infographics, setInfographics] = useState<Infographic[]>(initialData.infographics);
  const [databoksItems, setDataboksItems] = useState<DataboksItem[]>(initialData.databoks);
  const [videos, setVideos] = useState<VideoItem[]>(initialData.videos);

  // Router path state (/ or /admin)
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);

  // Filter & Search states
  const [activeCategory, setActiveCategory] = useState<string>('Telaah');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [selectedInfographic, setSelectedInfographic] = useState<Infographic | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [showSubscribeModal, setShowSubscribeModal] = useState<boolean>(false);

  // Router listener
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fetch API data from Express backend
  const fetchBackendData = useCallback(async () => {
    try {
      // Fetch articles with current category & search filters
      let newsUrl = '/api/news';
      const params = new URLSearchParams();
      if (activeCategory && activeCategory !== 'Telaah') {
        params.append('category', activeCategory);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (params.toString()) {
        newsUrl += `?${params.toString()}`;
      }

      const [resNews, resCarousel, resPopular, resInfo, resData, resVid] = await Promise.all([
        fetch(newsUrl).then((r) => r.json()),
        fetch('/api/carousel').then((r) => r.json()),
        fetch('/api/popular').then((r) => r.json()),
        fetch('/api/infographics').then((r) => r.json()),
        fetch('/api/databoks').then((r) => r.json()),
        fetch('/api/videos').then((r) => r.json()),
      ]);

      if (resNews.success) setArticles(resNews.articles);
      if (resCarousel.success) setCarouselSlides(resCarousel.slides);
      if (resPopular.success) setPopularArticles(resPopular.popular);
      if (resInfo.success) setInfographics(resInfo.infographics);
      if (resData.success) setDataboksItems(resData.databoks);
      if (resVid.success) setVideos(resVid.videos);
    } catch (err) {
      console.warn('Fallback to local state (API connecting...):', err);
    }
  }, [activeCategory, searchQuery]);

  useEffect(() => {
    fetchBackendData();
  }, [fetchBackendData]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBackendData();
  };

  const handleClearFilter = () => {
    setActiveCategory('Telaah');
    setSearchQuery('');
  };

  // Dedicated Route for /admin
  if (currentPath === '/admin' || currentPath.startsWith('/admin')) {
    return (
      <AdminPage
        articles={articles}
        onRefreshData={fetchBackendData}
        onNavigateHome={() => navigateTo('/')}
      />
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Navigation Menu */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSearchQuery('');
        }}
      />

      {/* Main Container */}
      <div className="container" style={{ flex: 1 }}>
        {/* Main Content Left */}
        <main className="main-content">
          {/* Main Carousel / Headline (shown on main page view) */}
          {activeCategory === 'Telaah' && !searchQuery && (
            <CarouselSection
              slides={carouselSlides}
              onArticleClick={(article) => setSelectedArticle(article)}
            />
          )}

          {/* Infografik Terbaru */}
          {activeCategory === 'Telaah' && !searchQuery && (
            <InfographicsSection
              infographics={infographics}
              onSelectInfographic={(info) => setSelectedInfographic(info)}
            />
          )}

          {/* Berita Terbaru Feed */}
          <NewsFeedSection
            articles={articles}
            databoksItems={databoksItems}
            activeCategory={activeCategory}
            searchQuery={searchQuery}
            onArticleClick={(article) => setSelectedArticle(article)}
            onSelectDataboks={(databoksItem) => {
              // Open a simple preview or search related to databoks item
              setSearchQuery(databoksItem.title.split(' ')[0]);
            }}
            onClearFilter={handleClearFilter}
          />
        </main>

        {/* Sidebar Right */}
        <aside className="sidebar">
          {/* Artikel Terpopuler */}
          <PopularSidebar
            popularArticles={popularArticles}
            onArticleClick={(article) => setSelectedArticle(article)}
          />

          {/* Kalender Event */}
          <EventWidget onSubscribeClick={() => setShowSubscribeModal(true)} />

          {/* Video Section */}
          <VideoSection
            videos={videos}
            onPlayVideo={(video) => setSelectedVideo(video)}
          />

          {/* Ad Banner Placeholder */}
          <div className="ad-box">GIIAS 2026 ADVERTISEMENT</div>
        </aside>
      </div>

      {/* Professional Footer */}
      <footer
        style={{
          backgroundColor: '#0b2545',
          color: '#94a3b8',
          padding: '40px 16px 20px',
          marginTop: '40px',
          borderTop: '4px solid #0056b3',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '32px',
            paddingBottom: '30px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', marginBottom: '10px' }}>
              A S Q I NEWS<span style={{ color: '#38bdf8', fontWeight: 400 }}>.com</span>
            </div>
            <p style={{ fontSize: '13px', lineHeight: 1.6 }}>
              Portal berita ekonomi, bisnis, investasi, dan teknologi terkemuka dengan analisis data mendalam serta liputan independen berstandar jurnalisme profesional.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
              KATEGORI UTAMA
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li><a href="#telaah" onClick={() => handleClearFilter()} style={{ color: '#94a3b8' }}>Telaah &amp; Sorot</a></li>
              <li><a href="#analisis" onClick={() => setActiveCategory('Analisis Data')}>Analisis Data &amp; Databoks</a></li>
              <li><a href="#finansial" onClick={() => setActiveCategory('Finansial')}>Finansial &amp; Pasarmodal</a></li>
              <li><a href="#otomotif" onClick={() => setActiveCategory('Otomotif')}>Otomotif &amp; Industri</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: '#ffffff', fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>
              SISTEM BACKEND &amp; API
            </h4>
            <p style={{ fontSize: '12px', lineHeight: 1.6, marginBottom: '10px' }}>
              Node.js + Express API Backend dengan arsitektur RESTful &amp; Firestore/JSON store.
            </p>
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/admin');
              }}
              style={{
                color: '#38bdf8',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'underline',
              }}
            >
              Akses Admin Portal (/admin)
            </a>
          </div>
        </div>

        <div
          style={{
            maxWidth: '1200px',
            margin: '20px auto 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '12px',
          }}
        >
          <div>© {new Date().getFullYear()} ASQI NEWS.com. Hak Cipta Dilindungi Undang-Undang.</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#terms">Syarat &amp; Ketentuan</a>
            <a href="#privacy">Kebijakan Privasi</a>
            <a href="#pedoman">Pedoman Siber</a>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onSelectRelated={(art) => setSelectedArticle(art)}
        />
      )}

      {selectedInfographic && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15,23,42,0.85)',
            backdropFilter: 'blur(4px)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={() => setSelectedInfographic(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              maxWidth: '800px',
              width: '100%',
              overflow: 'hidden',
              padding: '16px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px', color: '#0f172a' }}>
              {selectedInfographic.title}
            </h3>
            <img
              src={selectedInfographic.imageUrl}
              alt={selectedInfographic.title}
              style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: '6px' }}
            />
          </div>
        </div>
      )}

      {showSubscribeModal && (
        <SubscribeModal onClose={() => setShowSubscribeModal(false)} />
      )}

      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </div>
  );
}
