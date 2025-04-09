import { NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { prisma, createUserWithPassword } from '@/lib/prisma';

/**
 * 用户注册API
 */
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 验证输入
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        signinProvider: 'credentials',
        isDeleted: false,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // 哈希密码
    const hashedPassword = await hash(password, 12);

    // 使用辅助函数创建用户
    const user = await createUserWithPassword({
      uuid: uuidv4(),
      email,
      password: hashedPassword,
      signinProvider: 'credentials',
      nickname: email.split('@')[0], // 默认使用邮箱用户名作为昵称
    });

    console.log('User created successfully:', user.id);

    return NextResponse.json(
      { 
        success: true,
        message: 'User created successfully',
        userId: user.id,
        email: user.email
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    
    // 检查是否是Prisma错误
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const isPrismaError = errorMessage.includes('Prisma');
    
    return NextResponse.json(
      { 
        success: false, 
        message: isPrismaError ? 'Database error occurred' : errorMessage 
      },
      { status: 500 }
    );
  }
} 