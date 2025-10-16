import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
      },
      {
        protocol: 'http',
        hostname: '10.0.10.33',
        port: '5000',
      },
      {
        protocol: 'http',
        hostname: '172.252.13.76',
        port: '5001',
      },
      {
        protocol: 'http',
        hostname: 'api.cudaspace.com',
      },
    ],
  },
};

export default nextConfig;
