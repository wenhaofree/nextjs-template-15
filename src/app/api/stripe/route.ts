import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { config as authOptions } from '@/auth.config';

import { v4 as uuidv4 } from 'uuid';

if (!process.env.STRIPE_PRIVATE_KEY) {
  throw new Error('STRIPE_PRIVATE_KEY is not set');
}

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.log('Stripe API: 认证失败，用户未登录');
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { price, successUrl, cancelUrl, email, productName } = body;

    // Print received request data
    console.log('Received stripe payment request:', {
      price,
      email,
      successUrl,
      cancelUrl,
      productName,
      priceType: typeof price
    });

    // Ensure price is a number and convert to cents
    const amount = Math.round(parseFloat(price) * 100);
    console.log('计算金额:', price, '->', amount, '美分');

    if (isNaN(amount)) {
      console.log('Stripe API: 价格无效', price);
      return NextResponse.json(
        { error: 'Invalid price amount' },
        { status: 400 }
      );
    }

    // Get user from database
    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      console.log('Stripe API: 未找到用户', session.user.email);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('准备创建Stripe会话');
    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: productName || 'Purchase',
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
    console.log('Stripe会话创建成功:', stripeSession.id);

    console.log('创建订单记录');
    // Create order in database
    await prisma.order.create({
      data: {
        orderNo: uuidv4(),
        userUuid: user.uuid,
        userEmail: user.email,
        amount: amount,
        status: 'pending',
        stripeSessionId: stripeSession.id,
        credits: 1,
        currency: 'usd',
        productName: productName || 'Purchase',
        createdAt: new Date(),
      },
    });
    console.log('订单记录创建成功');

    // 返回 Stripe 结账 URL
    console.log('返回支付URL:', stripeSession.url);
    return NextResponse.json({ url: stripeSession.url });
    
  } catch (error: any) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
