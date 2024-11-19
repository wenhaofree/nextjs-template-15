import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match as matchLocale } from '@formatjs/intl-localematcher'

declare module 'negotiator' {
  export default class Negotiator {
    constructor(options: { headers: Record<string, string> })
    languages(): string[]
  }
}

import Negotiator from 'negotiator'

const locales = ['en', 'zh']
const defaultLocale = 'zh'

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  const locale = matchLocale(languages, locales, defaultLocale)
  return locale
}

export function middleware(request: NextRequest) {
  console.log('Middleware - Full URL:', request.url)
  console.log('Middleware - Search Params:', Object.fromEntries(new URL(request.url).searchParams))
  
  const pathname = request.nextUrl.pathname
  
  // Skip auth API routes and static files
  if (
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)
    const newUrl = new URL(`/${locale}${pathname}`, request.url)
    request.nextUrl.searchParams.forEach((value, key) => {
      newUrl.searchParams.set(key, value)
    })
    return NextResponse.redirect(newUrl)
  }
}

export const config = {
  matcher: [
    // Skip all internal paths (_next) and auth API routes
    '/((?!_next|api/auth|api).*)',
    // Optional: only run on root (/) URL
    '/'
  ],
}