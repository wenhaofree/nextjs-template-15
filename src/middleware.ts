import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';
import { locales, defaultLocale } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static files, API routes, and special Next.js files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
  ) {
    return NextResponse.next();
  }

  // 处理旧的auth路径重定向到本地化路径
  if (pathname === '/auth/signin') {
    // 从原始URL获取callbackUrl参数
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl');
    
    // 从callbackUrl中提取locale
    let locale = defaultLocale;
    if (callbackUrl) {
      // 从callbackUrl提取locale，匹配/en或/zh等模式
      const localePattern = new RegExp(`\\/(${locales.join('|')})\/?`);
      const match = callbackUrl.match(localePattern);
      if (match && match[1]) {
        locale = match[1];
      }
    } else {
      // 如果没有callbackUrl，尝试从Accept-Language头获取locale
      const acceptLanguage = request.headers.get('accept-language') || '';
      for (const loc of locales) {
        if (acceptLanguage.includes(loc)) {
          locale = loc;
          break;
        }
      }
    }
    
    // 重定向到本地化的auth路径
    const newPathname = `/${locale}/auth/signin`;
    const url = new URL(newPathname, request.url);
    
    // 保留所有查询参数
    request.nextUrl.searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
    
    return NextResponse.redirect(url);
  }
  
  return intlMiddleware(request);
}

export const config = {
  // Match all paths except static files, API routes, and Next.js internals
  matcher: [
    '/((?!api|_next/static|_next/image|favicon|.*\\..*|robots\\.txt|sitemap\\.xml|manifest\\.json).*)'
  ]
};