import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { Pool } from 'pg'

// Create connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
})

export async function POST(
  req: Request,
  { params }: { params: { locale: string } }
) {
  console.log('Registration attempt:', { locale: params.locale }) // Log locale
  
  const client = await pool.connect()
  
  try {
    const { email, password, name } = await req.json()
    
    console.log('Registration payload:', { email, name }) // Log registration data (exclude password)
    
    // Validate input
    if (!email || !password) {
      console.log('Registration validation failed: Missing required fields')
      return NextResponse.json(
        { message: '请填写所有必填字段' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      console.log('Registration failed: Email already exists', { email })
      return NextResponse.json(
        { message: '该邮箱已被注册' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create user
    console.log('Creating new user...', { email })
    
    const result = await client.query(
      `INSERT INTO users (email, password_hash, name, level)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, name, level, created_at`,
      [email, hashedPassword, name || null, 'free']
    )

    const user = result.rows[0]
    
    console.log('User created successfully:', { 
      id: user.id,
      email: user.email,
      name: user.name 
    })

    return NextResponse.json({
      message: '注册成功',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        level: user.level,
        createdAt: user.created_at
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Registration error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { message: '注册失败，请重试' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
} 