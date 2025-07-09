import createNextIntlPlugin from 'next-intl/plugin';
import bundleAnalyzer from '@next/bundle-analyzer';

const withNextIntl = createNextIntlPlugin();

// Bundle analyzer for performance optimization
const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 实验性功能 - Next.js 15 新特性
  experimental: {
    // ppr: true,                    // 部分预渲染 (需要 Next.js 15+)
    // reactCompiler: true,          // React 编译器 (需要 React 19+)
    // dynamicIO: true,              // 动态 IO (需要 Next.js 15+)
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'framer-motion',
      'next-intl',
      'react-hook-form',
      'zod',
      '@stripe/stripe-js'
    ],
    // 客户端路由缓存配置
    staleTimes: {
      dynamic: 30,    // 动态页面缓存30秒
      static: 180,    // 静态页面缓存3分钟
    },
    // 启用现代 JavaScript 输出
    esmExternals: true,
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
    // 移除 React DevTools
    reactRemoveProperties: process.env.NODE_ENV === 'production',
    // 启用 SWC 压缩
    styledComponents: true,
  },

  // 启用生产环境 Source Maps
  productionBrowserSourceMaps: true,

  // 暂时移除 webpack 配置以排查问题
  // webpack: (config) => {
  //   // 确保正确的 tree-shaking
  //   config.optimization.sideEffects = false
  //
  //   return config
  // },

  // 图片优化
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1年缓存
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // 构建优化
  poweredByHeader: false,
  compress: true,

  // 输出配置
  output: 'standalone', // 优化Docker部署

  // 服务器组件外部包
  serverExternalPackages: ['@prisma/client'],

  // 安全头配置
  async headers() {
    const cspHeader = `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://accounts.google.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' blob: data: https://images.unsplash.com https://unsplash.com;
      font-src 'self' https://fonts.gstatic.com;
      connect-src 'self' https://api.stripe.com https://accounts.google.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
      upgrade-insecure-requests;
    `.replace(/\n/g, '').replace(/\s+/g, ' ').trim()

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: cspHeader,
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
};

export default withBundleAnalyzer(withNextIntl(nextConfig));