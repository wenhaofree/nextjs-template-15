"use client";

import Image from 'next/image';

interface Feature1Props {
  section: {
    title: string;
    subtitle: string;
    description: string;
    image: string;
    features: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
}

export function Feature1({ section }: Feature1Props) {
  return (
    <section id="introduce" className="py-20 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_50%_50%,rgba(59,130,246,0.05),transparent)] dark:bg-[radial-gradient(circle_600px_at_50%_50%,rgba(59,130,246,0.1),transparent)]" />
        <div className="h-full w-full bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">{section.title}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{section.subtitle}</p>
            <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">{section.description}</p>
            <div className="space-y-6">
              {section.features.map((feature, index) => (
                <div key={index} className="flex gap-4 group">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <i className={`${feature.icon} text-blue-600 dark:text-blue-400`} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/30 dark:to-purple-500/30 rounded-2xl blur-xl"></div>
            <Image
              src={section.image}
              alt={section.title}
              width={800}
              height={600}
              className="relative rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
