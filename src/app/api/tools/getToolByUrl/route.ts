import { NextResponse } from 'next/server'
import { ToolsDB } from '@/lib/neon'

export async function POST(request: Request) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    const tool = await ToolsDB.getToolByUrl(url)

    if (!tool) {
      return NextResponse.json(
        { exists: false },
        { status: 404 }
      )
    }

    return NextResponse.json({
      exists: true,
      tool
    })

  } catch (error) {
    console.error('Error checking tool:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
