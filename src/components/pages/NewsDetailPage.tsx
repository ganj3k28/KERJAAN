import React, { useEffect, useState } from 'react';
import { NewsArticle, SubscriberUser, VideoItem } from '../../types';
import {
  ArrowLeft,
  Calendar,
  Eye,
  User,
  Share2,
  Tag,
  Bookmark,
  Lock,
  Crown,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { PopularSidebar } from '../PopularSidebar';
import { EventWidget } from '../EventWidget';
import { VideoSection } from '../VideoSection';

interface NewsDetailPageProps {
  article: NewsArticle;
  allArticles: NewsArticle[];
  subscriberUser?: SubscriberUser | null;
  onNavigateHome: () => void;
  onSelectArticle: (article: NewsArticle) => void;
  onOpenSubscribeModal?: () => void;
  onOpenLoginModal?: () => void;
  videos: VideoItem[];
  onPlayVideo: (video: VideoItem) => void;
}

export const NewsDetailPage: React.FC<NewsDetailPageProps> = ({
  article,
  allArticles,
  subscriberUser,
  onNavigateHome,
  onSelectArticle,
  onOpenSubscribeModal,
  onOpenLoginModal,
  videos,
  onPlayVideo,
}) => {
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (article?.id) {
      document.title = `${article.title} - ASQI NEWS.com`;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', article.snippet || article.title);

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', article.title);

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', article.snippet || article.title);

      const ogImg = document.querySelector('meta[property="og:image"]');
      if (ogImg) ogImg.setAttribute('content', article.image);

      const ogUrl = document.querySelector('meta[property="og:url"]');
      if (ogUrl) ogUrl.setAttribute('content', window.location.href);

      fetch(`/api/news/${article.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.related) {
            setRelatedArticles(data.related);
          } else {
            // fallback related by category
            const rel = allArticles
              .filter((a) => a.id !== article.id && a.category === article.category)
              .slice(0, 4);
            setRelatedArticles(rel);
          }
        })
        .catch(() => {
          const rel = allArticles
            .filter((a) => a.id !== article.id && a.category === article.category)
            .slice(0, 4);
          setRelatedArticles(rel);
        });
    }
  }, [article?.id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const popularArticles = [...allArticles].sort((a, b) => (b.views || 0) - (a.views || 0));

  return (
    <div className="container" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
      <main className="main-content">
        {/* Navigation / Breadcrumb */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            paddingBottom: '12px',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          <button
            onClick={onNavigateHome}
            style={{
              background: 'none',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#E10600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ArrowLeft size={16} /> Kembali ke Beranda
          </button>
          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
            Beranda › {article.category}
          </span>
        </div>

        {/* Article Body Container */}
        <article
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '28px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
            marginBottom: '32px',
          }}
        >
          {/* Header Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span
              style={{
                backgroundColor: '#08204D',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '4px',
                textTransform: 'uppercase',
              }}
            >
              {article.category}
            </span>

            {article.isPremium && (
              <span
                style={{
                  backgroundColor: '#E10600',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Crown size={12} /> AKSES KHUSUS BERBAYAR
              </span>
            )}

            {subscriberUser && article.isPremium && (
              <span
                style={{
                  backgroundColor: '#16a34a',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <ShieldCheck size={12} /> TERBUKA
              </span>
            )}
          </div>

          {/* Article Title */}
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.3,
              marginBottom: '16px',
              fontFamily: 'serif',
            }}
          >
            {article.title}
          </h1>

          {/* Meta Info */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '18px',
              fontSize: '13px',
              color: '#64748b',
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: '16px',
              marginBottom: '24px',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={15} color="#E10600" />
              <span>
                Oleh: <strong>{article.author || 'Tim Redaksi ASQI NEWS'}</strong>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={15} color="#E10600" />
              <span>{article.publishedAt}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Eye size={15} color="#E10600" />
              <span>
                <strong>{(article.views || 1).toLocaleString('id-ID')}</strong> kali dibaca
              </span>
            </div>
          </div>

          {/* Main Hero Image */}
          <div
            style={{
              width: '100%',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '24px',
              backgroundColor: '#0f172a',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ maxHeight: '460px', overflow: 'hidden' }}>
              <img
                src={article.image}
                alt={article.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            {article.imageCaption && (
              <div
                style={{
                  padding: '10px 16px',
                  backgroundColor: '#f8fafc',
                  borderTop: '1px solid #e2e8f0',
                  fontSize: '12px',
                  color: '#64748b',
                  fontStyle: 'italic',
                }}
              >
                📷 {article.imageCaption}
              </div>
            )}
          </div>

          {/* Article Snippet/Lead */}
          {article.snippet && (
            <div
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1e293b',
                lineHeight: 1.6,
                marginBottom: '24px',
                padding: '14px 18px',
                backgroundColor: '#f1f5f9',
                borderLeft: '4px solid #08204D',
                borderRadius: '0 6px 6px 0',
              }}
            >
              {article.snippet}
            </div>
          )}

          {/* Article Content Paragraphs & Paywall */}
          {(() => {
            const paragraphs = article.content.split('\n').filter((p) => p.trim() !== '');
            if (paragraphs.length === 0) return null;

            const isPaywalled = article.isPremium && !subscriberUser;

            if (isPaywalled) {
              return (
                <div style={{ fontSize: '16px', color: '#1e293b', lineHeight: 1.8, marginBottom: '28px' }}>
                  <p style={{ marginBottom: '16px' }}>{paragraphs[0]}</p>

                  {/* Paywall Container */}
                  <div
                    style={{
                      marginTop: '28px',
                      padding: '36px 28px',
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      color: '#ffffff',
                      textAlign: 'center',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
                      border: '2px solid #E10600',
                    }}
                  >
                    <div
                      style={{
                        width: '56px',
                        height: '56px',
                        backgroundColor: '#E10600',
                        borderRadius: '50%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '16px',
                      }}
                    >
                      <Lock size={28} color="#ffffff" />
                    </div>

                    <h3 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 10px 0', color: '#ffffff' }}>
                      Artikel Ini Khusus Pelanggan Berbayar
                    </h3>
                    <p style={{ fontSize: '14px', color: '#cbd5e1', maxWidth: '520px', margin: '0 auto 24px auto', lineHeight: 1.6 }}>
                      Anda sedang mengakses berita berbayar eksklusif. Untuk membaca ulasan lengkap, hasil wawancara mendalam, dan grafik analisis data, silakan masuk atau berlangganan paket khusus.
                    </p>

                    <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        onClick={onOpenSubscribeModal}
                        style={{
                          backgroundColor: '#E10600',
                          color: '#ffffff',
                          border: 'none',
                          padding: '12px 24px',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 6px rgba(225, 29, 72, 0.3)',
                        }}
                      >
                        <Crown size={18} /> Berlangganan Akses Khusus
                      </button>

                      <button
                        onClick={onOpenLoginModal}
                        style={{
                          backgroundColor: '#ffffff',
                          color: '#0f172a',
                          border: 'none',
                          padding: '12px 24px',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '14px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <User size={18} /> Masuk Akun Langganan
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            const middleIndex = article.middleImage ? Math.max(1, Math.floor(paragraphs.length / 2)) : paragraphs.length;
            const firstPart = paragraphs.slice(0, middleIndex);
            const secondPart = paragraphs.slice(middleIndex);

            return (
              <div style={{ fontSize: '16px', color: '#1e293b', lineHeight: 1.8, marginBottom: '28px' }}>
                {firstPart.map((para, idx) => (
                  <p key={idx} style={{ marginBottom: '18px' }}>
                    {para}
                  </p>
                ))}

                {/* Inline Middle Image */}
                {article.middleImage && (
                  <figure
                    style={{
                      margin: '28px 0',
                      backgroundColor: '#f8fafc',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid #cbd5e1',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <img
                      src={article.middleImage}
                      alt={article.middleImageCaption || 'Gambar Sisipan Artikel'}
                      style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', display: 'block' }}
                    />
                    {article.middleImageCaption && (
                      <figcaption
                        style={{
                          padding: '10px 16px',
                          fontSize: '12px',
                          color: '#475569',
                          backgroundColor: '#f1f5f9',
                          borderTop: '1px solid #e2e8f0',
                          fontStyle: 'italic',
                        }}
                      >
                        📌 {article.middleImageCaption}
                      </figcaption>
                    )}
                  </figure>
                )}

                {secondPart.map((para, idx) => (
                  <p key={`p2-${idx}`} style={{ marginBottom: '18px' }}>
                    {para}
                  </p>
                ))}
              </div>
            );
          })()}

          {/* Extra Photo Gallery */}
          {article.galleryImages && article.galleryImages.length > 0 && (
            <div style={{ marginBottom: '28px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#08204D', textTransform: 'uppercase', marginTop: 0, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🖼️ DOKUMENTASI FOTO LIPUTAN TAMBAHAN
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                {article.galleryImages.map((imgItem, gIdx) => (
                  <div key={gIdx} style={{ borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1', backgroundColor: '#ffffff' }}>
                    <img src={imgItem.url} alt={imgItem.caption || 'Foto Galeri'} style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }} />
                    {imgItem.caption && (
                      <div style={{ padding: '8px 10px', fontSize: '11px', color: '#64748b', backgroundColor: '#ffffff' }}>
                        {imgItem.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags & Action Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
              paddingTop: '20px',
              borderTop: '1px solid #e2e8f0',
              marginBottom: '28px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <Tag size={16} color="#64748b" />
              {article.tags?.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '12px',
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontWeight: 600,
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleShare}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: '#334155',
                }}
              >
                {copied ? <Check size={15} color="#16a34a" /> : <Share2 size={15} />}
                {copied ? 'Link Tersalin!' : 'Bagikan'}
              </button>
              <button
                onClick={() => setIsSaved(!isSaved)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: isSaved ? '#eff6ff' : '#ffffff',
                  color: isSaved ? '#2563eb' : '#334155',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Bookmark size={15} /> {isSaved ? 'Tersimpan' : 'Simpan'}
              </button>
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div
              style={{
                backgroundColor: '#f8fafc',
                padding: '24px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
                BERITA TERKAIT LAINNYA
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                {relatedArticles.map((rel) => (
                  <div
                    key={rel.id}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      cursor: 'pointer',
                      alignItems: 'center',
                      backgroundColor: '#ffffff',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid #e2e8f0',
                      transition: 'transform 0.2s ease',
                    }}
                    onClick={() => onSelectArticle(rel)}
                  >
                    <img
                      src={rel.image}
                      alt={rel.title}
                      style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', marginBottom: '4px', lineHeight: 1.3 }}>
                        {rel.title}
                      </h5>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{rel.publishedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      {/* Right Sidebar */}
      <aside className="sidebar">
        <PopularSidebar popularArticles={popularArticles} onArticleClick={(art) => onSelectArticle(art)} />
        <EventWidget onSubscribeClick={onOpenSubscribeModal || (() => {})} />
        <VideoSection videos={videos} onPlayVideo={onPlayVideo} />
      </aside>
    </div>
  );
};
