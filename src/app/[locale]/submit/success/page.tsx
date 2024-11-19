'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

// 分离出支付状态检查组件
function PaymentStatus() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('CHECKOUT_SESSION_ID') || searchParams.get('session_id')
  const submissionName = searchParams.get('submission_name')
  const submissionUrl = searchParams.get('submission_url')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const verifySession = async () => {
      try {
        console.log('Page load details:', {
          fullUrl: window.location.href,
          pathname: window.location.pathname,
          search: window.location.search,
          rawParams: new URLSearchParams(window.location.search).toString()
        })
        
        console.log('Search params:', Object.fromEntries(searchParams.entries()))
        console.log('Session ID:', sessionId)
        
        if (!sessionId) {
          console.error('No session ID found in URL. Full URL:', window.location.href)
          setStatus('error')
          return
        }

        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            sessionId: sessionId,
            submissionName,
            submissionUrl
          }),
        })
        
        if (!response.ok) {
          console.error('Payment verification failed:', await response.text())
          throw new Error('Payment verification failed')
        }

        const data = await response.json()
        console.log('Verification response:', data)
        setStatus(data.status === 'complete' ? 'success' : 'error')
      } catch (error) {
        console.error('Verification error:', error)
        setStatus('error')
      }
    }
    verifySession()
  }, [sessionId, searchParams, submissionName, submissionUrl])

  // 加载中状态
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF]">
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">处理中...</h1>
            <p className="text-[#B0B0DA]">请稍候，我们正在处理您的提交</p>
          </div>
        </main>
      </div>
    )
  }

  // 支付成功状态
  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF]">
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4 text-[#32CD32]">支付成功！</h1>
            {submissionName && submissionUrl && (
              <p className="text-[#32CD32] mb-8">
                您的提交 "{submissionName}" 已记录！
              </p>
            )}
            <Button asChild>
              <Link href="/submit">继续提交</Link>
            </Button>
          </div>
        </main>
      </div>
    )
  }

  // 错误状态
  return (
    <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF]">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-500">无效的请求</h1>
          <p className="text-[#B0B0DA] mb-8">
            缺少必要的参数，请从正常流程访问此页面
          </p>
          <Button asChild variant="outline">
            <Link href="/submit">返回提交页面</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}

// 主页面组件
export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF]">
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">加载中...</h1>
            <p className="text-[#B0B0DA]">请稍候</p>
          </div>
        </main>
      </div>
    }>
      <PaymentStatus />
    </Suspense>
  )
} 