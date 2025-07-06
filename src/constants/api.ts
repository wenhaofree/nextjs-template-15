/**
 * API 端点常量定义
 */

export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    VERIFY_EMAIL: '/api/auth/verify-email',
  },
  
  // 用户相关
  USERS: {
    PROFILE: '/api/users/profile',
    UPDATE: '/api/users/update',
    DELETE: '/api/users/delete',
    UPLOAD_AVATAR: '/api/users/avatar',
  },
  
  // 订单相关
  ORDERS: {
    LIST: '/api/orders',
    CREATE: '/api/orders/create',
    UPDATE: '/api/orders/update',
    DELETE: '/api/orders/delete',
    DETAILS: (id: string) => `/api/orders/${id}`,
  },
  
  // 支付相关
  PAYMENTS: {
    CREATE_INTENT: '/api/payments/create-intent',
    CONFIRM: '/api/payments/confirm',
    WEBHOOKS: '/api/payments/webhooks',
    HISTORY: '/api/payments/history',
  },
  
  // 文件上传
  UPLOAD: {
    IMAGE: '/api/upload/image',
    FILE: '/api/upload/file',
    AVATAR: '/api/upload/avatar',
  },
} as const;

/**
 * API 配置常量
 */
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || '',
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

/**
 * HTTP 状态码
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;
