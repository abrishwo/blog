import axios from 'axios';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://starsandtoques.com';
const STRAPI_URL = process.env.STRAPI_API_URL || process.env.NEXT_PUBLIC_BASE_URL;

// Function to escape XML entities
const escapeXML = (str) => {
  return str.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
};

// This function gets called when the user requests /sitemap.xml
const Sitemap = () => {};

export const getServerSideProps = async ({ res }) => {
  const staticPages = [
    { url: `${SITE_URL}/`, changefreq: 'daily', priority: '1.0' },
    { url: `${SITE_URL}/about`, changefreq: 'monthly', priority: '0.8' },
    { url: `${SITE_URL}/contact`, changefreq: 'monthly', priority: '0.5' },
  ];

  let allPosts = [];
  let page = 1;
  let pageCount = 1;
  const pageSize = 100; // Fetch 100 posts per page

  try {
    // Loop through all pages of posts from the Strapi API
    do {
      const response = await axios.get(
        `${STRAPI_URL}/api/articles?pagination[page]=${page}&pagination[pageSize]=${pageSize}&fields[0]=Slug&fields[1]=updatedAt`
      );

      const posts = response.data.data;
      if (posts && posts.length > 0) {
        allPosts = [...allPosts, ...posts];
      }

      if (response.data.meta && response.data.meta.pagination) {
        pageCount = response.data.meta.pagination.pageCount;
      }

      page++;
    } while (page <= pageCount);

    // Start building the XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add static pages
    staticPages.forEach(p => {
      sitemap += `
  <url>
    <loc>${escapeXML(p.url)}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`;
    });

    // Add dynamic post pages
    allPosts.forEach(post => {
      sitemap += `
  <url>
    <loc>${SITE_URL}/posts/${post.attributes.Slug}</loc>
    <lastmod>${new Date(post.attributes.updatedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    sitemap += `
</urlset>`;

    // Set headers
    res.setHeader('Content-Type', 'text/xml');
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=3600, stale-while-revalidate=59'
    );

    // Send the XML
    res.write(sitemap);
    res.end();

  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.statusCode = 500;
    res.end();
  }

  return {
    props: {},
  };
};

export default Sitemap;
