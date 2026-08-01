import React from 'react';

interface LogoProps {
  height?: number | string;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({ height = 40, className = '', onClick }) => {
  return (
    <div 
      className={`asqi-logo-container ${className}`} 
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', display: 'inline-flex', alignItems: 'center' }}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 540 110" 
        style={{ height: typeof height === 'number' ? `${height}px` : height, width: 'auto', display: 'block' }}
        aria-label="ASQI NEWS.com"
      >
        {/* ASQI Navy Blue Slanted Block */}
        <polygon points="32,5 212,5 186,105 6,105" fill="#08204D" />
        
        {/* NEWS.com Bright Red Slanted Block */}
        <polygon points="218,5 534,5 508,105 192,105" fill="#E10600" />
        
        {/* ASQI Text */}
        <text 
          x="108" 
          y="78" 
          fontFamily="'Arial Black', 'Impact', 'Arial', sans-serif" 
          fontWeight="900" 
          fontStyle="italic" 
          fontSize="68" 
          fill="#FFFFFF" 
          textAnchor="middle" 
          letterSpacing="-1px"
        >
          ASQI
        </text>
        
        {/* NEWS.com Text */}
        <text 
          x="222" 
          y="78" 
          fontFamily="'Arial Black', 'Impact', 'Arial', sans-serif" 
          fontWeight="900" 
          fontStyle="italic" 
          fontSize="68" 
          fill="#FFFFFF" 
          letterSpacing="-1px"
        >
          NEWS<tspan fontSize="44" fontWeight="900" fontStyle="italic">.com</tspan>
        </text>
      </svg>
    </div>
  );
};
