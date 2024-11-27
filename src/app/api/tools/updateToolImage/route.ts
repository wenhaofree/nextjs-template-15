import { NextResponse } from 'next/server'
import { getToolsDB } from '@/lib/neon'

export async function POST(request: Request) {
  try {
    const { url, image_url } = await request.json()

    // Validate required fields
    if (!url || !image_url) {
      return NextResponse.json(
        { error: 'URL and image_url are required' },
        { status: 400 }
      )
    }

    // Get DB instance and update tool
    const db = await getToolsDB()
    const updatedTool = await db.updateToolImage({ url, image_url })

    if (!updatedTool) {
      return NextResponse.json(
        { error: 'Tool not found or update failed' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedTool)

  } catch (error) {
    console.error('Error updating tool status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
