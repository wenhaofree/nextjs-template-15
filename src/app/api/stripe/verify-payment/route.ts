import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required environment variable: STRIPE_SECRET_KEY')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { sessionId } = body

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session ID' },
        { status: 400 }
      )
    }

    console.log('Verifying payment for session:', sessionId)

    // 获取 Stripe session 详情
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['customer', 'payment_intent', 'subscription']
    })
    
    console.log('Retrieved stripe session:', {
      id: stripeSession.id,
      paymentStatus: stripeSession.payment_status,
      customerId: stripeSession.customer,
      metadata: stripeSession.metadata
    })

    // 检查支付状态
    if (stripeSession.payment_status !== 'paid') {
      return NextResponse.json({
        status: 'failed',
        message: 'Payment not completed'
      })
    }

    // 从 customer 获取 email
    const customerEmail = typeof stripeSession.customer === 'object' ? stripeSession.customer.email : null
    if (!customerEmail) {
      throw new Error('No customer email found in session')
    }

    // 获取用户
    const user = await prisma.user.findFirst({
      where: {
        email: customerEmail
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    // 获取计划类型
    const planType = stripeSession.metadata?.planType
    if (!planType) {
      throw new Error('No plan type found in session metadata')
    }

    console.log('Updating user subscription:', {
      email: user.email,
      planType,
      subscriptionId: stripeSession.subscription
    })

    // 更新用户订阅状态
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        level: planType,
        updated_at: new Date(),
        // 如果是订阅，保存订阅 ID
        ...(stripeSession.subscription && {
          stripeSubscriptionId: typeof stripeSession.subscription === 'string' 
            ? stripeSession.subscription 
            : stripeSession.subscription.id
        })
      }
    })

    console.log('User subscription updated successfully:', {
      email: updatedUser.email,
      level: updatedUser.level
    })

    // 处理提交信息（如果有）
    const submissionName = stripeSession.metadata?.submissionName
    const submissionUrl = stripeSession.metadata?.submissionUrl

    if (submissionName && submissionUrl) {
      await prisma.submission.create({
        data: {
          name: submissionName,
          url: submissionUrl,
          userEmail: user.email,
          status: 'pending'
        }
      })
    }

    return NextResponse.json({
      status: 'complete',
      user: {
        email: updatedUser.email,
        level: updatedUser.level,
      }
    })

  } catch (error) {
    console.error('Payment verification error:', {
      error,
    })
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unknown error occurred' },
      { status: 500 }
    )
  }
}