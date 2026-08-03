import React, { useState, useEffect } from 'react';
import { NewsArticle } from '../types';

interface CarouselSectionProps {
  slides: NewsArticle[];
  onArticleClick: (article: NewsArticle) => void;
}

export const CarouselSection: React.FC<CarouselSectionProps> = ({ slides, onArticleClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides]);

  if (!slides || slides.length === 0) return null;

  const currentSlide = slides[currentIndex] || slides[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="main-carousel">
      <button className="carousel-nav-btn prev-btn" id="prevBtn" onClick={handlePrev}>
        &#10094;
      </button>
      <div
        className="carousel-slide"
        style={{ cursor: 'pointer' }}
        onClick={() => onArticleClick(currentSlide)}
      >
        <div className="carousel-image-wrapper">
          <img
            id="carouselImg"
            src={currentSlide.image}
            alt={currentSlide.title}
          />
        </div>
        <div className="carousel-overlay">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{
              background: '#0284c7',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 8px',
              borderRadius: '4px',
              display: 'inline-block',
              textTransform: 'uppercase'
            }}>
              {currentSlide.category}
            </span>

            {currentSlide.isPremium && (
              <span style={{
                background: '#e11d48',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '4px',
                display: 'inline-block'
              }}>
                🔒 AKSES KHUSUS
              </span>
            )}
          </div>
          <h2 id="carouselTitle">{currentSlide.title}</h2>
        </div>
      </div>
      <button className="carousel-nav-btn next-btn" id="nextBtn" onClick={handleNext}>
        &#10095;
      </button>
      <div className="carousel-indicators" id="indicators">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`dot ${idx === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
          />
        ))}
      </div>
    </section>
  );
};
