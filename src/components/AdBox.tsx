import React from 'react';
import { ExternalLink, Megaphone, X } from 'lucide-react';
import { AdBanner } from '../types';

interface AdBoxProps {
  ad?: AdBanner;
  placement?: 'header' | 'feed' | 'sidebar' | 'article' | 'floating';
  className?: string;
  style?: React.CSSProperties;
  onCloseFloating?: () => void;
}

export const AdBox: React.FC<AdBoxProps> = ({
  ad,
  placement = 'feed',
  style,
  onCloseFloating,
}) => {
  if (!ad || ad.enabled === false) {
    return null;
  }

  const badge = ad.badgeText || 'IKLAN';

  if (placement === 'floating') {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          maxWidth: '850px',
          width: 'calc(100% - 24px)',
          backgroundColor: '#0f172a',
          borderRadius: '10px',
          boxShadow: '0 20px 30px -10px rgba(0,0,0,0.5)',
          border: '2px solid #001e58',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          padding: '6px 12px',
          gap: '12px',
          ...style,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              backgroundColor: '#001e58',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '4px',
              letterSpacing: '0.05em',
            }}
          >
            {badge}
          </span>
        </div>

        <a
          href={ad.targetUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            textDecoration: 'none',
            color: '#ffffff',
            overflow: 'hidden',
          }}
        >
          {ad.imageUrl && (
            <img
              src={ad.imageUrl}
              alt={ad.title || 'Iklan Sponsorship'}
              style={{
                height: '48px',
                maxHeight: '48px',
                objectFit: 'contain',
                borderRadius: '4px',
              }}
            />
          )}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {ad.title || 'Sponsor Spesial ASQI NEWS'}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Klik untuk informasi selengkapnya</span>
              <ExternalLink size={12} />
            </div>
          </div>
        </a>

        {onCloseFloating && (
          <button
            onClick={onCloseFloating}
            style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
            title="Tutup Iklan"
          >
            <X size={16} />
          </button>
        )}
      </div>
    );
  }

  // Header Leaderboard Banner (728x90 style responsive)
  if (placement === 'header') {
    return (
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '12px auto',
          padding: '0 16px',
          boxSizing: 'border-box',
          ...style,
        }}
      >
        <div
          style={{
            position: 'relative',
            backgroundColor: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '6px',
              left: '8px',
              zIndex: 2,
              backgroundColor: 'rgba(0, 30, 88, 0.9)',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '3px',
              letterSpacing: '0.05em',
            }}
          >
            {badge}
          </div>

          <a
            href={ad.targetUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '70px',
              textDecoration: 'none',
              position: 'relative',
            }}
          >
            {ad.imageUrl ? (
              <img
                src={ad.imageUrl}
                alt={ad.title || 'Iklan Banner'}
                style={{
                  width: '100%',
                  maxHeight: '120px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            ) : (
              <div
                style={{
                  padding: '16px',
                  textAlign: 'center',
                  color: '#08204D',
                  fontWeight: 700,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Megaphone size={18} color="#E10600" />
                <span>{ad.title}</span>
                <ExternalLink size={14} />
              </div>
            )}
          </a>
        </div>
      </div>
    );
  }

  // Sidebar Ad Box (300x250 or responsive card)
  if (placement === 'sidebar') {
    return (
      <div
        style={{
          marginBottom: '20px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
          position: 'relative',
          ...style,
        }}
      >
        <div
          style={{
            padding: '6px 12px',
            backgroundColor: '#f1f5f9',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontSize: '10px',
              fontWeight: 800,
              color: '#001e58',
              letterSpacing: '0.05em',
            }}
          >
            {badge}
          </span>
          <span style={{ fontSize: '10px', color: '#64748b' }}>Mitra ASQI</span>
        </div>

        <a
          href={ad.targetUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'block',
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          {ad.imageUrl ? (
            <img
              src={ad.imageUrl}
              alt={ad.title || 'Iklan Sidebar'}
              style={{
                width: '100%',
                maxHeight: '260px',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          ) : (
            <div
              style={{
                padding: '24px 16px',
                textAlign: 'center',
                backgroundColor: '#001e58',
                color: '#ffffff',
              }}
            >
              <Megaphone size={28} color="#E10600" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '14px', fontWeight: 800, marginBottom: '6px' }}>{ad.title}</div>
              <div style={{ fontSize: '11px', color: '#cbd5e1' }}>Klik untuk melihat penawaran mitra</div>
            </div>
          )}

          {ad.title && ad.imageUrl && (
            <div
              style={{
                padding: '10px 12px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#08204D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTop: '1px solid #f1f5f9',
              }}
            >
              <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{ad.title}</span>
              <ExternalLink size={13} color="#E10600" />
            </div>
          )}
        </a>
      </div>
    );
  }

  // Feed or Article Ad Box
  return (
    <div
      style={{
        margin: '20px 0',
        backgroundColor: '#f8fafc',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
        position: 'relative',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '6px',
          right: '8px',
          zIndex: 2,
          backgroundColor: 'rgba(0, 30, 88, 0.9)',
          color: '#ffffff',
          fontSize: '10px',
          fontWeight: 800,
          padding: '2px 8px',
          borderRadius: '3px',
          letterSpacing: '0.05em',
        }}
      >
        {badge}
      </div>

      <a
        href={ad.targetUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          textDecoration: 'none',
          color: 'inherit',
        }}
      >
        {ad.imageUrl ? (
          <img
            src={ad.imageUrl}
            alt={ad.title || 'Iklan Sponsor'}
            style={{
              width: '100%',
              maxHeight: '180px',
              objectFit: 'cover',
              display: 'block',
            }}
          />
        ) : (
          <div
            style={{
              padding: '20px',
              textAlign: 'center',
              backgroundColor: '#08204D',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Megaphone size={24} color="#E10600" />
            <div style={{ fontSize: '14px', fontWeight: 800 }}>{ad.title}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8' }}>Dukungan Informasi Publik ASQI NEWS</div>
          </div>
        )}

        {ad.title && ad.imageUrl && (
          <div
            style={{
              padding: '8px 12px',
              backgroundColor: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              color: '#08204D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid #e2e8f0',
            }}
          >
            <span>{ad.title}</span>
            <ExternalLink size={13} color="#E10600" />
          </div>
        )}
      </a>
    </div>
  );
};
