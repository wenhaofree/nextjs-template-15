import { NextResponse } from 'next/server'
import { getToolsDB, DbTool } from '@/lib/neon'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    console.log('Received request body:', body)

    // Detailed validation
    const errors = []
    if (!body.title) errors.push('Title is required')
    if (!body.url) errors.push('URL is required')
    
    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors.join(', ') },
        { status: 400 }
      )
    }

    // Create tool object with defaults
    const toolData = {
      title: body.title,
      url: body.url,
      image_url: body.image_url,
      summary: body.summary,
      tags: body.tags || '',
      language_support: body.language_support || '英文',
      favorite_count: 0,
      content_markdown: body.content_markdown || '',
      status: 'active' as DbTool['status'],
      view_count: 0,
      price_type: (body.price_type || 'free') as DbTool['price_type'],
      submit_user_id: body.submit_user_id,
      rating: 0,
      slug: body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    }

    console.log('Processed tool data:', toolData)

    // Add to database
    const db = await getToolsDB()
    const newTool = await db.addTool(toolData)

    return NextResponse.json(newTool, { status: 201 })

  } catch (error) {
    console.error('Error adding tool:', error)
    return NextResponse.json(
      { error: 'Failed to add tool: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
