'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'

/**
 * Cookie 同意管理组件
 * 处理第三方 Cookie 和隐私合规
 */
export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false)
  const [preferences, setPreferences] = useState({
    necessary: true, // 必要 Cookie 始终启用
    analytics: false,
    marketing: false,
    functional: false,
  })

  useEffect(() => {
    // 检查用户是否已经做出选择
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setShowConsent(true)
    } else {
      const savedPreferences = JSON.parse(consent)
      setPreferences(savedPreferences)
      applyCookieSettings(savedPreferences)
    }
  }, [])

  const applyCookieSettings = (settings: typeof preferences) => {
    // 应用 Cookie 设置
    if (settings.analytics) {
      // 启用分析 Cookie
      enableAnalytics()
    } else {
      // 禁用分析 Cookie
      disableAnalytics()
    }

    if (settings.marketing) {
      // 启用营销 Cookie
      enableMarketing()
    } else {
      // 禁用营销 Cookie
      disableMarketing()
    }

    if (settings.functional) {
      // 启用功能性 Cookie
      enableFunctional()
    } else {
      // 禁用功能性 Cookie
      disableFunctional()
    }
  }

  const enableAnalytics = () => {
    // Google Analytics 等分析工具
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted'
      })
    }
  }

  const disableAnalytics = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied'
      })
    }
  }

  const enableMarketing = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted'
      })
    }
  }

  const disableMarketing = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied'
      })
    }
  }

  const enableFunctional = () => {
    // 功能性 Cookie（如主题设置、语言偏好等）
    document.cookie = 'functional_cookies=enabled; path=/; max-age=31536000; SameSite=Lax'
  }

  const disableFunctional = () => {
    document.cookie = 'functional_cookies=disabled; path=/; max-age=31536000; SameSite=Lax'
  }

  const handleAcceptAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    }
    setPreferences(newPreferences)
    localStorage.setItem('cookie-consent', JSON.stringify(newPreferences))
    applyCookieSettings(newPreferences)
    setShowConsent(false)
  }

  const handleRejectAll = () => {
    const newPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false,
    }
    setPreferences(newPreferences)
    localStorage.setItem('cookie-consent', JSON.stringify(newPreferences))
    applyCookieSettings(newPreferences)
    setShowConsent(false)
  }

  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences))
    applyCookieSettings(preferences)
    setShowConsent(false)
  }

  if (!showConsent) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-md">
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Cookie 设置</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConsent(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            我们使用 Cookie 来改善您的体验。您可以选择接受所有 Cookie 或自定义设置。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">必要 Cookie</p>
                <p className="text-sm text-muted-foreground">网站正常运行所必需</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.necessary}
                disabled
                className="rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">分析 Cookie</p>
                <p className="text-sm text-muted-foreground">帮助我们了解网站使用情况</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                className="rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">营销 Cookie</p>
                <p className="text-sm text-muted-foreground">用于个性化广告</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                className="rounded"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">功能性 Cookie</p>
                <p className="text-sm text-muted-foreground">记住您的偏好设置</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.functional}
                onChange={(e) => setPreferences(prev => ({ ...prev, functional: e.target.checked }))}
                className="rounded"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex gap-2">
              <Button onClick={handleAcceptAll} className="flex-1">
                接受全部
              </Button>
              <Button onClick={handleRejectAll} variant="outline" className="flex-1">
                拒绝全部
              </Button>
            </div>
            <Button onClick={handleSavePreferences} variant="secondary" className="w-full">
              保存设置
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// 扩展 Window 接口
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void
  }
}
