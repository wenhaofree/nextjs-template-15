"use client"

import * as React from "react"
import { BadgeCheck, ArrowRight } from "lucide-react"
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
  const isHighlighted = tier.highlighted
  const isPopular = tier.popular
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const locale = pathname.split('/')[1] || ""
  const t = useTranslations("pricing")

  const handlePayment = async () => {
    console.log("点击支付按钮, 价格:", price, "类型:", typeof price, "cta:", tier.cta)
    
    // 处理"联系我们"按钮
    if (tier.cta === "Contact Us") {
      console.log("导航到联系页面")
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
      console.log("准备发送支付请求, 价格:", price)
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

      console.log("支付响应状态:", response.status)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || locale === "zh" ? "支付请求失败" : "Payment request failed")
      }

      const { url } = await response.json()
      console.log("获取到支付URL:", url)
      if (url) {
        window.location.href = url
      } else {
        throw new Error(locale === "zh" ? "未收到结账 URL" : "No checkout URL received")
      }
    } catch (error) {
      console.error("支付错误:", error)
      toast.error(error instanceof Error ? error.message : locale === "zh" ? "支付失败，请重试" : "Payment failed. Please try again.")
    }
  }

  return (
    <Card
      className={cn(
        "relative flex flex-col gap-8 overflow-hidden p-6",
        isHighlighted
          ? "bg-foreground text-background"
          : "bg-background text-foreground",
        isPopular && "ring-2 ring-primary"
      )}
    >
      {isHighlighted && <HighlightedBackground />}
      {isPopular && <PopularBackground />}

      <h2 className="flex items-center gap-3 text-xl font-medium capitalize">
        {tier.name}
        {isPopular && (
          <Badge variant="secondary" className="mt-1 z-10">
            🔥 {locale === "zh" ? "最受欢迎" : "Most Popular"}
          </Badge>
        )}
      </h2>

      <div className="relative h-12">
        {typeof price === "number" ? (
          <>
            <NumberFlow
              format={{
                style: "currency",
                currency: "USD",
                trailingZeroDisplay: "stripIfInteger",
              }}
              value={price}
              className="text-4xl font-medium"
            />
            <p className="-mt-2 text-xs text-muted-foreground">
              {locale === "zh" ? "每月/用户" : "Per month/user"}
            </p>
          </>
        ) : (
          <h1 className="text-4xl font-medium">{price}</h1>
        )}
      </div>

      <div className="flex-1 space-y-2">
        <h3 className="text-sm font-medium">{tier.description}</h3>
        <ul className="space-y-2">
          {tier.features.map((feature, index) => (
            <li
              key={index}
              className={cn(
                "flex items-center gap-2 text-sm font-medium",
                isHighlighted ? "text-background" : "text-muted-foreground"
              )}
            >
              <BadgeCheck className="h-4 w-4" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <Button
        variant={isHighlighted ? "secondary" : "default"}
        className="w-full"
        onClick={handlePayment}
      >
        {tier.cta}
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </Card>
  )
}

const HighlightedBackground = () => (
  <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:45px_45px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
)

const PopularBackground = () => (
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
)