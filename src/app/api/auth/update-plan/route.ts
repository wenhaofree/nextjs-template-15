import { NextResponse } from 'next/server'
import { Pool } from 'pg'

// 创建数据库连接池
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
})

export async function POST(request: Request) {
  try {
    const { email, planType } = await request.json()

    // 验证必要参数
    if (!email || !planType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const client = await pool.connect()
    try {
      // 更新用户的 level 字段
      const { rowCount } = await client.query(`
        UPDATE users 
        SET 
          level = $1,
          updated_at = CURRENT_TIMESTAMP
        WHERE email = $2
      `, [planType, email])

      if (rowCount === 0) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        message: 'User plan updated successfully'
      })

    } finally {
      client.release()
    }

  } catch (error) {
    console.error('Error updating user plan:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
