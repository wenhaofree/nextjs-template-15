const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.aistak.com','img.wenhaofree.com'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = withNextIntl(nextConfig); 