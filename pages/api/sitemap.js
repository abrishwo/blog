import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

export default async function handler(req, res) {


    const staticPages = [
        { url: '/', changefreq: 'weekly', priority: 1 },
        { url: '/about', changefreq: 'monthly', priority: 0.7 },
        // Add more static pages here
      ];


    // Fetch or retrieve your dynamic data, e.g., from a CMS, database, or static list.
//   const posts = await fetch('http://localhost:1337/api/articles').then(res => res.json());

  // Set the header to XML.
  res.setHeader('Content-Type', 'application/xml');

  // Create a new sitemap stream.
  const sitemap = new SitemapStream({ hostname: 'http://localhost:3000' });

  // Convert dynamic posts to URL format.
//   const dynamiclinks = posts.map(post => ({
//     url: `/posts/${post.slug}`,
//     changefreq: 'daily',
//     priority: 0.8,
//   }));
const dynamiclinks = [];
  // Merge dynamic and static links
const links = [...staticPages, ...dynamiclinks];
  // Stream the sitemap data.
  const xmlStream = new Readable({
    read() {
      links.forEach(link => sitemap.write(link));
      sitemap.end();
    }
  });

  // Convert stream to XML and send as response.
  const sitemapOutput = await streamToPromise(xmlStream).then(data => data.toString());
  res.status(200).end(sitemapOutput);
}
