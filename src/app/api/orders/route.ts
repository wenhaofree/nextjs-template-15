import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { config as authOptions } from '@/auth.config';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user by email
    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user's orders
    const orders = await prisma.order.findMany({
      where: {
        userUuid: user.uuid,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const json = await request.json();
    const order = await prisma.order.create({
      data: {
        orderNo: json.orderNo,
        userUuid: json.userUuid,
        userEmail: json.userEmail,
        amount: json.amount,
        interval: json.interval,
        status: json.status,
        credits: json.credits,
        currency: json.currency,
        productId: json.productId,
        productName: json.productName,
        validMonths: json.validMonths,
        orderDetail: json.orderDetail,
      },
    });
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
