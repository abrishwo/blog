/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', '3.8.211.12','vivid-flowers-9f3564b8da.media.strapiapp.com'], // Add 'localhost' or other domains as needed

    // remotePatterns: [
    //   {
    //     protocol: 'http',
    //     hostname: '3.8.211.12',  // Add your Strapi server IP or domain
    //     port: '1337',            // Add port if needed
    //     pathname: '/uploads/**', // Define the path of the images
    //   },
    // ],
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },
};

module.exports = nextConfig;
