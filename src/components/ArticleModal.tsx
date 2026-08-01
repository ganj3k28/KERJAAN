import React, { useEffect, useState } from 'react';
import { NewsArticle } from '../types';
import { X, Eye, Calendar, User, Share2, Tag, Bookmark } from 'lucide-react';

interface ArticleModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  onSelectRelated: (article: NewsArticle) => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose, onSelectRelated }) => {
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
                backgroundColor: '#0284c7',
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
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
              ASQI NEWS Exclusives
            </span>
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
              <User size={14} color="#0284c7" />
              <span>Oleh: <strong>{article.author || 'Tim Redaksi ASQI NEWS'}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={14} color="#0284c7" />
              <span>{article.publishedAt}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Eye size={14} color="#0284c7" />
              <span>{article.views || 1} dibaca</span>
            </div>
          </div>

          {/* Main Image */}
          <div
            style={{
              width: '100%',
              maxHeight: '400px',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '20px',
              backgroundColor: '#0f172a',
            }}
          >
            <img
              src={article.image}
              alt={article.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {/* Article Lead/Snippet */}
          <div
            style={{
              fontSize: '15px',
              fontWeight: 600,
              color: '#334155',
              lineHeight: 1.6,
              marginBottom: '20px',
              padding: '12px 16px',
              backgroundColor: '#f8fafc',
              borderLeft: '4px solid #0284c7',
              borderRadius: '0 6px 6px 0',
            }}
          >
            {article.snippet}
          </div>

          {/* Full Paragraphs */}
          <div
            style={{
              fontSize: '15px',
              color: '#1e293b',
              lineHeight: 1.8,
              marginBottom: '28px',
              whiteSpace: 'pre-line',
            }}
          >
            {article.content}
          </div>

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
