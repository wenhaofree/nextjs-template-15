"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
    <section id="hero" className="relative flex items-center justify-center min-h-[calc(100vh-4rem)] w-full py-12 md:py-24 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#3c8dfc15,transparent)]" />
      </div>

      {/* Animated grid background */}
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-[linear-gradient(to_right,#4f4f4f0a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f0a_1px,transparent_1px)] bg-[size:38px_38px]" />
      </div>

      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              {hero.title}
            </h1>
            <p className="text-xl text-gray-600 md:text-2xl dark:text-gray-300 max-w-3xl mx-auto">
              {hero.subtitle}
            </p>
            <p className="text-lg text-gray-500 md:text-xl dark:text-gray-400 max-w-2xl mx-auto">
              {hero.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Button
              size="lg"
              className="min-w-[150px] bg-primary hover:bg-primary/90 text-white rounded-full px-8 h-12 text-base"
            >
              {hero.cta.primary}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="min-w-[150px] rounded-full px-8 h-12 text-base border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              {hero.cta.secondary}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
