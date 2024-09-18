import React from 'react';
import { Article } from '@/types';
import { getThumbnailUrl } from '@/utils/mediaUrl';

interface HeroCardProps {
  article: Article;
}

const HeroCard: React.FC<HeroCardProps> = ({ article }) => {
  const thumbnailUrl = getThumbnailUrl(article);

  return (
    <div className="relative mb-10 overflow-hidden bg-white rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out flex md:flex-row lg:flex-row sm:flex-col">
      {/* Thumbnail with Blur Gradient */}
      <div className="relative w-full">
        <img
          src={thumbnailUrl}
          alt={article.attributes.Title}
          className="w-full h-64 object-cover md:h-96"
          style={{ filter: 'blur(0px)', transition: 'filter 0.3s ease' }}
        />
        {/* Apply gradient for smooth blur */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white pointer-events-none" 
          style={{
            backdropFilter: 'blur(55px)',
            maskImage: 'linear-gradient(to right, transparent, black)'
          }}
        ></div>
      </div>

      {/* Content */}
      <div className="inset-0 flex flex-col justify-end items-center p-6 text-zinc-800 w-full">
        <h2 className="text-3xl font-bold mb-2">{article.attributes.Title}</h2>
        <p className="text-lg mb-4">{article.attributes.Excerpt}</p>
        <a
          href={`/articles/${article.attributes.Slug}`}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-300"
        >
          Read More
        </a>
      </div>
    </div>
  );
};

export default HeroCard;
