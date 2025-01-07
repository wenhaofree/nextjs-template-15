import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
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
