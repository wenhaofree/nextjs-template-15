import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required environment variable: STRIPE_SECRET_KEY')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

export async function GET() {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // 从数据库获取用户信息
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        stripeCustomerId: true,
      },
    })

    if (!user?.stripeCustomerId) {
      return NextResponse.json([])
    }

    // 获取支付历史
    const paymentIntents = await stripe.paymentIntents.list({
      customer: user.stripeCustomerId,
      limit: 10, // 最近10笔交易
    })

    const charges = await stripe.charges.list({
      customer: user.stripeCustomerId,
      limit: 10,
    })

    // 合并支付意向和实际支付记录
    const payments = [...paymentIntents.data, ...charges.data]
      .sort((a, b) => b.created - a.created) // 按时间倒序
      .slice(0, 10) // 只取最近10笔
      .map(payment => ({
        id: payment.id,
        amount: payment.amount,
        status: payment.status,
        created: payment.created,
        description: payment.description || 'Payment',
      }))

    return NextResponse.json(payments)

  } catch (error) {
    console.error('Error fetching payment history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment history' },
      { status: 500 }
    )
  }
}
