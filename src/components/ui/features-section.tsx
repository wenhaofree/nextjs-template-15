import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';

export function FeaturesSection() {
  const t = useTranslations('Features');

  const features = [
    {
      title: t('performance.title'),
      description: t('performance.description'),
      icon: "🚀",
    },
    {
      title: t('design.title'),
      description: t('design.description'),
      icon: "✨",
    },
    {
      title: t('typeSafe.title'),
      description: t('typeSafe.description'),
      icon: "🛡️",
    },
    {
      title: t('setup.title'),
      description: t('setup.description'),
      icon: "⚡",
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100"
          >
            {t('title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-4 text-lg text-neutral-600 dark:text-neutral-400"
          >
            {t('description')}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                {feature.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
