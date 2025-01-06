import { NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_PRIVATE_KEY) {
  throw new Error('STRIPE_PRIVATE_KEY is not set');
}

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY, {
  apiVersion: '2023-10-16',
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { price, successUrl, cancelUrl, email } = body;

    // 打印接收到的请求数据
    console.log('Received stripe payment request:', {
      price,
      email,
      successUrl,
      cancelUrl
    });

    // Ensure price is a number and convert to cents
    const amount = Math.round(parseFloat(price) * 100);

    if (isNaN(amount)) {
      return NextResponse.json(
        { error: 'Invalid price amount' },
        { status: 400 }
      );
    }

    // 打印创建 session 的配置
    console.log('Creating Stripe checkout session with config:', {
      amount,
      customer_email: email,
      mode: 'payment'
    });

    // Create a payment session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Purchase',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    // 打印创建的 session ID
    console.log('Created Stripe session:', session.id);

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error('Stripe API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
