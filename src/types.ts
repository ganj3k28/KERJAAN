export interface AdBanner {
  id: string;
  title: string;
  imageUrl: string;
  targetUrl: string;
  badgeText?: string; // e.g. "IKLAN", "SPONSORSHIP", "PROMOSI"
  enabled: boolean;
  htmlScript?: string;
  placement?: 'header' | 'sidebar' | 'article_top' | 'article_middle' | 'article_bottom' | 'feed';
}

export interface ArticleAdsSettings {
  topAd?: AdBanner;     // Iklan Atas Berita (sebelum isi)
  middleAd?: AdBanner;  // Iklan Tengah Berita (di tengah/setelah pertengahan teks)
  bottomAd?: AdBanner;  // Iklan Bawah Berita (setelah isi artikel)
}

export interface GlobalAdsSettings {
  headerBanner?: AdBanner;     // Iklan Leaderboard Atas (dibawah navbar)
  feedMiddleBanner?: AdBanner; // Iklan Feed Tengah (antara carousel & feed)
  sidebarBanner1?: AdBanner;   // Iklan Sidebar Utama (diantara Terpopuler & Widget Event)
  sidebarBanner2?: AdBanner;   // Iklan Sidebar Sekunder (dibawah Video)
  footerBanner?: AdBanner;     // Iklan Floating Footer / Bottom
}

export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
  views: number;
  snippet: string;
  content: string;
  author: string;
  image: string; // Gambar Sampul Utama
  imageCaption?: string; // Keterangan foto utama
  middleImage?: string; // Gambar Sisipan Tengah Artikel
  middleImageCaption?: string; // Keterangan foto tengah
  galleryImages?: { url: string; caption?: string }[]; // Galeri Foto Tambahan
  isFeatured?: boolean;
  isPopular?: boolean;
  isPremium?: boolean; // Berita Berbayar Akses Khusus
  tags?: string[];
  articleAds?: ArticleAdsSettings; // Isian iklan spesifik per artikel
}

export interface Infographic {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
}

export interface DataboksItem {
  id: string;
  title: string;
  category?: string;
  description?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl?: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  location?: string;
  description?: string;
}

export type AdminRole = 'superadmin' | 'editor' | 'author';

export interface HeaderQuickLink {
  id: string;
  label: string;
  url?: string;
  category?: string;
  icon?: string;
  isHighlighted?: boolean;
}

export interface HeaderSettings {
  showQuickLinks: boolean;
  quickLinks: HeaderQuickLink[];
  subscribeButtonText: string;
  subscribeButtonBgColor: string;
  loginButtonText: string;
  showSearchBox: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  password?: string;
  name: string;
  role: AdminRole;
  createdAt?: string;
}

export interface SubscriberUser {
  id: string;
  email: string;
  name: string;
  plan: 'bulanan' | 'tahunan' | 'vip';
  subscribedAt: string;
  expiresAt: string;
  isSubscribed: boolean;
}

export interface AboutAsqiData {
  logoUrl?: string;
  targetUrl?: string;
  title?: string;
  companyName?: string;
  description?: string;
}

export interface InitialData {
  articles: NewsArticle[];
  carousel: NewsArticle[];
  infographics: Infographic[];
  databoks: DataboksItem[];
  videos: VideoItem[];
  events: EventItem[];
}
