import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

// 注释掉Stripe初始化代码

if (!process.env.STRIPE_PRIVATE_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('Missing Stripe environment variables');
}

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY, {
  apiVersion: '2025-02-24.acacia',
});


export async function POST(request: Request) {
  try {
    // 简化的webhook处理
    // return NextResponse.json({ message: 'Stripe webhook processing temporarily disabled' });
    
    console.log('Webhook: 接收到Stripe webhook回调');
    const body = await request.text();
    const headersList = request.headers;
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      console.log('Webhook: 缺少signature');
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    console.log('Webhook: 验证webhook签名');
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log('Webhook: 事件类型', event.type);
    switch (event.type) {
      case 'checkout.session.completed': {
        console.log('Webhook: 支付完成');
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Webhook: 会话ID', session.id);
        
        // Find the order by stripe session ID
        const order = await prisma.order.findFirst({
          where: {
            stripeSessionId: session.id,
          },
        });

        if (!order) {
          console.error('Webhook: 未找到订单，会话ID:', session.id);
          return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        console.log('Webhook: 更新订单状态为已支付，订单号:', order.orderNo);
        // Update order status to success
        await prisma.order.update({
          where: {
            orderNo: order.orderNo,
          },
          data: {
            status: 'paid',
            paidAt: new Date(),
            paidEmail: session.customer_email || undefined,
            paidDetail: JSON.stringify(session),
          },
        });
        console.log('Webhook: 订单状态更新成功');
        break;
      }

      case 'checkout.session.expired': {
        console.log('Webhook: 支付会话过期');
        const session = event.data.object as Stripe.Checkout.Session;
        
        const order = await prisma.order.findFirst({
          where: {
            stripeSessionId: session.id,
          },
        });

        if (!order) {
          console.error('Webhook: 未找到订单，会话ID:', session.id);
          return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        console.log('Webhook: 更新订单状态为已过期，订单号:', order.orderNo);
        // Update order status to expired
        await prisma.order.update({
          where: {
            orderNo: order.orderNo,
          },
          data: {
            status: 'expired',
            paidDetail: JSON.stringify(session),
          },
        });
        console.log('Webhook: 订单状态更新成功');
        break;
      }

      case 'payment_intent.payment_failed': {
        console.log('Webhook: 支付失败');
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Webhook: 获取会话ID', paymentIntent.metadata.session_id);
        const session = await stripe.checkout.sessions.retrieve(paymentIntent.metadata.session_id);
        
        const order = await prisma.order.findFirst({
          where: {
            stripeSessionId: session.id,
          },
        });

        if (!order) {
          console.error('Webhook: 未找到订单，会话ID:', session.id);
          return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        console.log('Webhook: 更新订单状态为支付失败，订单号:', order.orderNo);
        // Update order status to failed
        await prisma.order.update({
          where: {
            orderNo: order.orderNo,
          },
          data: {
            status: 'failed',
            paidDetail: JSON.stringify(paymentIntent),
          },
        });
        console.log('Webhook: 订单状态更新成功');
        break;
      }
    }

    console.log('Webhook: 处理完成');
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook: 处理webhook时出错:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }
}
