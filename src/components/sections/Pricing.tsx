
import { PricingSection } from "@/components/blocks/pricing-section"

interface PricingProps {
  pricing: {
    title: string;
    subtitle: string;
    frequencies?: {
      monthly: string;
      yearly: string;
    };
    plans: Array<{
      name: string;
      monthlyPrice: number | string;
      yearlyPrice: number | string;
      originalPrice?: number | string;
      description: string;
      features: string[];
    }>;
  };
}

export const PAYMENT_FREQUENCIES = ["monthly", "yearly"]

export function Pricing({ pricing }: PricingProps) {
  // Convert the pricing data to match the PricingSection format
  const tiers = pricing.plans.map((plan, index) => ({
    id: plan.name.toLowerCase().replace(/\s+/g, '-'),
    name: plan.name,
    price: {
      monthly: plan.monthlyPrice,
      yearly: plan.yearlyPrice,
    },
    originalPrice: plan.originalPrice ? {
      monthly: plan.originalPrice,
      yearly: plan.originalPrice,
    } : undefined,
    description: plan.description,
    features: plan.features,
    cta: "Get Start ⚡",
    popular: index === 1, // Make middle plan popular
    highlighted: index === pricing.plans.length - 1, // Make last plan highlighted
  }));

  // Frequency labels for internationalization
  const frequencyLabels = {
    monthly: pricing.frequencies?.monthly || "Monthly",
    yearly: pricing.frequencies?.yearly || "Yearly"
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden bg-background">
      {/* Unified Background System */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient - seamless transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
        {/* Subtle accent gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_400px,rgba(59,130,246,0.03),transparent)] dark:bg-[radial-gradient(circle_800px_at_50%_400px,rgba(59,130,246,0.06),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_20%_200px,rgba(139,92,246,0.02),transparent)] dark:bg-[radial-gradient(circle_600px_at_20%_200px,rgba(139,92,246,0.04),transparent)]" />
      </div>

      {/* Unified grid background */}
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="container mx-auto px-4">
        <PricingSection
          title={pricing.title}
          subtitle={pricing.subtitle}
          frequencies={PAYMENT_FREQUENCIES}
          frequencyLabels={frequencyLabels}
          tiers={tiers}
        />
      </div>
    </section>
  );
}