/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Local Directus during development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8055',
        pathname: '/assets/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8055',
        pathname: '/assets/**',
      },
      // Your live Directus backend on Render
      {
        protocol: 'https',
        hostname: 'ypa-directus.onrender.com',
        pathname: '/assets/**',
      },
      // External image sources
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'tse2.mm.bing.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'farm6.staticflickr.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.youtube-nocookie.com',
        pathname: '/embed/**',
      },
      {
        protocol: 'https',
        hostname: 'www.youtube.com',
        pathname: '/embed/**',
      },
    ],
  },
  turbopack: {},
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { ...config.resolve.fallback, crypto: false };
    }
    return config;
  },
};

module.exports = nextConfig;