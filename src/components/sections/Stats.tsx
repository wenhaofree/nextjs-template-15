"use client";

import { motion } from "framer-motion";

interface StatsProps {
  section: {
    title: string;
    subtitle: string;
    stats: Array<{
      value: string;
      label: string;
      description: string;
    }>;
  };
}

export function Stats({ section }: StatsProps) {
  return (
    <section id="stats" className="py-24 relative overflow-hidden bg-background">
      {/* Unified Background System */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient - seamless transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />
        {/* Subtle accent gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_200px,rgba(6,182,212,0.03),transparent)] dark:bg-[radial-gradient(circle_800px_at_50%_200px,rgba(6,182,212,0.06),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_80%_400px,rgba(139,92,246,0.02),transparent)] dark:bg-[radial-gradient(circle_600px_at_80%_400px,rgba(139,92,246,0.04),transparent)]" />
      </div>

      {/* Unified grid background */}
      <div className="absolute inset-0 -z-10">
        <div className="h-full w-full bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
            {section.title}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {section.subtitle}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {section.stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group text-center"
            >
              <div className="relative bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                {/* Gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-lg font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {stat.label}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {stat.description}
                  </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400/30 rounded-full group-hover:bg-blue-400/60 transition-colors" />
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-cyan-400/30 rounded-full group-hover:bg-cyan-400/60 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
