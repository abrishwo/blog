"use client"
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  date: string;
};

const Home: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch articles from your Strapi API or mock data
    fetch('/api/articles') // Adjust the endpoint accordingly
      .then((response) => response.json())
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((error) => console.error('Error fetching articles:', error));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Stars and Toques Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <div key={article.id} className="bg-white shadow-md rounded-lg p-6">
            <Link href={`/article/${article.slug}`}>
              <a>
                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <span className="text-sm text-gray-500">{new Date(article.date).toLocaleDateString()}</span>
              </a>
            </Link>
          </div>
        ))}
      </div>
      {/* Add pagination controls here if needed */}
    </div>
  );
};

export default Home;
