/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Your live Directus backend on Render
      {
        protocol: 'https',
        hostname: 'ypa-directus.onrender.com',
        port: '',
        pathname: '/assets/**',
      },
      // Keep other external sources you use
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'tse2.mm.bing.net',
      },
      {
        protocol: 'https',
        hostname: 'farm6.staticflickr.com',
      },
    ],
  },
  // Keep your webpack and turbopack configs as they are
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { ...config.resolve.fallback, crypto: false };
    }
    return config;
  },
};

module.exports = nextConfig;