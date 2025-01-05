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
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              {hero.title}
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              {hero.subtitle}
            </p>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              {hero.description}
            </p>
          </div>
          <div className="space-x-4">
            <Button size="lg">{hero.cta.primary}</Button>
            <Button variant="outline" size="lg">
              {hero.cta.secondary}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
