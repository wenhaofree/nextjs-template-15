/**
 * 应用配置常量
 */

export const APP_CONFIG = {
  NAME: 'Next.js Template',
  DESCRIPTION: 'A modern Next.js template with TypeScript, Tailwind CSS, and more',
  VERSION: '1.0.0',
  AUTHOR: 'Your Name',
  URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

/**
 * 环境配置
 */
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_TEST: process.env.NODE_ENV === 'test',
} as const;

/**
 * 数据库配置
 */
export const DATABASE_CONFIG = {
  URL: process.env.DATABASE_URL || '',
  MAX_CONNECTIONS: 10,
  TIMEOUT: 30000, // 30 seconds
} as const;

/**
 * 认证配置
 */
export const AUTH_CONFIG = {
  SECRET: process.env.NEXTAUTH_SECRET || '',
  SESSION_MAX_AGE: 30 * 24 * 60 * 60, // 30 days
  JWT_MAX_AGE: 24 * 60 * 60, // 24 hours
} as const;

/**
 * 文件上传配置
 */
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  ALLOWED_FILE_TYPES: ['application/pdf', 'text/plain', 'application/json'],
} as const;

/**
 * 分页配置
 */
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
} as const;
