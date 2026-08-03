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

export interface InitialData {
  articles: NewsArticle[];
  carousel: NewsArticle[];
  infographics: Infographic[];
  databoks: DataboksItem[];
  videos: VideoItem[];
  events: EventItem[];
}
