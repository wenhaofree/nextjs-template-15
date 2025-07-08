import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 实验性功能 - Next.js 15 新特性
  experimental: {
    // ppr: true,                    // 部分预渲染 (需要 Next.js 15+)
    // reactCompiler: true,          // React 编译器 (需要 React 19+)
    // dynamicIO: true,              // 动态 IO (需要 Next.js 15+)
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Turbopack 配置 (已从 experimental.turbo 迁移到顶级配置)
  turbopack: {
    // 可以在这里添加 Turbopack 特定的配置
    // resolveAlias: {},
    // resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
  },
  // 性能优化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 图片优化
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 构建优化
  poweredByHeader: false,
  compress: true,
};

export default withNextIntl(nextConfig);