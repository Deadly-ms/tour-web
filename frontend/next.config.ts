import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/trips',
        destination: '/tours',
        permanent: true,
      },
      {
        source: '/trips/:slug',
        destination: '/tours/:slug',
        permanent: true,
      },
      {
        source: '/destinations',
        destination: '/tours',
        permanent: true,
      },
      {
        source: '/destinations/:slug',
        destination: '/tours',
        permanent: true,
      },
      {
        source: '/hotels',
        destination: '/tours',
        permanent: true,
      },
      {
        source: '/hotels/:slug',
        destination: '/tours',
        permanent: true,
      },
      {
        source: '/activities',
        destination: '/tours',
        permanent: true,
      },
      {
        source: '/activities/:slug',
        destination: '/tours',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
