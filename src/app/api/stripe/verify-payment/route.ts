import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY!, {
  apiVersion: process.env.STRIPE_API_VERSION as '2024-10-28.acacia',
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received verification request:', body)

    const { sessionId } = body

    if (!sessionId) {
      console.error('Missing session ID in request')
      return NextResponse.json(
        { error: 'Missing session ID' },
        { status: 400 }
      )
    }

    // 获取 Stripe session 详情
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    console.log('Stripe session details:', {
      id: session.id,
      status: session.status,
      payment_status: session.payment_status,
      metadata: session.metadata
    })

    // 检查支付状态
    const isComplete = session.payment_status === 'paid'
    console.log('Payment status:', isComplete ? 'complete' : 'pending')

    

    return NextResponse.json({
      status: isComplete ? 'complete' : 'pending',
      metadata: session.metadata
    })

  } catch (error) {
    // 添加更详细的错误日志
    console.error('Payment verification error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
} 