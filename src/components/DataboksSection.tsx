import React from 'react';
import { DataboksItem } from '../types';

interface DataboksSectionProps {
  databoksItems: DataboksItem[];
  onSelectDataboks?: (item: DataboksItem) => void;
}

export const DataboksSection: React.FC<DataboksSectionProps> = ({ databoksItems, onSelectDataboks }) => {
  return (
    <div className="databoks-block">
      <div className="databoks-header">
        <div className="databoks-logo">databoks</div>
        <a href="#databoks" className="see-all" style={{ color: '#38bdf8' }}>
          Selengkapnya ›
        </a>
      </div>
      <div className="databoks-grid">
        {databoksItems.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="databoks-card"
            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
            onClick={() => onSelectDataboks && onSelectDataboks(item)}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <h5>{item.title}</h5>
          </div>
        ))}
      </div>
    </div>
  );
};
