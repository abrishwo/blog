import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

export default async function handler(req, res) {
  const SITE_URL = 'https://starsandtoques.com';
  const STRAPI_API_URL = 'https://vivid-flowers-9f3564b8da.strapiapp.com';

  const staticPages = [
    { url: '/', changefreq: 'weekly', priority: 1 },
    { url: '/about', changefreq: 'monthly', priority: 0.7 },
  ];

  // Fetch dynamic posts
  const response = await fetch(`${STRAPI_API_URL}/api/articles?fields[0]=Slug&fields[1]=updatedAt`);
  const data = await response.json();
  const posts = data.data || [];

  // Map dynamic posts
  const dynamiclinks = posts.map(post => ({
    url: `/posts/${post.attributes.Slug}`, // <-- fix capitalization
    lastmod: post.attributes.updatedAt,
    changefreq: 'weekly',
    priority: 0.7,
  }));

  const links = [...staticPages, ...dynamiclinks];

  res.setHeader('Content-Type', 'application/xml');
  const sitemap = new SitemapStream({ hostname: SITE_URL });

  const xmlStream = new Readable({
    read() {
      links.forEach(link => sitemap.write(link));
      sitemap.end();
    }
  });

  const sitemapOutput = await streamToPromise(xmlStream).then(data => data.toString());
  res.status(200).end(sitemapOutput);
}
