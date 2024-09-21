/**
 * @type {import('next').NextConfig}
 */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'vivid-flowers-9f3564b8da.media.strapiapp.com'], // Add 'localhost' or other domains as needed
  },
};

module.exports = nextConfig;
