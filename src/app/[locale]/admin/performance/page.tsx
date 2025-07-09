import { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/loading-skeleton'

/**
 * 性能监控仪表板页面
 * 显示 Web Vitals 和其他性能指标
 */
export default function PerformancePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">性能监控仪表板</h1>
        <p className="text-muted-foreground mt-2">
          监控应用的核心网页指标和性能数据
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<MetricCardSkeleton />}>
          <WebVitalsCards />
        </Suspense>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>性能优化建议</CardTitle>
            <CardDescription>
              基于当前指标的优化建议
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-green-600">✅ 已优化</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• 使用 Next.js Image 组件进行图片优化</li>
                  <li>• 启用了 Gzip 压缩</li>
                  <li>• 配置了适当的缓存策略</li>
                  <li>• 使用了 Server Components 减少客户端 JS</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-yellow-600">⚠️ 可以改进</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>• 考虑启用 PPR (Partial Prerendering)</li>
                  <li>• 添加更多的 Suspense 边界</li>
                  <li>• 优化第三方脚本加载</li>
                  <li>• 实施更细粒度的代码分割</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function WebVitalsCards() {
  // 在实际应用中，这里会从数据库或分析服务获取真实数据
  const metrics = [
    {
      name: 'LCP',
      value: '1.2s',
      status: 'good',
      description: 'Largest Contentful Paint',
      target: '< 2.5s'
    },
    {
      name: 'FID',
      value: '45ms',
      status: 'good',
      description: 'First Input Delay',
      target: '< 100ms'
    },
    {
      name: 'CLS',
      value: '0.08',
      status: 'good',
      description: 'Cumulative Layout Shift',
      target: '< 0.1'
    },
    {
      name: 'FCP',
      value: '0.9s',
      status: 'good',
      description: 'First Contentful Paint',
      target: '< 1.8s'
    },
    {
      name: 'TTFB',
      value: '120ms',
      status: 'good',
      description: 'Time to First Byte',
      target: '< 600ms'
    },
    {
      name: 'INP',
      value: '85ms',
      status: 'good',
      description: 'Interaction to Next Paint',
      target: '< 200ms'
    }
  ]

  return (
    <>
      {metrics.map((metric) => (
        <Card key={metric.name}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              {metric.name}
            </CardTitle>
            <CardDescription className="text-xs">
              {metric.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-muted-foreground">
                目标: {metric.target}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                metric.status === 'good' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {metric.status === 'good' ? '良好' : '需改进'}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

function MetricCardSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-12 mb-2" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
