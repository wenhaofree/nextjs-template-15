import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  console.log('Registration attempt')
  
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
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    })

    if (existingUser) {
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
    
    const user = await prisma.user.create({
      data: {
        email,
        password_hash: hashedPassword,
        name: name || null,
        level: 'free'
      },
      select: {
        id: true,
        email: true,
        name: true,
        level: true,
        created_at: true
      }
    })
    
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
  }
}