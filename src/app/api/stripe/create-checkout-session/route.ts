import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required environment variable: STRIPE_SECRET_KEY')
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
})

// 定义有效的计划类型
const VALID_PLAN_TYPES = ['one_time', 'unlimited', 'sponsor'] as const
type PlanType = typeof VALID_PLAN_TYPES[number]

export async function POST(request: Request) {
  try {
    const session = await getServerSession()
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { planType, locale, submission } = body

    console.log('Received request:', { planType, locale })

    if (!planType) {
      return NextResponse.json(
        { error: 'Plan type is required' },
        { status: 400 }
      )
    }

    // 验证计划类型
    if (!VALID_PLAN_TYPES.includes(planType)) {
      console.error('Invalid plan type:', planType)
      return NextResponse.json(
        { error: `Invalid plan type. Must be one of: ${VALID_PLAN_TYPES.join(', ')}` },
        { status: 400 }
      )
    }

    // 获取价格 ID
    const priceIdKey = `STRIPE_PRICE_${planType.toUpperCase().replace('-', '_')}`
    const priceId = process.env[priceIdKey]
    console.log('Looking for price ID with key:', priceIdKey)

    if (!priceId) {
      console.error('Price ID not found for key:', priceIdKey)
      return NextResponse.json(
        { error: `Price not configured for plan type: ${planType}` },
        { status: 400 }
      )
    }

    // 获取或创建 Stripe 客户
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        stripeCustomerId: true,
      },
    })

    let customerId = user?.stripeCustomerId

    // 如果用户没有 Stripe 客户 ID，创建一个新的
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: {
          userId: session.user.id,
        },
      })
      customerId = customer.id

      // 更新用户的 Stripe 客户 ID
      await prisma.user.update({
        where: { email: session.user.email },
        data: { stripeCustomerId: customerId },
      })
    }

    // 确定支付模式
    const mode = planType === 'one_time' ? 'payment' : 'subscription'

    console.log('Creating checkout session with:', {
      customerId,
      mode,
      priceId,
      planType
    })

    // 创建结账会话
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/submit/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/price`,
      metadata: {
        userId: session.user.id,
        userEmail: session.user.email,
        planType,
        submissionName: submission?.name,
        submissionUrl: submission?.url
      },
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
      automatic_tax: { enabled: true },
      locale: locale === 'zh' ? 'zh' : locale === 'ja' ? 'ja' : 'en',
    })

    console.log('Checkout session created:', checkoutSession.id)

    return NextResponse.json({ url: checkoutSession.url })

  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}