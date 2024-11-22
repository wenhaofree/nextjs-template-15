import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import type { Locale } from '@/i18n/routing'

declare module 'negotiator' {
  export default class Negotiator {
    constructor(options: { headers: Record<string, string> })
    languages(): string[]
  }
}

import Negotiator from 'negotiator'

const locales = ['en', 'zh', 'ja'] as const
const defaultLocale = 'en'

// Add auth-related paths that should be localized
const authPages = ['/sign-in', '/sign-up', '/forgot-password']

const ENABLE_LOCALE_DETECTION = false  // 设置为 false 禁用语言检测

function getLocale(request: NextRequest): string {
  // if (!ENABLE_LOCALE_DETECTION) {
  //   return defaultLocale
  // }
  
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  const locale = matchLocale(languages, locales, defaultLocale)
  return locale
}

// 新增:从路径中获取当前locale
function getLocaleFromPath(pathname: string): string | undefined {
  const segments = pathname.split('/')
  if (segments.length > 1) {
    const locale = segments[1]
    if (locales.includes(locale as any)) {
      return locale
    }
  }
  return undefined
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip API routes and static files
  if (
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Check if the pathname is an auth page without locale
  const isAuthPage = authPages.some(page => pathname === page)
  
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale || isAuthPage) {
    // 直接使用默认语言，不再检测路径或浏览器语言
    // const currentLocale = getLocaleFromPath(pathname) || getLocale(request)
    const currentLocale = defaultLocale
    
    // For auth pages, preserve the path but add locale
    const newUrl = new URL(
      `/${currentLocale}${isAuthPage ? pathname : pathname === '/' ? '' : pathname}`,
      request.url
    )
    
    // Preserve any query parameters
    request.nextUrl.searchParams.forEach((value, key) => {
      newUrl.searchParams.set(key, value)
    })
    
    return NextResponse.redirect(newUrl)
  }
}

export const config = {
  matcher: [
    // Match all paths except static assets and API routes
    '/((?!_next|api|.*\\.).*)',
    '/',
    // Include auth pages explicitly
    '/sign-in',
    '/sign-up',
    '/forgot-password'
  ],
}