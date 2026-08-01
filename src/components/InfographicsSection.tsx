import React from 'react';
import { Infographic } from '../types';

interface InfographicsSectionProps {
  infographics: Infographic[];
  onSelectInfographic: (infographic: Infographic) => void;
}

export const InfographicsSection: React.FC<InfographicsSectionProps> = ({
  infographics,
  onSelectInfographic,
}) => {
  return (
    <section className="section-block">
      <div className="section-header">
        <h3>Infografik Terbaru</h3>
        <a href="#infografis" className="see-all">
          Lihat semua ›
        </a>
      </div>
      <div className="infographic-grid">
        {infographics.slice(0, 4).map((info) => (
          <div
            key={info.id}
            className="info-card"
            style={{ cursor: 'pointer' }}
            onClick={() => onSelectInfographic(info)}
            title={info.title}
          >
            <img src={info.imageUrl} alt={info.title} />
          </div>
        ))}
      </div>
    </section>
  );
};
