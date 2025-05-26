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
      {/* Enhanced Background with theme-aware gradients */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/80" />
        {/* Theme-aware radial gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,rgba(59,130,246,0.08),transparent)] dark:bg-[radial-gradient(circle_800px_at_50%_200px,rgba(59,130,246,0.15),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_400px_at_80%_100px,rgba(139,92,246,0.06),transparent)] dark:bg-[radial-gradient(circle_400px_at_80%_100px,rgba(139,92,246,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_300px_at_20%_300px,rgba(6,182,212,0.05),transparent)] dark:bg-[radial-gradient(circle_300px_at_20%_300px,rgba(6,182,212,0.1),transparent)]" />
      </div>

      {/* Enhanced animated grid background with theme awareness */}
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* Theme-aware floating particles effect */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/20 dark:bg-blue-400/40 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }} />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-purple-400/25 dark:bg-purple-400/50 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-cyan-400/20 dark:bg-cyan-400/45 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }} />
        <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-indigo-400/20 dark:bg-indigo-400/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }} />
      </div>

      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 max-w-4xl mx-auto"
          >
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-900 to-gray-700 dark:from-white dark:via-blue-200 dark:to-gray-300 leading-tight">
              {hero.title}
            </h1>
            <p className="text-xl text-gray-600 md:text-2xl lg:text-3xl dark:text-gray-300 max-w-4xl mx-auto font-medium leading-relaxed">
              {hero.subtitle}
            </p>
            <p className="text-lg text-gray-500 md:text-xl lg:text-2xl dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              {hero.description}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Button
              size="lg"
              className="min-w-[180px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-10 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {hero.cta.primary}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="min-w-[180px] rounded-full px-10 h-14 text-lg font-semibold border-2 border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
            >
              {hero.cta.secondary}
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400 mt-8"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>5M+ Images Generated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>100K+ Happy Creators</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span>99.9% Uptime</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
