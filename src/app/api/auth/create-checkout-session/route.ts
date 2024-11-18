import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY!, {
  apiVersion: process.env.STRIPE_API_VERSION as '2024-10-28.acacia',
})

const PRICE_IDS = {
  'one-time': 'price_1QKXZRF6tgmitLrXDNiaqwY0',    // $16.9 (one-time price)
  'unlimited': 'price_1QKcf7F6tgmitLrX8duAHtxF',   // $24.9 (subscription price)
  'sponsor': 'price_1QKcYKF6tgmitLrXEUPnogCL'      // $39.9 (subscription price)
} as const

export async function POST(req: Request) {
  try {
    const { email, planType, submission } = await req.json()
    console.log('planType:', planType)
    console.log('email:', email)
    
    if (!email || !planType) {
      return NextResponse.json(
        { error: 'Missing email or planType' },
        { status: 400 }
      )
    }

    if (planType === 'free') {
      return NextResponse.json(
        { error: 'Free plan does not require payment' },
        { status: 400 }
      )
    }

    const priceId = PRICE_IDS[planType as keyof typeof PRICE_IDS]
    
    if (!priceId) {
      return NextResponse.json(
        { error: 'Invalid plan type' },
        { status: 400 }
      )
    }

    const mode = planType === 'one-time' ? 'payment' : 'subscription'

    console.log('Creating checkout session:', {
      email,
      planType,
      priceId,
      mode
    })

    const session = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/submit/success?session_id={CHECKOUT_SESSION_ID}&submission_name=${encodeURIComponent(submission.name)}&submission_url=${encodeURIComponent(submission.url)}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/submit`,
      client_reference_id: email,
      metadata: {
        email,
        planType,
        submissionName: submission.name,
        submissionUrl: submission.url
      },
    })

    console.log('✅ Checkout session created:', {
      sessionId: session.id,
      url: session.url
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('❌ Error creating checkout session:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error creating checkout session' },
      { status: 500 }
    )
  }
} 