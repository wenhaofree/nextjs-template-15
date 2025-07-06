/**
 * 路由常量定义
 */

export const ROUTES = {
  // 公共路由
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRICING: '/pricing',
  FEATURES: '/features',
  
  // 认证路由
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
  },
  
  // 用户路由
  USER: {
    PROFILE: '/profile',
    SETTINGS: '/profile/settings',
    ORDERS: '/profile/orders',
    BILLING: '/profile/billing',
  },
  
  // 仪表板路由
  DASHBOARD: {
    HOME: '/dashboard',
    ANALYTICS: '/dashboard/analytics',
    USERS: '/dashboard/users',
    SETTINGS: '/dashboard/settings',
  },
  
  // API 路由
  API: {
    AUTH: '/api/auth',
    USERS: '/api/users',
    ORDERS: '/api/orders',
    PAYMENTS: '/api/payments',
  },
} as const;

/**
 * 受保护的路由列表
 */
export const PROTECTED_ROUTES = [
  ROUTES.USER.PROFILE,
  ROUTES.USER.SETTINGS,
  ROUTES.USER.ORDERS,
  ROUTES.USER.BILLING,
  ROUTES.DASHBOARD.HOME,
  ROUTES.DASHBOARD.ANALYTICS,
  ROUTES.DASHBOARD.USERS,
  ROUTES.DASHBOARD.SETTINGS,
];

/**
 * 公共路由列表
 */
export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.ABOUT,
  ROUTES.CONTACT,
  ROUTES.PRICING,
  ROUTES.FEATURES,
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.REGISTER,
  ROUTES.AUTH.FORGOT_PASSWORD,
  ROUTES.AUTH.RESET_PASSWORD,
  ROUTES.AUTH.VERIFY_EMAIL,
];
