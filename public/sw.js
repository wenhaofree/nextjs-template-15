// Service Worker for caching optimization
const CACHE_NAME = 'nextjs-template-v1'
const STATIC_CACHE_NAME = 'static-v1'
const DYNAMIC_CACHE_NAME = 'dynamic-v1'

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/',
  '/styles/critical.css',
  '/styles/non-critical.css',
  '/manifest.json',
]

// 需要缓存的 API 路径
const CACHE_API_ROUTES = [
  '/api/posts',
  '/api/users',
]

// 安装事件
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
  self.skipWaiting()
})

// 激活事件
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (
            cacheName !== STATIC_CACHE_NAME &&
            cacheName !== DYNAMIC_CACHE_NAME
          ) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// 拦截请求
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // 只处理同源请求
  if (url.origin !== location.origin) {
    return
  }

  // 静态资源缓存策略
  if (request.destination === 'image' || request.destination === 'style' || request.destination === 'script') {
    event.respondWith(cacheFirst(request))
    return
  }

  // API 请求缓存策略
  if (url.pathname.startsWith('/api/')) {
    if (CACHE_API_ROUTES.some(route => url.pathname.startsWith(route))) {
      event.respondWith(staleWhileRevalidate(request))
    }
    return
  }

  // 页面请求缓存策略
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request))
    return
  }
})

// 缓存优先策略
async function cacheFirst(request) {
  const cache = await caches.open(STATIC_CACHE_NAME)
  const cached = await cache.match(request)
  
  if (cached) {
    return cached
  }
  
  try {
    const response = await fetch(request)
    if (response.status === 200) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    // 返回离线页面或默认响应
    return new Response('Offline', { status: 503 })
  }
}

// 网络优先策略
async function networkFirst(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME)
  
  try {
    const response = await fetch(request)
    if (response.status === 200) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    const cached = await cache.match(request)
    if (cached) {
      return cached
    }
    
    // 返回离线页面
    return new Response('Offline', { 
      status: 503,
      headers: { 'Content-Type': 'text/html' }
    })
  }
}

// 陈旧时重新验证策略
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME)
  const cached = await cache.match(request)
  
  // 后台更新缓存
  const fetchPromise = fetch(request).then((response) => {
    if (response.status === 200) {
      cache.put(request, response.clone())
    }
    return response
  })
  
  // 如果有缓存，立即返回缓存，否则等待网络请求
  return cached || fetchPromise
}

// 消息处理
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urlsToCache = event.data.payload
    caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
      cache.addAll(urlsToCache)
    })
  }
})
