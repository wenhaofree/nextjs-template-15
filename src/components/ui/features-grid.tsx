import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const socialIcons = [
  { name: 'Instagram', icon: '/social/instagram.svg' },
  { name: 'TikTok', icon: '/social/tiktok.svg' },
  { name: 'Twitter', icon: '/social/twitter.svg' },
  { name: 'Facebook', icon: '/social/facebook.svg' },
  { name: 'Meta', icon: '/social/meta.svg' },
  { name: 'LinkedIn', icon: '/social/linkedin.svg' },
  { name: 'Slack', icon: '/social/slack.svg' },
];

const features = [
  {
    title: 'Post to multiple platforms at once',
    description: 'With our AI-powered platform, you can post to multiple platforms at once, saving you time and effort.',
    image: '/features/post-multiple.png',
    icons: socialIcons,
  },
  {
    title: 'Analytics for everything',
    description: 'Check analytics, track your posts, and get insights into your audience.',
    image: '/features/analytics.png',
    chart: true,
  },
  {
    title: 'Automated scheduling',
    description: 'Schedule your posts in advance and let our AI handle the optimal posting times.',
    image: '/features/scheduling.png',
  },
];

export function FeaturesGrid() {
  const t = useTranslations('Features');

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Automate your social media
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg text-gray-400"
          >
            Proactiv houses a rich set of features to automate your marketing efforts across all social medias
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Main Feature */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="bg-[#111] rounded-2xl p-8"
          >
            <h3 className="text-2xl font-semibold text-white mb-4">
              Post to multiple platforms at once
            </h3>
            <p className="text-gray-400 mb-8">
              With our AI-powered platform, you can post to multiple platforms at once, saving you time and effort.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {socialIcons.map((social, index) => (
                <motion.div
                  key={social.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-[#1a1a1a] rounded-lg p-4 flex items-center justify-center"
                >
                  <div className="w-10 h-10 relative">
                    <Image
                      src={social.icon}
                      alt={social.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Analytics Feature */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-[#111] rounded-2xl p-8"
          >
            <h3 className="text-2xl font-semibold text-white mb-4">
              Analytics for everything
            </h3>
            <p className="text-gray-400 mb-8">
              Check analytics, track your posts, and get insights into your audience.
            </p>
            <div className="relative h-48 bg-[#1a1a1a] rounded-lg overflow-hidden">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
                <path
                  d="M 0,100 C 100,80 200,180 400,100"
                  fill="none"
                  stroke="#0EA5E9"
                  strokeWidth="2"
                />
                <circle cx="350" cy="100" r="4" fill="#0EA5E9" />
              </svg>
              <div className="absolute top-4 right-4 text-sm text-gray-400">
                +200 connections
              </div>
            </div>
          </motion.div>

          {/* Additional Features */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-[#111] rounded-2xl p-8 lg:col-span-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Automated scheduling
                </h3>
                <p className="text-gray-400">
                  Schedule your posts in advance and let our AI handle the optimal posting times.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((item) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: item * 0.1 }}
                      className="bg-[#1a1a1a] rounded-lg p-4 h-20"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
