import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: '$29',
    period: '/month',
    description: 'Perfect for individuals and small teams',
    features: [
      'Up to 5 social accounts',
      'Basic analytics',
      'Schedule up to 30 posts',
      'Email support'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Professional',
    price: '$79',
    period: '/month',
    description: 'Best for growing businesses',
    features: [
      'Up to 15 social accounts',
      'Advanced analytics',
      'Unlimited scheduled posts',
      'Priority support',
      'Custom reports',
      'Team collaboration'
    ],
    cta: 'Get Started',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations',
    features: [
      'Unlimited social accounts',
      'Custom analytics',
      'Dedicated account manager',
      '24/7 priority support',
      'Custom integrations',
      'Advanced security'
    ],
    cta: 'Contact Sales',
    popular: false
  }
];

export function PricingSection() {
  return (
    <section className="py-20 bg-black" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-400"
          >
            Choose the plan that's right for you
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`bg-[#111] rounded-2xl p-8 border-2 ${
                plan.popular ? 'border-blue-500' : 'border-gray-800'
              }`}
            >
              {plan.popular && (
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              )}
              <h3 className="text-2xl font-bold text-white mt-4">{plan.name}</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-400 ml-2">{plan.period}</span>
              </div>
              <p className="mt-4 text-gray-400">{plan.description}</p>
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-blue-500 mr-3" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={plan.name === 'Enterprise' ? '/contact' : '/register'}
                className={`mt-8 block text-center py-3 px-6 rounded-lg font-medium ${
                  plan.popular
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
