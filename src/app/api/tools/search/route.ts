import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
})

export async function POST(request: Request) {
  try {
    const { title } = await request.json()
    const client = await pool.connect()
    
    try {
      // 不管是否有title,都按创建时间倒序排序,确保返回最新数据
      const { rows: tools } = await client.query(`
        SELECT 
          id, title, url, image_url, summary, 
          tags, created_at, rating, slug
        FROM tools 
        WHERE status = 'active'
        ${title?.trim() ? "AND title ILIKE $1" : ""}
        ORDER BY created_at DESC
        LIMIT 12
      `, title?.trim() ? [`%${title}%`] : [])

      const { rows: [{ count }] } = await client.query(`
        SELECT COUNT(*) as count
        FROM tools
        WHERE status = 'active'
        ${title?.trim() ? "AND title ILIKE $1" : ""}
      `, title?.trim() ? [`%${title}%`] : [])

      return NextResponse.json({
        tools,
        total: parseInt(count),
        hasMore: parseInt(count) > 12
      })

    } finally {
      client.release()
    }
    
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 