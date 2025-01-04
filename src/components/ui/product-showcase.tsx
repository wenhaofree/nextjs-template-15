import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const screenshots = [
  {
    title: 'Track all metrics',
    description: 'Get detailed insights into your social media performance',
    image: '/screenshots/metrics.png'
  },
  {
    title: 'Data Analytics',
    description: 'Analyze your audience engagement and growth',
    image: '/screenshots/analytics.png'
  },
  {
    title: 'Campaign Management',
    description: 'Manage all your social media campaigns in one place',
    image: '/screenshots/campaign.png'
  },
  {
    title: 'Automation Tools',
    description: 'Automate your social media posting and engagement',
    image: '/screenshots/automation.png'
  }
];

export function ProductShowcase() {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {screenshots.map((screenshot, index) => (
          <motion.div
            key={screenshot.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className={`flex flex-col md:flex-row items-center gap-8 mb-20 ${
              index % 2 === 1 ? 'md:flex-row-reverse' : ''
            }`}
          >
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-4">{screenshot.title}</h3>
              <p className="text-gray-400 mb-6">{screenshot.description}</p>
            </div>
            <div className="flex-1 relative">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-1">
                <div className="bg-[#111] rounded-lg p-2">
                  <Image
                    src={screenshot.image}
                    alt={screenshot.title}
                    width={600}
                    height={400}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
