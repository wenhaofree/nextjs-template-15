import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './src/i18n/config';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … if they contain a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\.).*)',
    // However, match all pathnames within `/api`, if they include a locale
    '/api/(.+)'
  ]
};