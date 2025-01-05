import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['en', 'zh', 'ja'],
  defaultLocale: 'en'
});

export const config = {
  matcher: ['/', '/(zh|en|ja)/:path*']
};