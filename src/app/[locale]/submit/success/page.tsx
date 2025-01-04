'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useSession } from "next-auth/react"
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'

type PaymentStatus = 'loading' | 'success' | 'error' | 'pending'

function PaymentStatus() {
  const t = useTranslations('SubmitSuccess')
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get('session_id')
  const submissionName = searchParams.get('submission_name')
  const submissionUrl = searchParams.get('submission_url')
  const [status, setStatus] = useState<PaymentStatus>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const { data: session, update } = useSession()

  useEffect(() => {
    const verifySession = async () => {
      try {
        if (!sessionId) {
          setStatus('error')
          setErrorMessage(t('error.noSessionId'))
          return
        }
        
        const response = await fetch('/api/stripe/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            sessionId,
            submissionName,
            submissionUrl
          }),
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || t('error.verification'))
        }
        
        const data = await response.json()
        
        if (data.status === 'pending') {
          setStatus('pending')
          // 5秒后重试
          setTimeout(verifySession, 5000)
          return
        }

        if (data.status === 'error' || data.status === 'failed') {
          router.push(`/submit/failed?error=${encodeURIComponent(data.message)}`)
          return
        }

        setStatus('success')

        // 更新会话状态
        if (session?.user && data.metadata?.planType) {
          await update({
            ...session,
            user: {
              ...session.user,
              level: data.metadata.planType
            }
          })
        }
        
      } catch (error) {
        console.error('Verification error:', error)
        setStatus('error')
        setErrorMessage(error instanceof Error ? error.message : t('error.unknown'))
      }
    }

    verifySession()
  }, [sessionId, submissionName, submissionUrl, session, t, router, update])

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <Loader2 className="h-16 w-16 animate-spin text-[#7B68EE] mb-4" />
            <h1 className="text-2xl font-bold mb-4">{t('loading.title')}</h1>
            <p className="text-[#B0B0DA]">{t('loading.description')}</p>
          </>
        )
      
      case 'pending':
        return (
          <>
            <Loader2 className="h-16 w-16 animate-spin text-[#7B68EE] mb-4" />
            <h1 className="text-2xl font-bold mb-4">{t('pending.title')}</h1>
            <p className="text-[#B0B0DA]">{t('pending.description')}</p>
          </>
        )
      
      case 'success':
        return (
          <>
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-2xl font-bold mb-4 text-green-500">{t('success.title')}</h1>
            {submissionName && submissionUrl && (
              <p className="text-green-500 mb-8">
                {t('success.submission', { name: submissionName })}
              </p>
            )}
            <div className="flex justify-center space-x-4">
              <Button asChild>
                <Link href="/dashboard">
                  {t('success.dashboard')}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/">
                  {t('success.home')}
                </Link>
              </Button>
            </div>
          </>
        )
      
      case 'error':
        return (
          <>
            <XCircle className="h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-2xl font-bold mb-4 text-red-500">{t('error.title')}</h1>
            <p className="text-red-400 mb-8">{errorMessage || t('error.unknown')}</p>
            <div className="flex justify-center space-x-4">
              <Button asChild>
                <Link href="/price">
                  {t('error.tryAgain')}
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/support">
                  {t('error.support')}
                </Link>
              </Button>
            </div>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF]">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default function SuccessPage() {
  return <PaymentStatus />
}