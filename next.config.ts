import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for turbopack
  experimental: {
    // turbo option removed as it's no longer needed
  },
  
  // Configure image domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.aiwith.me',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
