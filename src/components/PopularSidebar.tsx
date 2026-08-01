import React from 'react';
import { NewsArticle } from '../types';

interface PopularSidebarProps {
  popularArticles: NewsArticle[];
  onArticleClick: (article: NewsArticle) => void;
}

export const PopularSidebar: React.FC<PopularSidebarProps> = ({
  popularArticles,
  onArticleClick,
}) => {
  return (
    <section className="section-block">
      <div className="section-header">
        <h3>Artikel Terpopuler</h3>
      </div>
      <ol className="popular-list">
        {popularArticles.slice(0, 5).map((article) => (
          <li key={article.id} className="popular-item">
            <a
              href={`#popular-${article.id}`}
              onClick={(e) => {
                e.preventDefault();
                onArticleClick(article);
              }}
            >
              {article.title}
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
};
