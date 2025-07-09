'use client'

import { useEffect } from 'react'
import { loadPolyfills, preloadCriticalResources } from '@/lib/modern-polyfills'
import { loadNonCriticalCSS, inlineCriticalCSS } from '@/lib/css-optimizer'

/**
 * 性能优化初始化组件
 * 在客户端启动时执行各种性能优化
 */
export function PerformanceInit() {
  useEffect(() => {
    // 立即执行的优化
    const immediateOptimizations = async () => {
      // 内联关键 CSS
      inlineCriticalCSS()
      
      // 预加载关键资源
      preloadCriticalResources()
      
      // 加载必要的 polyfills
      await loadPolyfills()
    }

    // 延迟执行的优化
    const deferredOptimizations = () => {
      // 使用 requestIdleCallback 在空闲时执行
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          loadNonCriticalCSS()
        }, { timeout: 2000 })
      } else {
        // 降级方案
        setTimeout(() => {
          loadNonCriticalCSS()
        }, 1000)
      }
    }

    // 执行优化
    immediateOptimizations()
    deferredOptimizations()

    // 监听页面可见性变化
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // 页面变为可见时的优化
        preloadCriticalResources()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // 清理
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // 监听网络状态变化
  useEffect(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      
      const handleConnectionChange = () => {
        const networkInfo = {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          saveData: connection.saveData
        }
        
        // 根据网络状况调整策略
        if (networkInfo.saveData || networkInfo.effectiveType === 'slow-2g') {
          // 数据节省模式或慢网络
          document.documentElement.classList.add('data-saver-mode')
        } else {
          document.documentElement.classList.remove('data-saver-mode')
        }
      }

      connection.addEventListener('change', handleConnectionChange)
      handleConnectionChange() // 初始检查

      return () => {
        connection.removeEventListener('change', handleConnectionChange)
      }
    }
  }, [])

  return null
}

// 数据节省模式的 CSS
const dataSaverCSS = `
  .data-saver-mode img[loading="lazy"] {
    background: #f0f0f0;
  }
  
  .data-saver-mode video {
    display: none;
  }
  
  .data-saver-mode .animation {
    animation: none !important;
  }
  
  .data-saver-mode .parallax {
    transform: none !important;
  }
`

// 注入数据节省模式样式
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = dataSaverCSS
  document.head.appendChild(style)
}
