import { NextResponse } from 'next/server'
import { getToolsDB, DbTool } from '@/lib/neon'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    console.log('Received update request:', body)

    // Validate required fields
    const errors = []
    if (!body.email) errors.push('Email is required')
    if (!body.status) errors.push('Status is required')
    
    if (errors.length > 0) {
      return NextResponse.json(
        { error: errors.join(', ') },
        { status: 400 }
      )
    }

    // Validate status value
    const validStatuses = ['active', 'inactive', 'pending', 'rejected'] as const
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    // Update in database
    const db = await getToolsDB()
    const updatedTool = await db.updateToolStatus({
      email: body.email,
      status: body.status as DbTool['status']
    })

    if (!updatedTool) {
      return NextResponse.json(
        { error: 'Tool not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedTool)

  } catch (error) {
    console.error('Error updating tool:', error)
    return NextResponse.json(
      { error: 'Failed to update tool: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
