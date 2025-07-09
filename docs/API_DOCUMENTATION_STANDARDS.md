# API Documentation Standards / API 文档标准

## Overview / 概述

This document establishes comprehensive documentation standards for API routes in the ShipSaaS project, supporting both English and Chinese languages.

本文档为 ShipSaaS 项目中的 API 路由建立了全面的文档标准，支持英文和中文两种语言。

## API Route Documentation Structure / API 路由文档结构

### 1. Route File Header / 路由文件头部

Every API route file should start with comprehensive documentation:

每个 API 路由文件都应该以全面的文档开始：

```typescript
/**
 * API Route: [Route Name] / API 路由：[路由名称]
 * 
 * @description Brief description of the API endpoint's purpose and functionality
 * @description API 端点用途和功能的简要描述
 * 
 * @route [HTTP_METHOD] /api/[route-path]
 * @access [Public/Private/Admin] - Access level required
 * @access [公开/私有/管理员] - 所需访问级别
 * 
 * @author ShipSaaS.CO
 * @version 1.0.0
 * @since 2024-01-01
 */
```

### 2. Request/Response Documentation / 请求/响应文档

Document all request and response schemas:

记录所有请求和响应模式：

```typescript
/**
 * Request Body Schema / 请求体模式
 */
interface RequestBody {
  /**
   * User email address
   * 用户邮箱地址
   * @example "user@example.com"
   */
  email: string;
  
  /**
   * Product price in USD
   * 产品价格（美元）
   * @minimum 0.01
   * @maximum 999999.99
   * @example 29.99
   */
  price: number;
  
  /**
   * Optional product name
   * 可选的产品名称
   * @default "Purchase"
   * @example "Pro Plan Subscription"
   */
  productName?: string;
}

/**
 * Success Response Schema / 成功响应模式
 */
interface SuccessResponse {
  /**
   * Stripe checkout session URL
   * Stripe 结账会话 URL
   * @example "https://checkout.stripe.com/pay/cs_test_..."
   */
  url: string;
  
  /**
   * Order ID for tracking
   * 用于跟踪的订单 ID
   * @example "ord_1234567890"
   */
  orderId: string;
}

/**
 * Error Response Schema / 错误响应模式
 */
interface ErrorResponse {
  /**
   * Error message
   * 错误消息
   * @example "Authentication required"
   */
  error: string;
  
  /**
   * Error code for programmatic handling
   * 用于程序化处理的错误代码
   * @example "AUTH_REQUIRED"
   */
  code?: string;
}
```

## HTTP Method Documentation / HTTP 方法文档

### 1. GET Endpoints / GET 端点

```typescript
/**
 * GET /api/orders - Retrieve user orders
 * GET /api/orders - 获取用户订单
 * 
 * @description Retrieves a paginated list of orders for the authenticated user
 * @description 获取已认证用户的分页订单列表
 * 
 * @authentication Required - User must be logged in
 * @authentication 必需 - 用户必须已登录
 * 
 * @queryParams
 * - page?: number - Page number (default: 1) / 页码（默认：1）
 * - limit?: number - Items per page (default: 10, max: 100) / 每页项目数（默认：10，最大：100）
 * - status?: string - Filter by order status / 按订单状态筛选
 * 
 * @responses
 * - 200: Success with orders list / 成功返回订单列表
 * - 401: Authentication required / 需要认证
 * - 500: Internal server error / 内部服务器错误
 * 
 * @example
 * ```
 * GET /api/orders?page=1&limit=10&status=paid
 * ```
 */
export async function GET(request: Request) {
  // Implementation
}
```

### 2. POST Endpoints / POST 端点

```typescript
/**
 * POST /api/stripe - Create Stripe checkout session
 * POST /api/stripe - 创建 Stripe 结账会话
 * 
 * @description Creates a new Stripe checkout session for payment processing
 * @description 创建新的 Stripe 结账会话用于支付处理
 * 
 * @authentication Required - User must be logged in
 * @authentication 必需 - 用户必须已登录
 * 
 * @requestBody RequestBody - Payment details
 * @requestBody RequestBody - 支付详情
 * 
 * @responses
 * - 200: SuccessResponse - Checkout session created successfully
 * - 200: SuccessResponse - 结账会话创建成功
 * - 400: ErrorResponse - Invalid request data
 * - 400: ErrorResponse - 无效的请求数据
 * - 401: ErrorResponse - Authentication required
 * - 401: ErrorResponse - 需要认证
 * - 500: ErrorResponse - Internal server error
 * - 500: ErrorResponse - 内部服务器错误
 * 
 * @example
 * ```typescript
 * const response = await fetch('/api/stripe', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     email: 'user@example.com',
 *     price: 29.99,
 *     productName: 'Pro Plan'
 *   })
 * });
 * ```
 */
export async function POST(request: Request) {
  // Implementation
}
```

