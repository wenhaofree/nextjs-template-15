import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
  const t = useTranslations('pricing');

  const plans = t.raw('plans');

  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {t('subtitle')}
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
          {plans.map((plan, planIdx) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-8 ring-1 ring-gray-200 ${
                planIdx === 1 ? 'relative bg-gray-50 sm:mx-8 lg:mx-0' : ''
              }`}
            >
              {planIdx === 1 && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-sm font-semibold text-white">
                  Most popular
                </span>
              )}
              <div className="flex flex-col justify-between h-full">
                <div>
                  <p className="mt-4 text-sm font-semibold leading-6 text-gray-600">
                    {plan.name}
                  </p>
                  <div className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight">
                      {plan.price}
                    </span>
                    {plan.price !== t('contactUs') && (
                      <span className="text-sm font-semibold leading-6 text-gray-600">
                        {t('perMonth')}
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    {plan.description}
                  </p>
                  <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600">
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
