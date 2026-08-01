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
import { Logo } from './components/Logo';

export default function App() {
  const [allArticles, setAllArticles] = useState<NewsArticle[]>(() => {
    try {
      const saved = localStorage.getItem('asqi_articles');
      return saved ? JSON.parse(saved) : initialData.articles;
    } catch {
      return initialData.articles;
    }
  });

  const [carouselSlides, setCarouselSlides] = useState<NewsArticle[]>(() => {
    try {
      const saved = localStorage.getItem('asqi_carousel');
      return saved ? JSON.parse(saved) : initialData.carousel;
    } catch {
      return initialData.carousel;
    }
  });

  const [infographics, setInfographics] = useState<Infographic[]>(() => {
    try {
      const saved = localStorage.getItem('asqi_infographics');
      return saved ? JSON.parse(saved) : initialData.infographics;
    } catch {
      return initialData.infographics;
    }
  });

  const [databoksItems, setDataboksItems] = useState<DataboksItem[]>(() => {
    try {
      const saved = localStorage.getItem('asqi_databoks');
      return saved ? JSON.parse(saved) : initialData.databoks;
    } catch {
      return initialData.databoks;
    }
  });

  const [videos, setVideos] = useState<VideoItem[]>(() => {
    try {
      const saved = localStorage.getItem('asqi_videos');
      return saved ? JSON.parse(saved) : initialData.videos;
    } catch {
      return initialData.videos;
    }
  });

  // Helper function to detect if admin route is requested anywhere (path, hash, or query)
  const checkIsAdmin = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const pathname = (window.location.pathname || '').toLowerCase();
    const hash = (window.location.hash || '').toLowerCase();
    const search = (window.location.search || '').toLowerCase();

    return (
      pathname.includes('/admin') ||
      pathname === 'admin' ||
      hash.includes('admin') ||
      search.includes('admin')
    );
  }, []);

  // Router path state (/ or /admin)
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname || '';
      const hash = window.location.hash || '';
      const search = window.location.search || '';

      if (pathname.includes('/admin') || hash.includes('admin') || search.includes('admin')) {
        return '/admin';
      }
      return pathname || '/';
    }
    return '/';
  });

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
    const handleLocationChange = () => {
      if (checkIsAdmin()) {
        setCurrentPath('/admin');
      } else {
        setCurrentPath(window.location.pathname || '/');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    // Keyboard shortcut (Ctrl + Shift + A or Cmd + Shift + A) to open admin
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigateTo('/admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Continuous location check for dynamic SPAs and hash/query updates
    const timer = setInterval(() => {
      const isAdminNow = checkIsAdmin();
      if (isAdminNow && currentPath !== '/admin') {
        setCurrentPath('/admin');
      } else if (!isAdminNow && currentPath === '/admin' && !window.location.pathname.includes('/admin')) {
        setCurrentPath(window.location.pathname || '/');
      }
    }, 200);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(timer);
    };
  }, [checkIsAdmin, currentPath]);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync data from localStorage
  const refreshLocalData = useCallback(() => {
    try {
      const savedArt = localStorage.getItem('asqi_articles');
      if (savedArt) setAllArticles(JSON.parse(savedArt));

      const savedCar = localStorage.getItem('asqi_carousel');
      if (savedCar) setCarouselSlides(JSON.parse(savedCar));

      const savedInfo = localStorage.getItem('asqi_infographics');
      if (savedInfo) setInfographics(JSON.parse(savedInfo));

      const savedData = localStorage.getItem('asqi_databoks');
      if (savedData) setDataboksItems(JSON.parse(savedData));

      const savedVid = localStorage.getItem('asqi_videos');
      if (savedVid) setVideos(JSON.parse(savedVid));
    } catch (e) {
      console.error('Error reading localStorage:', e);
    }
  }, []);

  // Fetch API data from Express backend with local fallback
  const fetchBackendData = useCallback(async () => {
    try {
      const [resNews, resCarousel, resInfo, resData, resVid] = await Promise.all([
        fetch('/api/news').then((r) => r.json()).catch(() => null),
        fetch('/api/carousel').then((r) => r.json()).catch(() => null),
        fetch('/api/infographics').then((r) => r.json()).catch(() => null),
        fetch('/api/databoks').then((r) => r.json()).catch(() => null),
        fetch('/api/videos').then((r) => r.json()).catch(() => null),
      ]);

      if (resNews?.success && Array.isArray(resNews.articles)) {
        setAllArticles(resNews.articles);
        try { localStorage.setItem('asqi_articles', JSON.stringify(resNews.articles)); } catch {}
      }
      if (resCarousel?.success && Array.isArray(resCarousel.slides)) {
        setCarouselSlides(resCarousel.slides);
        try { localStorage.setItem('asqi_carousel', JSON.stringify(resCarousel.slides)); } catch {}
      }
      if (resInfo?.success && Array.isArray(resInfo.infographics)) {
        setInfographics(resInfo.infographics);
        try { localStorage.setItem('asqi_infographics', JSON.stringify(resInfo.infographics)); } catch {}
      }
      if (resData?.success && Array.isArray(resData.databoks)) {
        setDataboksItems(resData.databoks);
        try { localStorage.setItem('asqi_databoks', JSON.stringify(resData.databoks)); } catch {}
      }
      if (resVid?.success && Array.isArray(resVid.videos)) {
        setVideos(resVid.videos);
        try { localStorage.setItem('asqi_videos', JSON.stringify(resVid.videos)); } catch {}
      }
    } catch {
      refreshLocalData();
    }
  }, [refreshLocalData]);

  // Initial fetch + Auto sync every 5 seconds & on tab focus
  useEffect(() => {
    fetchBackendData();

    const interval = setInterval(() => {
      fetchBackendData();
    }, 5000);

    const handleFocus = () => {
      fetchBackendData();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('visibilitychange', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('visibilitychange', handleFocus);
    };
  }, [fetchBackendData]);

  // Filter articles according to category and search query
  const filteredArticles = allArticles.filter((art) => {
    const matchesCategory =
      activeCategory === 'Telaah' ||
      !activeCategory ||
      art.category.toLowerCase() === activeCategory.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.tags && art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesCategory && matchesSearch;
  });

  const popularArticles = allArticles.filter((art) => art.isPopular);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleClearFilter = () => {
    setActiveCategory('Telaah');
    setSearchQuery('');
  };

  const normalizedPath = currentPath.toLowerCase().trim();
  const isAdminRoute = normalizedPath.includes('/admin') || normalizedPath === 'admin';

  // Dedicated Route for /admin
  if (isAdminRoute) {
    return (
      <AdminPage
        articles={allArticles}
        onRefreshData={refreshLocalData}
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
            articles={filteredArticles}
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
            <div style={{ marginBottom: '12px' }}>
              <Logo height={38} />
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
              REDAKSI &amp; LAYANAN
            </h4>
            <ul style={{ listStyle: 'none', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px', color: '#94a3b8' }}>
              <li>Tentang ASQI NEWS</li>
              <li>Pedoman Media Siber</li>
              <li>Siber &amp; Hak Cipta</li>
              <li>Layanan Informasi Data</li>
            </ul>
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
