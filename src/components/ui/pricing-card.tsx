"use client"

import * as React from "react"
import { BadgeCheck } from "lucide-react"
import NumberFlow from "@number-flow/react"
import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export interface PricingTier {
  name: string
  price: Record<string, number | string>
  originalPrice?: Record<string, number | string>
  description: string
  features: string[]
  cta: string
  highlighted?: boolean
  popular?: boolean
  id?: string
}

interface PricingCardProps {
  tier: PricingTier
  paymentFrequency: string
}

export function PricingCard({ tier, paymentFrequency }: PricingCardProps) {
  const price = tier.price[paymentFrequency]
  const originalPrice = tier.originalPrice?.[paymentFrequency]
  const isHighlighted = tier.highlighted
  const isPopular = tier.popular
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || ""
  const t = useTranslations("pricing")

  const handlePayment = async () => {
    // 处理"联系我们"按钮
    if (tier.cta === "Contact Us") {
      router.push("/contact")
      return
    }
    
    // 如果价格是 "Free" 或 "Custom"，不需要支付
    if (typeof price !== "number") {
      if (price === "Custom") {
        router.push("/contact")
        return
      }
      if (price === "Free") {
        toast.success(locale === "zh" ? "已选择免费方案" : "Free plan selected")
        return
      }
      return
    }
    
    // 检查登录状态
    if (!session) {
      toast.error(t("pleaseLogin"))
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(pathname)}`)
      return
    }

    try {
      // 调用 Stripe API 创建支付会话
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price,
          email: session.user?.email,
          productName: `${tier.name} - ${paymentFrequency}`,
          successUrl: `${window.location.origin}/${locale}/orders?session_id={CHECKOUT_SESSION_ID}&amount=${price}`,
          cancelUrl: `${window.location.origin}/${locale}/#pricing`,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || locale === "zh" ? "支付请求失败" : "Payment request failed")
      }

      const { url } = await response.json()
      if (url) {
        window.location.href = url
      } else {
        throw new Error(locale === "zh" ? "未收到结账 URL" : "No checkout URL received")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : locale === "zh" ? "支付失败，请重试" : "Payment failed. Please try again.")
    }
  }

  return (
    <div className={cn("relative w-full max-w-sm", isPopular && "pt-4")}>
      {isPopular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-30">
          <Badge className="bg-orange-500 text-white px-4 py-1.5 text-sm font-medium rounded-full shadow-lg whitespace-nowrap border-2 border-white">
            {locale === "zh" ? "最受欢迎" : "Popular"}
          </Badge>
        </div>
      )}

      <Card
        className={cn(
          "relative flex flex-col gap-6 p-8 transition-all duration-300 hover:shadow-lg group w-full rounded-lg",
          isHighlighted
            ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 shadow-md"
            : "bg-white dark:bg-gray-900 text-foreground border border-gray-200 dark:border-gray-700 shadow-sm",
          isPopular && "border-2 border-orange-400 mt-4"
        )}
      >

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {tier.name}
        </h2>
      </div>

      <div className="text-center mb-6">
        {typeof price === "number" ? (
          <div className="space-y-2">
            {originalPrice && typeof originalPrice === "number" && (
              <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                ${originalPrice} USD
              </div>
            )}
            <div className="flex items-baseline justify-center gap-1">
              <NumberFlow
                format={{
                  style: "currency",
                  currency: "USD",
                  trailingZeroDisplay: "stripIfInteger",
                }}
                value={price}
                className="text-5xl font-bold text-gray-900 dark:text-white"
              />
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                USD
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {locale === "zh" ? "一次性付费。无限制构建项目！" : "Pay once. Build unlimited projects!"}
            </p>
          </div>
        ) : (
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {price}
          </h1>
        )}
      </div>

      <div className="flex-1 space-y-4">
        <h3 className="text-center text-gray-600 dark:text-gray-400 text-sm">
          {tier.description}
        </h3>

        <div className="text-center">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            {locale === "zh" ? "包含" : "Includes"}
          </h4>
        </div>

        <ul className="space-y-3">
          {tier.features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300"
            >
              <BadgeCheck className="h-4 w-4 mt-0.5 text-green-500 dark:text-green-400 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        className="w-full py-3 text-base font-semibold transition-all duration-300 bg-orange-500 hover:bg-orange-600 text-white border-0"
        onClick={handlePayment}
      >
        {tier.cta} ⚡
      </Button>

      <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
        {locale === "zh" ? "一次性付费。无限制构建项目！" : "Pay once. Build unlimited projects!"}
      </div>
    </Card>
    </div>
  )
}

