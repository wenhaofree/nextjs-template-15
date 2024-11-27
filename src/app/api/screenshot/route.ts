import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { headers } from 'next/headers';

const VIEWPORT_WIDTH = 1280;

// CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Handle OPTIONS preflight request
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(request: Request) {
  try {
    const { url, size } = await request.json();

    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    // Launch browser
    const browser = await puppeteer.launch({
      headless: true,
    });

    try {
      const page = await browser.newPage();
      
      // Set viewport size
      const viewportHeight = size === '16:9' ? Math.round(VIEWPORT_WIDTH * 9/16) : 800;
      await page.setViewport({
        width: VIEWPORT_WIDTH,
        height: viewportHeight,
      });

      // Navigate to URL with timeout
      await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      // Take screenshot
      const screenshot = await page.screenshot({
        type: 'png',
        fullPage: size === 'full',
      });

      await browser.close();

      // Return the screenshot
      return new NextResponse(screenshot, {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': 'attachment; filename="screenshot.png"',
        },
      });

    } catch (error) {
      await browser.close();
      throw error;
    }

  } catch (error) {
    console.error('Screenshot error:', error);
    return NextResponse.json(
      { error: 'Failed to generate screenshot' },
      { status: 500 }
    );
  }
} 