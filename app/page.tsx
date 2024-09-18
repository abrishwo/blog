"use client"
import { useEffect, useState } from 'react';
import { fetchArticles } from '../utils/api';
import { getThumbnailUrl } from '@/utils/mediaUrl';
import { Article, ArticlesResponse } from '../types';
import HeroCard from './components/HeroCard';
import TagsFilter from './components/TagsFilter';
export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);

  useEffect(() => {
    const loadArticles = async () => {
      const pageSize = 6; // Number of articles per page
      const response: ArticlesResponse = await fetchArticles(currentPage, pageSize);

      setArticles(response.data);
      setFilteredArticles(response.data);
      setTotalPages(response.meta.pagination.totalPages);
    };

    loadArticles();
  }, [currentPage]);

  const handleFilterChange = (filteredArticles: Article[]) => {
    setFilteredArticles(filteredArticles.length > 0 ? filteredArticles : articles);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const featuredArticle = articles.find(article => article.attributes.Featured);
  const nonFeaturedArticles = articles.filter(article => !article.attributes.Featured);

  
  const displayedArticles = nonFeaturedArticles.slice(0, 6);

  return (
    <div className="container mx-auto px-4 py-8">
           
            <TagsFilter onFilterChange={handleFilterChange} />
     
      {featuredArticle && <HeroCard article={featuredArticle} />}


      {/* Grid for Non-Featured Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 mt-10 lg:grid-cols-3 gap-8">
        {displayedArticles.map((article: Article) => (
          <div
            key={article.id}
            className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 bg-white"
          >
            {/* Thumbnail */}
            {article.attributes.Thumbnail && (
              <img
                
                src={getThumbnailUrl(article)}
                alt={article.attributes.Title}
                className="w-full h-48 object-cover"
              />
            )}

            {/* Content */}
            <div className="p-6">
              {/* Title */}
              <h2 className="text-2xl font-semibold mb-2">{article.attributes.Title}</h2>

              {/* Date */}
              <p className="text-sm text-gray-500 mb-2">{new Date(article.attributes.Date).toLocaleDateString()}</p>

              {/* Excerpt */}
              <p className="text-gray-700 mb-4">{article.attributes.Excerpt}</p>

              {/* Content Snippet */}
            

              {/* Read More Link */}
              <a
                href={`/articles/${article.attributes.Slug}`}
                className="text-blue-600 hover:underline font-semibold"
              >
                Read more
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handlePreviousPage}
          className="mx-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          className="mx-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
