"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface PricingProps {
  pricing: {
    title: string;
    subtitle: string;
    plans: Array<{
      name: string;
      price: string;
      description: string;
      features: string[];
    }>;
  };
}

export function Pricing({ pricing }: PricingProps) {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              {pricing.title}
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              {pricing.subtitle}
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {pricing.plans.map((plan, index) => (
            <div
              key={index}
              className="flex flex-col justify-between space-y-4 rounded-lg border p-6 shadow-lg"
            >
              <div>
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline text-gray-900 dark:text-gray-50">
                  <span className="text-5xl font-extrabold tracking-tight">
                    {plan.price}
                  </span>
                  {plan.price !== "联系我们" && (
                    <span className="ml-1 text-xl font-semibold">/月</span>
                  )}
                </div>
                <p className="mt-4 text-gray-500 dark:text-gray-400">
                  {plan.description}
                </p>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-6 w-6 flex-shrink-0 text-green-500" />
                      <span className="ml-3 text-gray-500 dark:text-gray-400">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button className="w-full" variant="outline">
                开始使用
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
