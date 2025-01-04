import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';

export function HeroSection() {
  const t = useTranslations('Index');

  return (
    <div className="h-[40rem] w-full dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex items-center justify-center">
      {/* Radial gradient for the container to give a faded look */}
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="relative z-20 flex flex-col items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400"
        >
          {t('hero.title')}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-4 font-normal text-base md:text-lg text-neutral-700 dark:text-neutral-300 max-w-lg text-center mx-auto"
        >
          {t('hero.description')}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="mt-8 flex flex-wrap justify-center gap-4"
        >
          <button className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
            {t('hero.getStarted')}
          </button>
          <button className="px-6 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors">
            {t('hero.learnMore')}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
