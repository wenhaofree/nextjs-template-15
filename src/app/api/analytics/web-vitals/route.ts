import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge' // 使用 Edge Runtime 提高性能

interface WebVitalMetric {
  id: string
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  entries: any[]
  navigationType: string
}

/**
 * 接收 Web Vitals 指标数据
 */
export async function POST(request: NextRequest) {
  try {
    const metric: WebVitalMetric = await request.json()
    
    // 验证指标数据
    if (!metric.name || typeof metric.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid metric data' },
        { status: 400 }
      )
    }

    // 在生产环境中，您可以：
    // 1. 存储到数据库
    // 2. 发送到分析服务（如 Google Analytics、Mixpanel 等）
    // 3. 发送到监控服务（如 DataDog、New Relic 等）
    
    if (process.env.NODE_ENV === 'production') {
      // 示例：记录到控制台（在实际应用中替换为真实的存储逻辑）
      console.log('Web Vital received:', {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        timestamp: new Date().toISOString(),
        userAgent: request.headers.get('user-agent'),
        url: request.headers.get('referer'),
      })

      // 示例：发送到外部分析服务
      // await sendToAnalyticsService(metric)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing web vital:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// 可选：添加 GET 方法来获取聚合的指标数据
export async function GET() {
  // 返回聚合的 Web Vitals 数据
  return NextResponse.json({
    message: 'Web Vitals analytics endpoint',
    endpoints: {
      POST: 'Submit web vital metrics',
      GET: 'Retrieve aggregated metrics (not implemented)'
    }
  })
}
