/**
 * CSS 优化工具
 * 动态加载和优化 CSS
 */

// 关键 CSS 内联
export const criticalCSS = `
  /* 关键路径 CSS - 首屏渲染必需 */
  html, body {
    margin: 0;
    padding: 0;
    font-family: var(--font-inter), system-ui, sans-serif;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  /* 防止布局偏移的基础样式 */
  img, video {
    max-width: 100%;
    height: auto;
  }
  
  /* 加载状态样式 */
  .loading-skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }
  
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
  /* 关键按钮样式 */
  .btn-primary {
    background: #0070f3;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .btn-primary:hover {
    background: #0051cc;
  }
`

// 非关键 CSS 延迟加载
export function loadNonCriticalCSS(): void {
  if (typeof window === 'undefined') return

  // 延迟加载非关键 CSS - 直接加载，避免额外的HEAD请求
  const loadCSS = (href: string) => {
    // 检查是否已经加载过
    const existingLink = document.querySelector(`link[href="${href}"]`)
    if (existingLink) return

    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.media = 'print'
    link.onload = () => {
      link.media = 'all'
    }
    link.onerror = () => {
      // 如果加载失败，移除link元素
      link.remove()
      console.debug(`Failed to load CSS: ${href}`)
    }
    document.head.appendChild(link)
  }

  // 使用 requestIdleCallback 在空闲时加载
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      // 加载非关键CSS文件
      loadCSS('/styles/non-critical.css')
    }, { timeout: 3000 })
  } else {
    // 降级方案
    setTimeout(() => {
      loadCSS('/styles/non-critical.css')
    }, 1000)
  }
}

// 简化的 CSS 优化 - 移除复杂的运行时 CSS 清理
// 注意：运行时移除 CSS 规则可能导致样式问题，建议使用构建时优化
export function removeUnusedCSS(): void {
  if (typeof window === 'undefined') return

  // 简化版本：只在开发环境中记录未使用的类
  if (process.env.NODE_ENV === 'development') {
    console.log('CSS optimization: Use build-time tools like PurgeCSS for production')
  }

  // 实际的 CSS 优化应该在构建时进行，而不是运行时
  // 建议使用 Tailwind CSS 的内置 purge 功能或 PurgeCSS
}

// CSS 压缩工具
export function compressCSS(css: string): string {
  return css
    // 移除注释
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // 移除多余空白
    .replace(/\s+/g, ' ')
    // 移除分号前的空格
    .replace(/\s*;\s*/g, ';')
    // 移除大括号前后的空格
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    // 移除冒号后的空格
    .replace(/:\s+/g, ':')
    // 移除逗号后的空格
    .replace(/,\s+/g, ',')
    // 移除开头和结尾的空格
    .trim()
}

// 内联关键 CSS
export function inlineCriticalCSS(): void {
  if (typeof document === 'undefined') return

  // 首先内联基础关键CSS
  const style = document.createElement('style')
  style.textContent = compressCSS(criticalCSS)
  style.setAttribute('data-critical', 'inline')
  document.head.insertBefore(style, document.head.firstChild)

  // 然后尝试加载外部关键CSS文件
  const criticalCSSPath = '/styles/critical.css'
  fetch(criticalCSSPath)
    .then(response => {
      if (response.ok) {
        return response.text()
      }
      throw new Error('Critical CSS not found')
    })
    .then(cssText => {
      const externalStyle = document.createElement('style')
      externalStyle.textContent = compressCSS(cssText)
      externalStyle.setAttribute('data-critical', 'external')
      document.head.insertBefore(externalStyle, style.nextSibling)
    })
    .catch(() => {
      console.debug('External critical CSS not found, using inline version only')
    })
}
