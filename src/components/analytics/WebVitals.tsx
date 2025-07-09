'use client'

import { useReportWebVitals } from 'next/web-vitals'

/**
 * Web Vitals 监控组件
 * 收集和报告核心网页指标
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    // 在生产环境中，您可以将这些指标发送到分析服务
    if (process.env.NODE_ENV === 'production') {
      // 示例：发送到 Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
          custom_map: { metric_id: 'web_vitals' },
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          event_category: 'Web Vitals',
          event_label: metric.id,
          non_interaction: true,
        })
      }
      
      // 示例：发送到自定义分析端点
      fetch('/api/analytics/web-vitals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric),
      }).catch(console.error)
    } else {
      // 开发环境中记录到控制台
      console.log('Web Vital:', metric)
    }

    // 处理特定指标
    switch (metric.name) {
      case 'FCP': // First Contentful Paint
        if (metric.value > 3000) {
          console.warn('FCP is slow:', metric.value)
        }
        break
      case 'LCP': // Largest Contentful Paint
        if (metric.value > 4000) {
          console.warn('LCP is slow:', metric.value)
        }
        break
      case 'CLS': // Cumulative Layout Shift
        if (metric.value > 0.25) {
          console.warn('CLS is high:', metric.value)
        }
        break
      case 'FID': // First Input Delay
        if (metric.value > 300) {
          console.warn('FID is slow:', metric.value)
        }
        break
      case 'TTFB': // Time to First Byte
        if (metric.value > 1800) {
          console.warn('TTFB is slow:', metric.value)
        }
        break
      case 'INP': // Interaction to Next Paint
        if (metric.value > 500) {
          console.warn('INP is slow:', metric.value)
        }
        break
      // Next.js 特定指标
      case 'Next.js-hydration':
        console.log('Hydration time:', metric.value)
        break
      case 'Next.js-route-change-to-render':
        console.log('Route change time:', metric.value)
        break
      case 'Next.js-render':
        console.log('Render time:', metric.value)
        break
    }
  })

  return null
}

// 扩展 Window 接口以支持 gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void
  }
}
