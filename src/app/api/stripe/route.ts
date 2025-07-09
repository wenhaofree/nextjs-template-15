/**
 * Stripe Payment API Route / Stripe 支付 API 路由
 *
 * @description Creates Stripe checkout sessions for payment processing.
 * Handles user authentication, payment validation, and order creation.
 * @description 创建 Stripe 结账会话用于支付处理。
 * 处理用户认证、支付验证和订单创建。
 *
 * @route POST /api/stripe
 * @access Private - Requires user authentication
 * @access 私有 - 需要用户认证
 *
 * @author ShipSaaS.CO
 * @version 1.0.0
 * @since 2024-01-01
 */

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { config as authOptions } from '@/auth.config';

import { v4 as uuidv4 } from 'uuid';

/**
 * Request body interface for Stripe payment creation
 * Stripe 支付创建的请求体接口
 */
interface StripePaymentRequest {
  /** User email address / 用户邮箱地址 */
  email: string;
  /** Product price in USD / 产品价格（美元） */
  price: number;
  /** Success redirect URL / 成功重定向 URL */
  successUrl: string;
  /** Cancel redirect URL / 取消重定向 URL */
  cancelUrl: string;
  /** Optional product name / 可选的产品名称 */
  productName?: string;
}

/**
 * Success response interface
 * 成功响应接口
 */
interface StripePaymentResponse {
  /** Stripe checkout session URL / Stripe 结账会话 URL */
  url: string;
}

/**
 * Error response interface
 * 错误响应接口
 */
interface ErrorResponse {
  /** Error message / 错误消息 */
  error: string;
}

// Validate Stripe configuration / 验证 Stripe 配置
if (!process.env.STRIPE_PRIVATE_KEY) {
  throw new Error('STRIPE_PRIVATE_KEY is not set');
}

/**
 * Stripe client instance with latest API version
 * 使用最新 API 版本的 Stripe 客户端实例
 */
const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY, {
  apiVersion: '2025-02-24.acacia',
});

/**
 * POST /api/stripe - Create Stripe checkout session
 * POST /api/stripe - 创建 Stripe 结账会话
 *
 * @description Creates a new Stripe checkout session for payment processing.
 * Validates user authentication, processes payment data, and creates order records.
 * @description 创建新的 Stripe 结账会话用于支付处理。
 * 验证用户认证、处理支付数据并创建订单记录。
 *
 * @param request - HTTP request object containing payment data
 * @param request - 包含支付数据的 HTTP 请求对象
 * @returns Promise<NextResponse<StripePaymentResponse | ErrorResponse>>
 *
 * @requestBody StripePaymentRequest
 * ```json
 * {
 *   "email": "user@example.com",
 *   "price": 29.99,
 *   "successUrl": "https://example.com/success",
 *   "cancelUrl": "https://example.com/cancel",
 *   "productName": "Pro Plan Subscription"
 * }
 * ```
 *
 * @responses
 * - 200: StripePaymentResponse - Checkout session created successfully
 * - 200: StripePaymentResponse - 结账会话创建成功
 * - 400: ErrorResponse - Invalid price amount or request data
 * - 400: ErrorResponse - 无效的价格金额或请求数据
 * - 401: ErrorResponse - Authentication required
 * - 401: ErrorResponse - 需要认证
 * - 404: ErrorResponse - User not found in database
 * - 404: ErrorResponse - 数据库中未找到用户
 * - 500: ErrorResponse - Internal server error
 * - 500: ErrorResponse - 内部服务器错误
 *
 * @example Usage with fetch / 使用 fetch 的示例
 * ```typescript
 * const response = await fetch('/api/stripe', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     email: 'user@example.com',
 *     price: 29.99,
 *     successUrl: window.location.origin + '/success',
 *     cancelUrl: window.location.origin + '/cancel',
 *     productName: 'Pro Plan'
 *   })
 * });
 *
 * if (response.ok) {
 *   const { url } = await response.json();
 *   window.location.href = url; // Redirect to Stripe checkout
 * }
 * ```
 */
export async function POST(request: Request) {
  try {
    // Authenticate user session / 认证用户会话
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