### 3. PUT/PATCH Endpoints / PUT/PATCH 端点

```typescript
/**
 * PATCH /api/users/[id] - Update user profile
 * PATCH /api/users/[id] - 更新用户资料
 * 
 * @description Updates specific fields of a user profile
 * @description 更新用户资料的特定字段
 * 
 * @authentication Required - User must own the profile or be admin
 * @authentication 必需 - 用户必须拥有该资料或为管理员
 * 
 * @pathParams
 * - id: string - User ID / 用户 ID
 * 
 * @requestBody Partial<UserProfile> - Fields to update
 * @requestBody Partial<UserProfile> - 要更新的字段
 * 
 * @responses
 * - 200: UpdatedUser - User updated successfully
 * - 200: UpdatedUser - 用户更新成功
 * - 400: ErrorResponse - Invalid data
 * - 400: ErrorResponse - 无效数据
 * - 403: ErrorResponse - Insufficient permissions
 * - 403: ErrorResponse - 权限不足
 * - 404: ErrorResponse - User not found
 * - 404: ErrorResponse - 用户未找到
 */
export async function PATCH(request: Request) {
  // Implementation
}
```

### 4. DELETE Endpoints / DELETE 端点

```typescript
/**
 * DELETE /api/orders/[id] - Cancel order
 * DELETE /api/orders/[id] - 取消订单
 * 
 * @description Cancels an order if it's in a cancellable state
 * @description 如果订单处于可取消状态则取消订单
 * 
 * @authentication Required - User must own the order
 * @authentication 必需 - 用户必须拥有该订单
 * 
 * @pathParams
 * - id: string - Order ID / 订单 ID
 * 
 * @responses
 * - 200: { message: string } - Order cancelled successfully
 * - 200: { message: string } - 订单取消成功
 * - 400: ErrorResponse - Order cannot be cancelled
 * - 400: ErrorResponse - 订单无法取消
 * - 404: ErrorResponse - Order not found
 * - 404: ErrorResponse - 订单未找到
 */
export async function DELETE(request: Request) {
  // Implementation
}
```

## Error Handling Documentation / 错误处理文档

### 1. Standard Error Codes / 标准错误代码

```typescript
/**
 * Standard API Error Codes / 标准 API 错误代码
 */
enum ApiErrorCodes {
  // Authentication errors / 认证错误
  AUTH_REQUIRED = 'AUTH_REQUIRED',           // 需要认证
  INVALID_TOKEN = 'INVALID_TOKEN',           // 无效令牌
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',           // 令牌已过期
  
  // Authorization errors / 授权错误
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS', // 权限不足
  RESOURCE_FORBIDDEN = 'RESOURCE_FORBIDDEN',             // 资源被禁止
  
  // Validation errors / 验证错误
  INVALID_INPUT = 'INVALID_INPUT',           // 无效输入
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD', // 缺少必需字段
  INVALID_FORMAT = 'INVALID_FORMAT',         // 格式无效
  
  // Resource errors / 资源错误
  RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND', // 资源未找到
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',   // 资源冲突
  RESOURCE_GONE = 'RESOURCE_GONE',           // 资源已删除
  
  // Payment errors / 支付错误
  PAYMENT_FAILED = 'PAYMENT_FAILED',         // 支付失败
  INSUFFICIENT_FUNDS = 'INSUFFICIENT_FUNDS', // 资金不足
  PAYMENT_CANCELLED = 'PAYMENT_CANCELLED',   // 支付已取消
  
  // Server errors / 服务器错误
  INTERNAL_ERROR = 'INTERNAL_ERROR',         // 内部错误
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE', // 服务不可用
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'  // 超出速率限制
}
```

### 2. Error Response Helper / 错误响应助手

