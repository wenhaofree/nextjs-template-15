import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY!, {
  apiVersion: process.env.STRIPE_API_VERSION as Stripe.LatestApiVersion,
})

const PRICE_IDS = {
  'one-time': process.env.STRIPE_PRICE_ONE_TIME!,    // $16.9 (one-time price)
  'unlimited': process.env.STRIPE_PRICE_UNLIMITED!,   // $24.9 (subscription price)
  'sponsor': process.env.STRIPE_PRICE_SPONSOR!       // $39.9 (subscription price)
} as const


export async function POST(req: Request) {
  try {
    const { email, planType, submission,submissionName,submissionUrl,locale } = await req.json()
    
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
      submissionName,
      submissionUrl,
      mode
    })

    if (!process.env.NEXTAUTH_URL) {
      throw new Error('NEXTAUTH_URL environment variable is not set')
    }

    const session = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/${locale}/submit/success?CHECKOUT_SESSION_ID={CHECKOUT_SESSION_ID}&submission_name=${encodeURIComponent(submission.name || '')}&submission_url=${encodeURIComponent(submission.url || '')}`,
      // success_url: `${process.env.NEXTAUTH_URL}/submit/success?CHECKOUT_SESSION_ID={CHECKOUT_SESSION_ID}&submission_name=${encodeURIComponent(submission.name || '')}&submission_url=${encodeURIComponent(submission.url || '')}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/price`,
      client_reference_id: email,
      metadata: {
        email,
        planType,
        submissionName: submission.name || '',
        submissionUrl: submission.url || ''
      },
    })

    console.log('✅ Checkout session created:', {
      sessionId: session.id,
      url: session.url
    })

    console.log('Created session with success URL:', {
      baseUrl: process.env.NEXTAUTH_URL,
      successUrl: session.success_url,
      sessionId: session.id
    })

    return NextResponse.json({ url: session.url})
  } catch (error) {
    console.error('❌ Error creating checkout session:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error creating checkout session' },
      { status: 500 }
    )
  }
} 