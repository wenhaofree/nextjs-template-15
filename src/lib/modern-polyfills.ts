/**
 * 现代浏览器 Polyfills
 * 只为需要的功能添加最小的 polyfills
 */

// 检查是否需要 polyfills
export function needsPolyfills(): boolean {
  if (typeof window === 'undefined') return false
  
  // 检查现代浏览器特性
  const hasModernFeatures = 
    'IntersectionObserver' in window &&
    'ResizeObserver' in window &&
    'fetch' in window &&
    'Promise' in window &&
    'Map' in window &&
    'Set' in window

  return !hasModernFeatures
}

// 动态加载 polyfills
export async function loadPolyfills(): Promise<void> {
  if (!needsPolyfills()) return

  // 简化的 polyfill 实现，避免外部依赖
  const polyfills = []

  // IntersectionObserver polyfill (简化版)
  if (!('IntersectionObserver' in window)) {
    polyfills.push(
      Promise.resolve().then(() => {
        // 简单的 IntersectionObserver polyfill
        if (!window.IntersectionObserver) {
          window.IntersectionObserver = class {
            constructor(_callback: any) {
              // 简化实现
            }
            observe() {}
            unobserve() {}
            disconnect() {}
          } as any
        }
      }).catch(() => {
        console.warn('Failed to load IntersectionObserver polyfill')
      })
    )
  }

  // ResizeObserver polyfill (简化版)
  if (!('ResizeObserver' in window)) {
    polyfills.push(
      Promise.resolve().then(() => {
        if (!window.ResizeObserver) {
          window.ResizeObserver = class {
            constructor(_callback: any) {
              // 简化实现
            }
            observe() {}
            unobserve() {}
            disconnect() {}
          } as any
        }
      }).catch(() => {
        console.warn('Failed to load ResizeObserver polyfill')
      })
    )
  }

  await Promise.all(polyfills)
}

// 浏览器能力检测
export const browserCapabilities = {
  // 检查是否支持现代图片格式
  supportsWebP: (): Promise<boolean> => {
    return new Promise((resolve) => {
      const webP = new Image()
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2)
      }
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
    })
  },

  // 检查是否支持 AVIF
  supportsAVIF: (): Promise<boolean> => {
    return new Promise((resolve) => {
      const avif = new Image()
      avif.onload = avif.onerror = () => {
        resolve(avif.height === 2)
      }
      avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A='
    })
  },

  // 检查是否支持原生懒加载
  supportsNativeLazyLoading: (): boolean => {
    return 'loading' in HTMLImageElement.prototype
  },

  // 检查是否支持 Web Workers
  supportsWebWorkers: (): boolean => {
    return typeof Worker !== 'undefined'
  },

  // 检查是否支持 Service Workers
  supportsServiceWorkers: (): boolean => {
    return 'serviceWorker' in navigator
  },

  // 检查网络连接质量
  getNetworkInfo: () => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      }
    }
    return null
  }
}

// 根据网络条件调整资源加载
export function getOptimalImageQuality(): number {
  const networkInfo = browserCapabilities.getNetworkInfo()
  
  if (!networkInfo) return 85 // 默认质量
  
  switch (networkInfo.effectiveType) {
    case 'slow-2g':
    case '2g':
      return 60
    case '3g':
      return 75
    case '4g':
    default:
      return 85
  }
}

// 预加载关键资源
export function preloadCriticalResources(): void {
  if (typeof window === 'undefined') return

  // 预加载关键字体 - 检查文件是否存在
  const preloadResource = (href: string, as: string, type?: string, crossOrigin?: string) => {
    fetch(href, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          const link = document.createElement('link')
          link.rel = 'preload'
          link.href = href
          link.as = as
          if (type) link.type = type
          if (crossOrigin) link.crossOrigin = crossOrigin
          document.head.appendChild(link)
        }
      })
      .catch(() => {
        // 文件不存在，忽略错误
      })
  }

  // 预加载存在的资源
  preloadResource('/fonts/inter-var.woff2', 'font', 'font/woff2', 'anonymous')
  preloadResource('/styles/critical.css', 'style')
}
