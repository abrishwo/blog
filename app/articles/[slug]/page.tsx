"use client";

import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { fetchArticleBySlug } from '../../../utils/api';
import { Article } from '@/types';
// import Image from 'next/image';
import { getArticleGalleryImageUrl, getThumbnailUrl } from '@/utils/mediaUrl';

// Variants for animations
const containerVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50, damping: 10 } },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

const tagVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 50, damping: 10 } },
};

const galleryVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.2, staggerChildren: 0.1 } },
};

// The main article page component
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const article: Article = await fetchArticleBySlug(slug); // Fetch article based on slug

  if (!article) {
    return <div>Article not found</div>;
  }

  return (
    <motion.div 
      className="container mx-auto flex flex-col justify-between items-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Thumbnail Image */}
      {article.attributes.Images?.data[0]?.attributes.url && (
        <motion.div 
          className="mb-8 w-full py-10 flex flex-row item-center justify-evenly"
          initial="hidden"
          animate="visible"
          variants={imageVariants}
        >
          <img 
            src={`${getThumbnailUrl(article)}`}
            alt={article.attributes.Title}
          
            className="rounded-lg shadow-lg w-2/3 h-64 md:h-96"
          />


                {/* Image Gallery */}
      {article.attributes.Images?.data.length > 0 && (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8"
          initial="hidden"
          animate="visible"
          variants={galleryVariants}
        >
          {article.attributes.Images.data.slice(0).map((image, index) => (
            <motion.div 
              key={index} 
              className="relative w-full h-48"
              variants={imageVariants}
            >
              <img 
                src={`${getArticleGalleryImageUrl(image)}`}
                alt={`Gallery Image ${index + 1}`}
               
                className="rounded-lg shadow-md w-2/3"
              />
            </motion.div>
          ))}
        </motion.div>
      )}

        </motion.div>
      )}

      {/* Article Title */}
      <motion.h1 
        className="text-4xl font-bold mb-6 text-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {article.attributes.Title}
      </motion.h1>

      {/* Article Content */}
      <motion.div 
        className="prose max-w-none mb-8 mt-5 text-gray-700"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <ReactMarkdown>{article.attributes.Content}</ReactMarkdown>
      </motion.div>

      {/* Tags */}
      <motion.div 
        className="flex flex-wrap justify-center mb-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {article.attributes.tags?.data?.length > 0 && article.attributes.tags.data.map((tag, index) => (
          <motion.span 
            key={index} 
            className="tag bg-blue-500 text-white rounded-full px-4 py-1 m-2 shadow-md cursor-pointer"
            whileHover={{ scale: 1.1, boxShadow: '0px 0px 8px rgb(0, 0, 0)' }}
            transition={{ type: 'spring', stiffness: 200, damping: 10 }}
            variants={tagVariants}
          >
            {tag.attributes.Name}
          </motion.span>
        ))}
      </motion.div>



      {/* Similar Articles Section */}
      {/* You can fetch similar articles based on tags or categories */}
      <motion.div 
        className="mt-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <h2 className="text-3xl font-semibold mb-6 text-center">Similar Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Map over similar articles */}
          {/* Replace with fetched data */}
          {[1, 2, 3].map((item) => (
            <motion.div 
              key={item} 
              className="p-4 border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-xl font-semibold mb-2">Similar Article {item}</h3>
              <p className="text-gray-600">This is a brief description of a similar article...</p>
              <a href="#" className="text-blue-600 hover:underline">Read More</a>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
