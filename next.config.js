const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.aistak.com','img.wenhaofree.com'],
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['fs', 'path']
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't attempt to load node-specific modules on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      }
    }
    return config
  },
}

module.exports = withNextIntl(nextConfig); 