"use client"

import { PricingCard, type PricingTier } from "@/components/ui/pricing-card"

interface PricingSectionProps {
  title: string
  subtitle: string
  tiers: PricingTier[]
  frequencies: string[]
  frequencyLabels?: Record<string, string>
}

export function PricingSection({
  title,
  subtitle,
  tiers,
}: PricingSectionProps) {

  return (
    <section className="flex flex-col items-center gap-16 py-20">
      <div className="space-y-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      <div className="grid w-full max-w-6xl gap-8 md:grid-cols-3 justify-items-center px-4 pt-8">
        {tiers.map((tier) => (
          <PricingCard
            key={tier.name}
            tier={tier}
            paymentFrequency="monthly"
          />
        ))}
      </div>
    </section>
  )
}