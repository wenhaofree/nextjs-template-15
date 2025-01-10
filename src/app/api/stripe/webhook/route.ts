import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

if (!process.env.STRIPE_PRIVATE_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('Missing Stripe environment variables');
}

const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY, {
  apiVersion: '2024-12-18.acacia',
});

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const headersList = request.headers;
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Find the order by stripe session ID
        const order = await prisma.order.findFirst({
          where: {
            stripeSessionId: session.id,
          },
        });

        if (!order) {
          console.error('Order not found for session:', session.id);
          return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

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
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        const order = await prisma.order.findFirst({
          where: {
            stripeSessionId: session.id,
          },
        });

        if (!order) {
          console.error('Order not found for session:', session.id);
          return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

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
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const session = await stripe.checkout.sessions.retrieve(paymentIntent.metadata.session_id);
        
        const order = await prisma.order.findFirst({
          where: {
            stripeSessionId: session.id,
          },
        });

        if (!order) {
          console.error('Order not found for session:', session.id);
          return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

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
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }
}
