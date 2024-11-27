import { NextResponse } from 'next/server'
import { getToolsDB } from '@/lib/neon'

export async function POST(request: Request) {
  try {
    const { url, status } = await request.json()

    // Validate required fields
    if (!url || !status) {
      return NextResponse.json(
        { error: 'URL and status are required' },
        { status: 400 }
      )
    }

    // Validate status value
    const validStatuses = ['active', 'inactive', 'pending', 'removed', 'featured']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    // Get DB instance and update tool
    const db = await getToolsDB()
    const updatedTool = await db.updateToolStatus({ url, status })

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