```typescript
/**
 * Creates standardized error responses
 * 创建标准化错误响应
 * 
 * @param code - Error code / 错误代码
 * @param message - Error message / 错误消息
 * @param status - HTTP status code / HTTP 状态代码
 * @returns NextResponse with error / 包含错误的 NextResponse
 */
function createErrorResponse(
  code: ApiErrorCodes,
  message: string,
  status: number
): NextResponse {
  return NextResponse.json(
    { error: message, code },
    { status }
  );
}

/**
 * Common error responses / 常见错误响应
 */
const ErrorResponses = {
  // 401 Unauthorized / 401 未授权
  authRequired: () => createErrorResponse(
    ApiErrorCodes.AUTH_REQUIRED,
    'Authentication required',
    401
  ),
  
  // 403 Forbidden / 403 禁止
  insufficientPermissions: () => createErrorResponse(
    ApiErrorCodes.INSUFFICIENT_PERMISSIONS,
    'Insufficient permissions',
    403
  ),
  
  // 404 Not Found / 404 未找到
  notFound: (resource: string) => createErrorResponse(
    ApiErrorCodes.RESOURCE_NOT_FOUND,
    `${resource} not found`,
    404
  ),
  
  // 400 Bad Request / 400 错误请求
  invalidInput: (field: string) => createErrorResponse(
    ApiErrorCodes.INVALID_INPUT,
    `Invalid ${field}`,
    400
  ),
  
  // 500 Internal Server Error / 500 内部服务器错误
  internalError: () => createErrorResponse(
    ApiErrorCodes.INTERNAL_ERROR,
    'Internal server error',
    500
  )
};
```

## Security Documentation / 安全文档

### 1. Authentication Requirements / 认证要求

```typescript
/**
 * Authentication middleware for protected routes
 * 受保护路由的认证中间件
 * 
 * @description Validates user session and returns user data
 * @description 验证用户会话并返回用户数据
 * 
 * @returns User session data or null if not authenticated
 * @returns 用户会话数据，如果未认证则返回 null
 * 
 * @throws 401 if authentication is required but not provided
 * @throws 如果需要认证但未提供则抛出 401
 */
async function requireAuth(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    throw createErrorResponse(
      ApiErrorCodes.AUTH_REQUIRED,
      'Authentication required',
      401
    );
  }
  
  return session;
}
```

### 2. Input Validation / 输入验证

```typescript
/**
 * Validates and sanitizes request input
 * 验证和清理请求输入
 * 
 * @param data - Raw input data / 原始输入数据
 * @param schema - Validation schema / 验证模式
 * @returns Validated and sanitized data / 验证和清理后的数据
 * 
 * @throws 400 if validation fails / 如果验证失败则抛出 400
 */
function validateInput<T>(data: unknown, schema: ValidationSchema<T>): T {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    throw createErrorResponse(
      ApiErrorCodes.INVALID_INPUT,
      'Invalid input data',
      400
    );
  }
  
  return result.data;
}
```

## Testing Documentation / 测试文档

### 1. API Testing Examples / API 测试示例

```typescript
/**
 * Test cases for API endpoints
 * API 端点的测试用例
 * 
 * @example Testing successful payment creation
 * @example 测试成功的支付创建
 * ```typescript
 * describe('POST /api/stripe', () => {
 *   it('should create checkout session successfully', async () => {
 *     const response = await request(app)
 *       .post('/api/stripe')
 *       .set('Authorization', `Bearer ${validToken}`)
 *       .send({
 *         email: 'test@example.com',
 *         price: 29.99,
 *         productName: 'Test Product'
 *       });
 *     
 *     expect(response.status).toBe(200);
 *     expect(response.body).toHaveProperty('url');
 *     expect(response.body.url).toMatch(/^https:\/\/checkout\.stripe\.com/);
 *   });
 * });
 * ```
 */
```

## Best Practices / 最佳实践

### 1. Documentation Guidelines / 文档指南

- Always provide both English and Chinese descriptions
- Document all possible response codes and their meanings
- Include practical usage examples with curl or fetch
- Explain authentication and authorization requirements clearly
- Document rate limiting and usage restrictions

- 始终提供英文和中文描述
- 记录所有可能的响应代码及其含义
- 包含使用 curl 或 fetch 的实际使用示例
- 清楚地解释认证和授权要求
- 记录速率限制和使用限制

### 2. API Design Guidelines / API 设计指南

- Use consistent naming conventions for endpoints
- Follow RESTful principles where applicable
- Provide meaningful error messages
- Implement proper HTTP status codes
- Use standard request/response formats

- 为端点使用一致的命名约定
- 在适用的地方遵循 RESTful 原则
- 提供有意义的错误消息
- 实现适当的 HTTP 状态代码
- 使用标准的请求/响应格式
