"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadStripe } from '@stripe/stripe-js';
import { toast } from "sonner";
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function PricingPage() {
  const t = useTranslations('pricing');
  const router = useRouter();
  const { data: session } = useSession();
  const pathname = usePathname();
  const locale = pathname.split('/')[1];

  const plans = t.raw('plans');

  const handlePayment = async (price: number, productName?: string) => {
    if (!session) {
      toast.error(t('pleaseLogin'));
      router.push(`/auth/signin`);
      return;
    }

    try {
      const response = await fetch("/api/stripe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price,
          email: session.user?.email,
          productName: productName || 'Credits Purchase',
          successUrl: `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/my-orders?session_id={CHECKOUT_SESSION_ID}&amount=${price}`,
          cancelUrl: `${process.env.NEXT_PUBLIC_WEB_URL}/${locale}/#pricing`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment request failed');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Payment failed. Please try again.");
      console.error("Payment error:", error);
    }
  };

  return (
    <div className="py-24 sm:py-32 bg-gray-100 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            {t('subtitle')}
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
          {plans.map((plan, planIdx) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-8 ${
                planIdx === 1 
                  ? 'relative bg-white dark:bg-gray-900 shadow-2xl sm:mx-8 lg:mx-0' 
                  : 'bg-white/60 dark:bg-gray-900/60'
              } ring-1 ring-gray-200 dark:ring-gray-700`}
            >
              {planIdx === 1 && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-sm font-semibold text-white">
                  Most popular
                </span>
              )}
              <div className="flex flex-col justify-between h-full">
                <div>
                  <p className="mt-4 text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
                    {plan.name}
                  </p>
                  <div className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                      {plan.price}
                    </span>
                    {plan.price !== t('contactUs') && (
                      <span className="text-sm font-semibold leading-6 text-gray-600 dark:text-gray-400">
                        {t('perMonth')}
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-gray-600 dark:text-gray-400">
                    {plan.description}
                  </p>
                  <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-400">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <Check className="h-6 w-5 flex-none text-indigo-600" aria-hidden="true" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button
                  variant={planIdx === 1 ? "default" : "outline"}
                  className="mt-8 w-full"
                  onClick={() => handlePayment(plan.amount || 0, plan.name)}
                >
                  {plan.price === t('contactUs') ? t('contactUs') : t('getStarted')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
