import { getToolsDB } from '@/lib/neon'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url)
    const page = Number(searchParams.get('page')) || 1
    const limit = Number(searchParams.get('limit')) || 12
    const sortBy = searchParams.get('sortBy') as any || 'created_at'
    const sortOrder = searchParams.get('sortOrder') as 'ASC' | 'DESC' || 'DESC'
    
    const toolsDB = await getToolsDB()
    const result = await toolsDB.getTools({
      page,
      limit,
      sortBy,
      sortOrder,
    })
    

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching tools:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tools' },
      { status: 500 }
    )
  }
} 