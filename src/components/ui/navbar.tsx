import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export function Navbar() {
  const t = useTranslations('Index');
  
  const navigation = [
    { name: t('nav.features'), href: "#features" },
    { name: t('nav.testimonials'), href: "#testimonials" },
    { name: t('nav.pricing'), href: "#pricing" },
    { name: t('nav.contact'), href: "#contact" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800"
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-neutral-900 dark:text-white">
              {t('nav.logo')}
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <button className="px-4 py-2 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
              {t('nav.getStarted')}
            </button>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
