"use client";
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { unified } from 'unified';
import markdown from 'remark-parse';
import stringify from 'remark-stringify';
import { visit } from 'unist-util-visit';

import { fetchAboutUs } from '../../utils/api';
import { motion } from 'framer-motion';
import { AboutPageData, About } from '../../types'; 
import { getAboutThumbnailUrl } from '@/utils/mediaUrl';


interface MarkdownContent {
  title: string;
  paragraph: string;
}

const extractHeaderAndParagraph = (markdownContent: string): MarkdownContent => {
  let title = '';
  let paragraph = '';
  
  const tree = unified()
    .use(markdown)
    .parse(markdownContent);

  visit(tree, 'heading', (node) => {
    if (node.depth === 1) { // Extract the first top-level header
      title = node.children.map(child => child.data?.hName).join('');
    }
  });

  visit(tree, 'paragraph', (node) => {
    if (!paragraph) { // Extract the first paragraph
      paragraph = node.children.map(child => child.data?.hName).join('');
    }
  });

  return { title, paragraph };
};
const AboutPage = () => {
  const [aboutData, setAboutData] = useState<About[]>([]); 
  const [isLoading, setIsLoading] = useState(false); 
  const [extractedContent, setExtractedContent] = useState<MarkdownContent | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchAboutUs(); // Adjust this to your actual API endpoint
    
      setAboutData(response.data);

      const firstContent = response.data[0]?.attributes.Content || '';
      const { title, paragraph } = extractHeaderAndParagraph(firstContent);
      setExtractedContent({ title, paragraph });
    };
    fetchData();
  }, []);

  if (!aboutData.length) return <p>Loading...</p>;

  // if (isLoading) return <p className="text-center text-xl font-semibold">Loading...</p>;

  return (
    <>
      {aboutData[0] && ( 
        <div className="container mx-auto px-4 py-10 flex flex-col items-center">
          {/* Hero Section */}
          {/* {extractedContent && (
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">{extractedContent.title}</h1>
          <p className="text-lg text-gray-600">{extractedContent.paragraph}</p>
        </div>
      )} */}
      
     
          {/* <div className="lg:w-1/2 flex flex-col items-center lg:items-start lg:pr-8"> */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left flex flex-col items-center justify-between"
            >
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-800">
                {aboutData[0].attributes.Title}
              </h1>

               {/* Image Section */}
          {aboutData[0].attributes.Image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 mt-8 lg:mt-0 flex justify-center"
            >
              <img
                src={getAboutThumbnailUrl(aboutData[0])}
                alt={aboutData[0].attributes.Title}
                className="w-1/3 h-auto rounded-lg shadow-lg"
              />
            </motion.div>
          )}

<div className="lg:w-3/4 flex flex-col items-center lg:items-start lg:pr-8">
              <ReactMarkdown
                className="prose lg:prose-xl text-gray-600"
              >
                {aboutData[0].attributes.Content}
              </ReactMarkdown>
              
              <div className="mt-8">
                <motion.a
                  href="#contact"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md"
                >
                  Contact Us
                </motion.a>
              </div>
              </div>
            </motion.div>
          </div>
         
        // </div>
      )}
    </>
  );
};

export default AboutPage;
