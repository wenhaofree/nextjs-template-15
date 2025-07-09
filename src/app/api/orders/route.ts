/**
 * Orders API Route / 订单 API 路由
 *
 * @description Handles order management operations including retrieving user orders
 * and creating new order records. Supports authentication and data validation.
 * @description 处理订单管理操作，包括检索用户订单和创建新订单记录。支持认证和数据验证。
 *
 * @routes
 * - GET /api/orders - Retrieve user orders
 * - POST /api/orders - Create new order
 *
 * @路由
 * - GET /api/orders - 检索用户订单
 * - POST /api/orders - 创建新订单
 *
 * @access Private - Requires user authentication
 * @access 私有 - 需要用户认证
 *
 * @author ShipSaaS.CO
 * @version 1.0.0
 * @since 2024-01-01
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { config as authOptions } from '@/auth.config';

/**
 * Order status enumeration
 * 订单状态枚举
 */
type OrderStatus = 'pending' | 'paid' | 'failed' | 'expired';

/**
 * Order response interface
 * 订单响应接口
 */
interface OrderResponse {
  /** Unique order identifier / 唯一订单标识符 */
  orderNo: string;
  /** User UUID / 用户 UUID */
  userUuid: string;
  /** User email address / 用户邮箱地址 */
  userEmail: string;
  /** Order amount in cents / 订单金额（分） */
  amount: number;
  /** Billing interval / 计费间隔 */
  interval?: string;
  /** Order status / 订单状态 */
  status: OrderStatus;
  /** Credits included / 包含的积分 */
  credits: number;
  /** Currency code / 货币代码 */
  currency: string;
  /** Product ID / 产品 ID */
  productId?: string;
  /** Product name / 产品名称 */
  productName: string;
  /** Valid months / 有效月数 */
  validMonths?: number;
  /** Order details / 订单详情 */
  orderDetail?: string;
  /** Order creation date / 订单创建日期 */
  createdAt: Date;
  /** Order update date / 订单更新日期 */
  updatedAt: Date;
}

/**
 * Create order request interface
 * 创建订单请求接口
 */
interface CreateOrderRequest {
  /** Order number / 订单号 */
  orderNo: string;
  /** User UUID / 用户 UUID */
  userUuid: string;
  /** User email / 用户邮箱 */
  userEmail: string;
  /** Amount in cents / 金额（分） */
  amount: number;
  /** Billing interval / 计费间隔 */
  interval?: string;
  /** Order status / 订单状态 */
  status: OrderStatus;
  /** Credits / 积分 */
  credits: number;
  /** Currency / 货币 */
  currency: string;
  /** Product ID / 产品 ID */
  productId?: string;
  /** Product name / 产品名称 */
  productName: string;
  /** Valid months / 有效月数 */
  validMonths?: number;
  /** Order details / 订单详情 */
  orderDetail?: string;
}

/**
 * Error response interface
 * 错误响应接口
 */
interface ErrorResponse {
  /** Error message / 错误消息 */
  error: string;
}

/**
 * GET /api/orders - Retrieve user orders
 * GET /api/orders - 检索用户订单
 *
 * @description Retrieves all orders for the authenticated user, sorted by creation date (newest first).
 * @description 检索已认证用户的所有订单，按创建日期排序（最新的在前）。
 *
 * @authentication Required - User must be logged in
 * @authentication 必需 - 用户必须已登录
 *
 * @responses
 * - 200: OrderResponse[] - Array of user orders
 * - 200: OrderResponse[] - 用户订单数组
 * - 401: ErrorResponse - User not authenticated
 * - 401: ErrorResponse - 用户未认证
 * - 404: ErrorResponse - User not found in database
 * - 404: ErrorResponse - 数据库中未找到用户
 * - 500: ErrorResponse - Internal server error
 * - 500: ErrorResponse - 内部服务器错误
 *
 * @example Usage / 使用示例
 * ```typescript
 * const response = await fetch('/api/orders', {
 *   method: 'GET',
 *   headers: {
 *     'Authorization': 'Bearer ' + sessionToken
 *   }
 * });
 *
 * if (response.ok) {
 *   const orders = await response.json();
 *   console.log('User orders:', orders);
 * }
 * ```
 */
export async function GET() {
  try {
    // Authenticate user session / 认证用户会话
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user in database by email / 通过邮箱在数据库中查找用户
    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Retrieve user's orders sorted by creation date (newest first)
    // 检索用户订单，按创建日期排序（最新的在前）
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

/**
 * POST /api/orders - Create new order
 * POST /api/orders - 创建新订单
 *
 * @description Creates a new order record in the database with the provided order data.
 * Validates user authentication and processes the order information.
 * @description 使用提供的订单数据在数据库中创建新的订单记录。
 * 验证用户认证并处理订单信息。
 *
 * @authentication Required - User must be logged in
 * @authentication 必需 - 用户必须已登录
 *
 * @requestBody CreateOrderRequest - Order creation data
 * @requestBody CreateOrderRequest - 订单创建数据
 *
 * @responses
 * - 200: OrderResponse - Order created successfully
 * - 200: OrderResponse - 订单创建成功
 * - 401: ErrorResponse - User not authenticated
 * - 401: ErrorResponse - 用户未认证
 * - 500: ErrorResponse - Internal server error
 * - 500: ErrorResponse - 内部服务器错误
 *
 * @example Usage / 使用示例
 * ```typescript
 * const orderData = {
 *   orderNo: 'ORD-123456',
 *   userUuid: 'user-uuid',
 *   userEmail: 'user@example.com',
 *   amount: 2999, // $29.99 in cents
 *   status: 'pending',
 *   credits: 100,
 *   currency: 'usd',
 *   productName: 'Pro Plan'
 * };
 *
 * const response = await fetch('/api/orders', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify(orderData)
 * });
 * ```
 */
export async function POST(request: Request) {
  try {
    // Authenticate user session / 认证用户会话
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body / 解析请求体
    const json = await request.json();

    // Create new order in database / 在数据库中创建新订单
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
