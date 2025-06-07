// "use client";

// import { Button } from "@/components/ui/button";
// import { Check } from "lucide-react";
// import { loadStripe } from '@stripe/stripe-js';
// import { toast } from "sonner";
// import { useTranslations } from 'next-intl';
// import { useRouter, usePathname } from 'next/navigation';
// import { useSession } from 'next-auth/react';

// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

interface PricingProps {
  pricing: {
    title: string;
    subtitle: string;
    plans: Array<{
      name: string;
      price: string;
      amount?: number;
      description: string;
      features: string[];
    }>;
  };
}

// export function Pricing({ pricing }: PricingProps) {
//   const t = useTranslations('pricing');
//   const router = useRouter();
//   const { data: session } = useSession();
//   const pathname = usePathname();
//   const locale = pathname.split('/')[1];
  
//   const handlePayment = async (price: number, productName?: string) => {
//     if (!session) {
//       toast.error(t('pleaseLogin'));
//       // router.push(`/${locale}/auth/signin`);
//       router.push(`/auth/signin`);
//       return;
//     }

//     try {
//       const response = await fetch("/api/stripe", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           price,
//           email: session.user?.email,
//           productName: productName || 'Credits Purchase',
//           successUrl: `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/orders?session_id={CHECKOUT_SESSION_ID}&amount=${price}`,
//           cancelUrl: `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/#pricing`,
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Payment request failed');
//       }

//       const { url } = await response.json();
//       if (url) {
//         window.location.href = url;
//       } else {
//         throw new Error('No checkout URL received');
//       }
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Payment failed. Please try again.");
//       console.error("Payment error:", error);
//     }
//   };

//   return (
//     <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
//       <div className="container mx-auto px-4 md:px-6">
//         <div className="flex flex-col items-center justify-center space-y-4 text-center">
//           <div className="space-y-2">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
//               {t('title')}
//             </h2>
//             <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
//               {t('subtitle')}
//             </p>
//           </div>
//         </div>
//         <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
//           {pricing.plans.map((plan, index) => (
//             <div
//               key={index}
//               className="flex flex-col justify-between space-y-4 rounded-lg border p-6 shadow-lg bg-white dark:bg-gray-900"
//             >
//               <div>
//                 <h3 className="text-2xl font-bold">{plan.name}</h3>
//                 <div className="mt-4 flex items-baseline text-gray-900 dark:text-gray-50">
//                   <span className="text-5xl font-extrabold tracking-tight">
//                     {plan.price}
//                   </span>
//                   {plan.price !== t('contactUs') && (
//                     <span className="ml-1 text-xl font-semibold">{t('perMonth')}</span>
//                   )}
//                 </div>
//                 <p className="mt-4 text-gray-500 dark:text-gray-400">
//                   {plan.description}
//                 </p>
//                 <ul className="mt-6 space-y-4">
//                   {plan.features.map((feature, featureIndex) => (
//                     <li key={featureIndex} className="flex items-start">
//                       <Check className="h-6 w-6 flex-shrink-0 text-green-500" />
//                       <span className="ml-3 text-gray-500 dark:text-gray-400">
//                         {feature}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//               <Button 
//                 className="w-full" 
//                 variant={plan.price === t('contactUs') ? "outline" : "default"}
//                 onClick={() => plan.amount ? handlePayment(plan.amount, plan.name) : window.location.href = '#contact'}
//               >
//                 {plan.price === t('contactUs') ? t('getStarted') : t('buyNow')}
//               </Button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }

import { PricingSection } from "@/components/blocks/pricing-section"

export const PAYMENT_FREQUENCIES = ["monthly", "yearly"]

export const TIERS = [
  {
    id: "individuals",
    name: "Individuals",
    price: {
      monthly: "Free",
      yearly: "Free",
    },
    description: "For your hobby projects",
    features: [
      "Free email alerts",
      "3-minute checks",
      "Automatic data enrichment",
      "10 monitors",
      "Up to 3 seats",
    ],
    cta: "Get started",
  },
  {
    id: "teams",
    name: "Teams",
    price: {
      monthly: 0.6,
      yearly: 75,
    },
    description: "Great for small businesses",
    features: [
      "Unlimited phone calls",
      "30 second checks",
      "Single-user account",
      "20 monitors",
      "Up to 6 seats",
    ],
    cta: "Get started",
    // popular: true,  //会导致无法跳转支付问题css的bug
  },
  {
    id: "organizations",
    name: "Organizations",
    price: {
      monthly: 120,
      yearly: 100,
    },
    description: "Great for large businesses",
    features: [
      "Unlimited phone calls",
      "15 second checks",
      "Single-user account",
      "50 monitors",
      "Up to 10 seats",
    ],
    cta: "Get started",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: {
      monthly: "Custom",
      yearly: "Custom",
    },
    description: "For multiple teams",
    features: [
      "Everything in Organizations",
      "Up to 5 team members",
      "100 monitors",
      "15 status pages",
      "200+ integrations",
    ],
    cta: "Contact Us",
    highlighted: true,
  },
]

export function Pricing({ pricing }: PricingProps) {
  return (
    <section id="pricing" className="relative flex justify-center items-center w-full mt-20 scale-90">
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:35px_35px] opacity-30 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>
        <PricingSection
          title="Simple Pricing"
          subtitle="Choose the best plan for your needs"
          frequencies={PAYMENT_FREQUENCIES}
          tiers={TIERS}
        />
    </section>
  );
}