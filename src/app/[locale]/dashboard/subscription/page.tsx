'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CreditCard, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface SubscriptionData {
  status: string
  planType: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
}

interface PaymentHistory {
  id: string
  amount: number
  status: string
  created: number
  description: string
}

export default function SubscriptionPage() {
  const t = useTranslations('Subscription')
  const { data: session } = useSession()
  const router = useRouter()
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [payments, setPayments] = useState<PaymentHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const response = await fetch('/api/stripe/get-subscription')
        if (!response.ok) throw new Error('Failed to fetch subscription')
        const data = await response.json()
        setSubscription(data)
      } catch (error) {
        console.error('Error fetching subscription:', error)
      }
    }

    const fetchPaymentHistory = async () => {
      try {
        const response = await fetch('/api/stripe/get-payment-history')
        if (!response.ok) throw new Error('Failed to fetch payment history')
        const data = await response.json()
        setPayments(data)
      } catch (error) {
        console.error('Error fetching payment history:', error)
      }
      setLoading(false)
    }

    if (session?.user) {
      fetchSubscriptionData()
      fetchPaymentHistory()
    } else {
      router.push('/sign-in')
    }
  }, [session, router])

  const handleManageSubscription = async () => {
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error creating portal session:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#7B68EE]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF]">
      <div className="container mx-auto px-4 py-12">
        {/* Current Subscription */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">{t('currentPlan.title')}</h2>
          <Card className="bg-[#12122A] border-[#2A2A4A] p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {subscription?.planType ? t(`plans.${subscription.planType}.name`) : t('plans.free.name')}
                </h3>
                <Badge variant={subscription?.status === 'active' ? 'success' : 'secondary'}>
                  {subscription?.status === 'active' ? t('status.active') : t('status.inactive')}
                </Badge>
                {subscription?.currentPeriodEnd && (
                  <p className="mt-4 text-[#B0B0DA]">
                    {t('currentPlan.renewalDate', { 
                      date: new Date(subscription.currentPeriodEnd).toLocaleDateString() 
                    })}
                  </p>
                )}
              </div>
              <Button onClick={handleManageSubscription}>
                {t('currentPlan.manage')}
              </Button>
            </div>
          </Card>
        </div>

        {/* Payment History */}
        <div>
          <h2 className="text-2xl font-bold mb-6">{t('paymentHistory.title')}</h2>
          <div className="space-y-4">
            {payments.length > 0 ? (
              payments.map((payment) => (
                <Card key={payment.id} className="bg-[#12122A] border-[#2A2A4A] p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-[#1E1E3A]">
                        <CreditCard className="h-5 w-5 text-[#7B68EE]" />
                      </div>
                      <div>
                        <p className="font-medium">{payment.description}</p>
                        <p className="text-sm text-[#B0B0DA]">
                          {new Date(payment.created * 1000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={payment.status === 'succeeded' ? 'success' : 'destructive'}>
                        {payment.status === 'succeeded' ? (
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-1" />
                        )}
                        {payment.status}
                      </Badge>
                      <p className="font-medium">
                        ${(payment.amount / 100).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 text-[#B0B0DA]">
                {t('paymentHistory.empty')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
