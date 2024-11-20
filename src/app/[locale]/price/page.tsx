'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Globe, LinkIcon, Languages, CreditCard } from 'lucide-react'
import { useState } from "react"
import { toast } from "sonner"
import { useSession, signIn } from "next-auth/react"
import { useTranslations } from 'next-intl'
import { useRouter,usePathname } from '@/i18n/routing'
import { useLocale } from 'next-intl';


export default function PricePage() {
  const t = useTranslations('Pricing')
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  
  // Get locale from pathname
  const locale = useLocale();


  const handleGetNow = async (planName: string) => {
    if (status === "loading") return

    if (!session) {
      router.push('/sign-in')
      return
    }

    try {
      setIsLoading(planName)
      
      const planType = planName === t('plans.oneTime.name') ? "one-time" : 
                      planName === t('plans.unlimited.name') ? "unlimited" :
                      planName === t('plans.sponsor.name') ? "sponsor" : "free"
      
      if (planType === "free") {
        toast.success("成功注册免费计划")
        return
      }
      
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          planType,
          locale,
          submission: { name: '', url: '' }
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t('error.paymentCreation'))
      }
      
      router.push(data.url)
      
    } catch (error) {
      console.error('Payment error:', error)
      toast.error(error instanceof Error ? error.message : t('error.paymentProcess'))
    } finally {
      setIsLoading(null)
    }
  }

  const features = [
    {
      title: t('features.audience.title'),
      description: t('features.audience.description'),
      icon: Globe,
    },
    {
      title: t('features.backlinks.title'),
      description: t('features.backlinks.description'),
      icon: LinkIcon,
    },
    {
      title: t('features.languages.title'),
      description: t('features.languages.description'),
      icon: Languages,
    },
    {
      title: t('features.pricing.title'),
      description: t('features.pricing.description'),
      icon: CreditCard,
    },
  ]

  const plans = [
    {
      name: t('plans.free.name'),
      price: "0",
      originalPrice: "0",
      description: t('plans.free.description'),
      features: t.raw('plans.free.features') as string[],
    },
    {
      name: t('plans.oneTime.name'),
      price: "16.9",
      originalPrice: "19.9",
      description: t('plans.oneTime.description'),
      features: t.raw('plans.oneTime.features') as string[],
    },
    {
      name: t('plans.unlimited.name'),
      price: "24.9",
      originalPrice: "39.9",
      description: t('plans.unlimited.description'),
      features: t.raw('plans.unlimited.features') as string[],
    },
    {
      name: t('plans.sponsor.name'),
      price: "39.9",
      originalPrice: "59.9",
      description: t('plans.sponsor.description'),
      features: t.raw('plans.sponsor.features') as string[],
    },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A1B] text-[#E0E0FF]">
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#7B68EE] to-[#4169E1]">
            {t('hero.title')}
          </h1>
          <p className="text-[#B0B0DA] max-w-3xl mx-auto">
            {t('hero.description')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-[#12122A] border-[#2A2A4A] p-6">
              <feature.icon className="w-8 h-8 text-[#7B68EE] mb-4" />
              <h3 className="text-lg font-semibold text-[#7B68EE] mb-2">{feature.title}</h3>
              <p className="text-[#B0B0DA] text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <Card key={index} className="bg-[#12122A] border-[#2A2A4A] p-6 flex flex-col">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[#7B68EE] mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-2">
                  <span className="text-3xl font-bold text-[#7B68EE]">$</span>
                  <span className="text-4xl font-bold text-[#7B68EE]">{plan.price}</span>
                  {plan.originalPrice !== "0" && (
                    <span className="ml-2 text-[#B0B0DA] line-through">${plan.originalPrice}</span>
                  )}
                </div>
                <p className="text-[#B0B0DA] text-sm">{plan.description}</p>
              </div>
              <div className="flex-grow">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-[#32CD32] mr-2 flex-shrink-0" />
                      <span className="text-sm text-[#B0B0DA]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button 
                className="w-full bg-[#7B68EE] hover:bg-[#6A5ACD] text-[#0A0A1B]"
                onClick={() => handleGetNow(plan.name)}
                disabled={isLoading === plan.name}
              >
                {isLoading === plan.name ? t('button.processing') : t('button.getStarted')}
              </Button>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}