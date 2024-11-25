const withNextIntl = require('next-intl/plugin')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.aistak.com','img.wenhaofree.com'],
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = withNextIntl(nextConfig); 