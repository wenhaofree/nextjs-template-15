const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.aiwith.me'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = withNextIntl(nextConfig); 