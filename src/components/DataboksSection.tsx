import React from 'react';
import { DataboksItem, AboutAsqiData } from '../types';

interface DataboksSectionProps {
  databoksItems?: DataboksItem[];
  onSelectDataboks?: (item: DataboksItem) => void;
  aboutAsqiData?: AboutAsqiData;
}

export const DataboksSection: React.FC<DataboksSectionProps> = ({ aboutAsqiData }) => {
  const sectionTitle = aboutAsqiData?.title || 'TENTANG ASQI';
  const targetUrl = aboutAsqiData?.targetUrl || 'https://asqi.or.id/';
  const logoUrl = aboutAsqiData?.logoUrl || '/asqi-logo-about.svg';
  const companyName = aboutAsqiData?.companyName;
  const description = aboutAsqiData?.description;

  const handleOpenAsqi = () => {
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="databoks-block"
      style={{
        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        border: '1px solid #cbd5e1',
        borderRadius: '12px',
        padding: '20px',
        color: '#0f172a',
        margin: '20px 0',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
      }}
    >
      <div className="databoks-header" style={{ marginBottom: '14px', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px' }}>
        <div className="databoks-logo" style={{ color: '#08204D', fontSize: '16px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {sectionTitle}
        </div>
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="see-all"
          style={{ color: '#E10600', fontWeight: 700, fontSize: '13px', textDecoration: 'none' }}
        >
          Kunjungi Situs Resmi ↗
        </a>
      </div>

      <div
        onClick={handleOpenAsqi}
        style={{
          cursor: 'pointer',
          background: '#ffffff',
          borderRadius: '10px',
          padding: '16px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          transition: 'all 0.25s ease',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = '#E10600';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 16px rgba(225, 6, 0, 0.12)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = '#e2e8f0';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.02)';
        }}
      >
        <img
          src={logoUrl}
          alt={companyName || 'Tentang ASQI'}
          style={{
            width: '100%',
            maxWidth: '520px',
            height: 'auto',
            maxHeight: '180px',
            objectFit: 'contain',
            display: 'block',
          }}
        />
        {(companyName || description) && (
          <div style={{ textAlign: 'center', maxWidth: '600px', marginTop: '4px' }}>
            {companyName && (
              <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 700, color: '#08204D' }}>
                {companyName}
              </h4>
            )}
            {description && (
              <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

