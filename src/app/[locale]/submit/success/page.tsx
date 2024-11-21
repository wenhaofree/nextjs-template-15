'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useSession } from "next-auth/react"
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

// 分离出支付状态检查组件
function PaymentStatus() {
  const t = useTranslations('SubmitSuccess')
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('CHECKOUT_SESSION_ID') || searchParams.get('session_id')
  const submissionName = searchParams.get('submission_name')
  const submissionUrl = searchParams.get('submission_url')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const { data: session } = useSession()

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
        
        const response = await fetch('/api/stripe/verify-payment', {
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

        //更新登录态用户的订阅计划
        if (session?.user) {
          if (session.user.level==='free'|| session.user.level==='one-time'){
            session.user.level = data.metadata.planType
          }else if (session.user.level==='unlimited' && data.metadata.planType==='sponsor'){
            session.user.level = data.metadata.planType
          }
          // session.user.level = data.metadata.planType
          console.log('Update user level:', data.metadata.planType)          
        }
        
      } catch (error) {
        console.error('Verification error:', error)
        setStatus('error')
      }
    }
    verifySession()
  }, [sessionId, searchParams, submissionName, submissionUrl, session?.user])

  // 加载中状态
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF]">
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">{t('loading.title')}</h1>
            <p className="text-[#B0B0DA]">{t('loading.description')}</p>
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
            <h1 className="text-2xl font-bold mb-4 text-[#32CD32]">{t('success.title')}</h1>
            {submissionName && submissionUrl && (
              <p className="text-[#32CD32] mb-8">
                {t('success.description', { name: submissionName })}
              </p>
            )}
            <Button asChild>
              <Link href="/submit">{t('success.button')}</Link>
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
          <h1 className="text-2xl font-bold mb-4 text-red-500">{t('error.title')}</h1>
          <p className="text-[#B0B0DA] mb-8">
            {t('error.description')}
          </p>
          <Button asChild variant="outline">
            <Link href="/submit">{t('error.button')}</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}

// 主页面组件
export default function SuccessPage() {
  const t = useTranslations('SubmitSuccess')
  
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF]">
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">{t('loading.title')}</h1>
            <p className="text-[#B0B0DA]">{t('loading.description')}</p>
          </div>
        </main>
      </div>
    }>
      <PaymentStatus />
    </Suspense>
  )
} 