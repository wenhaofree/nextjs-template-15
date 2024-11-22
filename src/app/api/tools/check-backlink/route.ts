import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'
import axios from 'axios'

// Get domain from environment variable
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const SITE_DOMAIN = new URL(SITE_URL).hostname.replace('www.', '')

// Cache successful checks to avoid repeated requests
const backlinkCache = new Map<string, boolean>()

// Helper function to validate and normalize URL
function normalizeUrl(url: string): string {
  try {
    // Remove trailing slashes and whitespace
    url = url.trim().replace(/\/+$/, '')
    
    // Add protocol if missing
    if (!url.startsWith('http')) {
      url = 'https://' + url
    }
    
    // Validate URL format
    new URL(url)
    return url
  } catch (e) {
    throw new Error('Invalid URL format')
  }
}

// Helper function to check backlink
async function checkBacklink(url: string): Promise<boolean> {
  const response = await axios.get(url, {
    timeout: 10000,
    maxRedirects: 5,
    headers: {
      'User-Agent': `Mozilla/5.0 (compatible; +${SITE_URL})`,
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
    validateStatus: (status) => status === 200, // Only accept 200 status
  })

  const html = response.data
  const $ = cheerio.load(html)

  // Look for backlink with flexible matching
  return $('a').toArray().some(element => {
    const href = $(element).attr('href')
    if (!href) return false

    try {
      // Normalize the href URL for comparison
      const hrefUrl = new URL(href, url)
      const domain = hrefUrl.hostname.toLowerCase()
      
      // Check for various domain patterns
      return domain === SITE_DOMAIN || 
             domain === `www.${SITE_DOMAIN}` ||
             domain.endsWith(`.${SITE_DOMAIN}`)
    } catch {
      // If href is invalid URL, just check string content
      return href.includes(SITE_DOMAIN)
    }
  })
}

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    // Validate input
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Invalid URL provided' },
        { status: 400 }
      )
    }

    try {
      // Normalize URL
      const normalizedUrl = normalizeUrl(url)

      // Check cache
      if (backlinkCache.has(normalizedUrl)) {
        return NextResponse.json({
          hasBacklink: backlinkCache.get(normalizedUrl)
        })
      }

      // Check backlink
      const hasBacklink = await checkBacklink(normalizedUrl)
      
      // Cache result
      backlinkCache.set(normalizedUrl, hasBacklink)

      return NextResponse.json({ hasBacklink })

    } catch (error: any) {
      if (error.message === 'Invalid URL format') {
        return NextResponse.json(
          { error: '请输入有效的网址' },
          { status: 400 }
        )
      }
      
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ECONNABORTED') {
          return NextResponse.json(
            { error: '无法访问网站，请确保网站可以正常访问' },
            { status: 503 }
          )
        }
        if (error.response?.status === 404) {
          return NextResponse.json(
            { error: '网页不存在' },
            { status: 404 }
          )
        }
      }
      
      throw error // Re-throw unexpected errors
    }

  } catch (error) {
    console.error('Backlink check error:', error)
    return NextResponse.json(
      { error: '检查链接失败，请稍后重试' },
      { status: 500 }
    )
  }
} 