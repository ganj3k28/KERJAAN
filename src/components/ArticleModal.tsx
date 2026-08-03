import React, { useEffect, useState } from 'react';
import { NewsArticle, SubscriberUser } from '../types';
import { X, Eye, Calendar, User, Share2, Tag, Bookmark, Lock, Crown, ShieldCheck } from 'lucide-react';

interface ArticleModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  onSelectRelated: (article: NewsArticle) => void;
  subscriberUser?: SubscriberUser | null;
  onOpenSubscribeModal?: () => void;
  onOpenLoginModal?: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  onSelectRelated,
  subscriberUser,
  onOpenSubscribeModal,
  onOpenLoginModal,
}) => {
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (article) {
      // Fetch article details & related from API
      fetch(`/api/news/${article.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.related) {
            setRelatedArticles(data.related);
          }
        })
        .catch((err) => console.error('Error fetching article detail:', err));
    }
  }, [article]);

  if (!article) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          border: '1px solid #e2e8f0',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            padding: '12px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#475569',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '24px 28px' }}>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.3,
              marginBottom: '16px',
            }}
          >
            {article.title}
          </h1>

          {/* Meta Info */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              fontSize: '13px',
              color: '#64748b',
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: '16px',
              marginBottom: '20px',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} color="#E10600" />
              <span>Oleh: <strong>{article.author || 'Tim Redaksi ASQI NEWS'}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} color="#E10600" />
              <span>{article.publishedAt}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Eye size={14} color="#E10600" />
              <span><strong>{(article.views || 1).toLocaleString('id-ID')}</strong> kali dibaca</span>
            </div>
          </div>

          {/* Main Hero Image */}
          <div
            style={{
              width: '100%',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '20px',
              backgroundColor: '#0f172a',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ maxHeight: '420px', overflow: 'hidden' }}>
              <img
                src={article.image}
                alt={article.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            {article.imageCaption && (
              <div
                style={{
                  padding: '8px 14px',
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

          {/* Article Lead/Snippet */}
          {article.snippet && (
            <div
              style={{
                fontSize: '15px',
                fontWeight: 600,
                color: '#1e293b',
                lineHeight: 1.6,
                marginBottom: '20px',
                padding: '12px 16px',
                backgroundColor: '#f1f5f9',
                borderLeft: '4px solid #08204D',
                borderRadius: '0 6px 6px 0',
              }}
            >
              {article.snippet}
            </div>
          )}

          {/* Article Body Content with Inline Middle Image & Paywall Check */}
          {(() => {
            const paragraphs = article.content.split('\n').filter((p) => p.trim() !== '');
            if (paragraphs.length === 0) return null;

            // Paywall logic: if article is premium and user is NOT a subscriber, show only lead + 1st paragraph + Paywall
            const isPaywalled = article.isPremium && !subscriberUser;

            if (isPaywalled) {
              return (
                <div style={{ fontSize: '15px', color: '#1e293b', lineHeight: 1.8, marginBottom: '28px' }}>
                  <p style={{ marginBottom: '16px' }}>{paragraphs[0]}</p>

                  {/* Paywall Container */}
                  <div
                    style={{
                      marginTop: '24px',
                      padding: '32px 24px',
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
                        width: '52px',
                        height: '52px',
                        backgroundColor: '#E10600',
                        borderRadius: '50%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '14px',
                      }}
                    >
                      <Lock size={26} color="#ffffff" />
                    </div>

                    <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px 0', color: '#ffffff' }}>
                      Artikel Ini Khusus Pelanggan Berbayar
                    </h3>
                    <p style={{ fontSize: '13px', color: '#cbd5e1', maxWidth: '480px', margin: '0 auto 20px auto', lineHeight: 1.5 }}>
                      Anda sedang mengakses berita berbayar eksklusif. Untuk membaca ulasan lengkap, hasil wawancara mendalam, dan grafik analisis data, silakan masuk atau berlangganan paket khusus.
                    </p>

                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => {
                          onClose();
                          if (onOpenSubscribeModal) onOpenSubscribeModal();
                        }}
                        style={{
                          backgroundColor: '#E10600',
                          color: '#ffffff',
                          border: 'none',
                          padding: '12px 22px',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '13px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 6px rgba(225, 29, 72, 0.3)',
                        }}
                      >
                        <Crown size={16} /> Berlangganan Akses Khusus
                      </button>

                      <button
                        onClick={() => {
                          onClose();
                          if (onOpenLoginModal) onOpenLoginModal();
                        }}
                        style={{
                          backgroundColor: '#ffffff',
                          color: '#0f172a',
                          border: 'none',
                          padding: '12px 22px',
                          borderRadius: '6px',
                          fontWeight: 700,
                          fontSize: '13px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        <User size={16} /> Masuk Akun Langganan
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
              <div style={{ fontSize: '15px', color: '#1e293b', lineHeight: 1.8, marginBottom: '28px' }}>
                {/* First half of paragraphs */}
                {firstPart.map((para, idx) => (
                  <p key={idx} style={{ marginBottom: '16px' }}>
                    {para}
                  </p>
                ))}

                {/* Inline Middle Image (Gambar Sisipan Tengah) */}
                {article.middleImage && (
                  <figure
                    style={{
                      margin: '24px 0',
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
                      style={{ width: '100%', maxHeight: '380px', objectFit: 'cover', display: 'block' }}
                    />
                    {article.middleImageCaption && (
                      <figcaption
                        style={{
                          padding: '10px 14px',
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

                {/* Second half of paragraphs */}
                {secondPart.map((para, idx) => (
                  <p key={`p2-${idx}`} style={{ marginBottom: '16px' }}>
                    {para}
                  </p>
                ))}
              </div>
            );
          })()}

          {/* Gallery / Extra Photos */}
          {article.galleryImages && article.galleryImages.length > 0 && (
            <div style={{ marginBottom: '28px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#08204D', textTransform: 'uppercase', marginTop: 0, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🖼️ DOKUMENTASI FOTO LIPUTAN TAMBAHAN
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                {article.galleryImages.map((imgItem, gIdx) => (
                  <div key={gIdx} style={{ borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1', backgroundColor: '#ffffff' }}>
                    <img src={imgItem.url} alt={imgItem.caption || 'Foto Galeri'} style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block' }} />
                    {imgItem.caption && (
                      <div style={{ padding: '6px 10px', fontSize: '11px', color: '#64748b', backgroundColor: '#ffffff' }}>
                        {imgItem.caption}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags & Actions */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              paddingTop: '16px',
              borderTop: '1px solid #e2e8f0',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <Tag size={15} color="#64748b" />
              {article.tags?.map((tag, idx) => (
                <span
                  key={idx}
                  style={{
                    fontSize: '12px',
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontWeight: 500,
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleShare}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: '#334155',
                }}
              >
                <Share2 size={14} /> {copied ? 'Link Tersalin!' : 'Bagikan'}
              </button>
              <button
                onClick={() => setIsSaved(!isSaved)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: isSaved ? '#eff6ff' : '#ffffff',
                  color: isSaved ? '#2563eb' : '#334155',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Bookmark size={14} /> {isSaved ? 'Tersimpan' : 'Simpan'}
              </button>
            </div>
          </div>

          {/* Related News */}
          {relatedArticles.length > 0 && (
            <div
              style={{
                backgroundColor: '#f8fafc',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
              }}
            >
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
                BERITA TERKAIT LAINNYA
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {relatedArticles.map((rel) => (
                  <div
                    key={rel.id}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      cursor: 'pointer',
                      alignItems: 'center',
                    }}
                    onClick={() => onSelectRelated(rel)}
                  >
                    <img
                      src={rel.image}
                      alt={rel.title}
                      style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <div>
                      <h5 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                        {rel.title}
                      </h5>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{rel.publishedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
