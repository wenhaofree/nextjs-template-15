'use client'

import { useEffect } from 'react'

/**
 * Service Worker 注册组件
 * 用于缓存优化和离线支持
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      // 注册 Service Worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
          
          // 检查更新
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed') {
                  if (navigator.serviceWorker.controller) {
                    // 新的 SW 可用，提示用户刷新
                    showUpdateAvailable()
                  }
                }
              })
            }
          })
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })

      // 监听 SW 消息
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'CACHE_UPDATED') {
          console.log('Cache updated:', event.data.payload)
        }
      })

      // 预缓存关键资源
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.active) {
          registration.active.postMessage({
            type: 'CACHE_URLS',
            payload: [
              '/',
              '/en',
              '/zh',
              '/styles/critical.css',
              '/styles/non-critical.css',
            ]
          })
        }
      })
    }
  }, [])

  const showUpdateAvailable = () => {
    // 可以显示一个通知让用户知道有更新
    if (confirm('应用有新版本可用，是否立即更新？')) {
      window.location.reload()
    }
  }

  return null
}

/**
 * 手动触发 Service Worker 更新
 */
export function updateServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.update()
    })
  }
}

/**
 * 获取缓存状态
 */
export async function getCacheStatus() {
  if ('caches' in window) {
    const cacheNames = await caches.keys()
    const cacheStatus = await Promise.all(
      cacheNames.map(async (name) => {
        const cache = await caches.open(name)
        const keys = await cache.keys()
        return {
          name,
          size: keys.length,
          urls: keys.map(request => request.url)
        }
      })
    )
    return cacheStatus
  }
  return []
}

/**
 * 清除所有缓存
 */
export async function clearAllCaches() {
  if ('caches' in window) {
    const cacheNames = await caches.keys()
    await Promise.all(
      cacheNames.map(name => caches.delete(name))
    )
    console.log('All caches cleared')
  }
}
