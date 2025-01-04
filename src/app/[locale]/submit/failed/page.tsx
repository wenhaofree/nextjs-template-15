'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Link } from '@/i18n/routing'
import { useSearchParams } from 'next/navigation'
import { AlertCircle } from 'lucide-react'

export default function PaymentFailedPage() {
  const t = useTranslations('SubmitFailed')
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF]">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <AlertCircle className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-red-500">
            {t('title')}
          </h1>
          <p className="text-[#B0B0DA] mb-8">
            {error ? t('errorMessage', { error }) : t('defaultError')}
          </p>
          <div className="flex justify-center space-x-4">
            <Button asChild variant="ghost">
              <Link href="/price">
                {t('tryAgain')}
              </Link>
            </Button>
            <Button asChild>
              <Link href="/support">
                {t('contactSupport')}
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
