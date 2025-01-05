"use client";

import { Button } from "@/components/ui/button";

interface HeroProps {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    cta: {
      primary: string;
      secondary: string;
    };
  };
}

export function Hero({ hero }: HeroProps) {
  return (
    <section className="flex items-center justify-center min-h-[calc(100vh-4rem)] w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="space-y-4 max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              {hero.title}
            </h1>
            <p className="text-xl text-gray-500 md:text-2xl dark:text-gray-400">
              {hero.subtitle}
            </p>
            <p className="text-lg text-gray-500 md:text-xl dark:text-gray-400">
              {hero.description}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="min-w-[150px]">
              {hero.cta.primary}
            </Button>
            <Button variant="outline" size="lg" className="min-w-[150px]">
              {hero.cta.secondary}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
