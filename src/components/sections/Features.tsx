"use client";

interface FeaturesProps {
  features: {
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
}

export function Features({ features }: FeaturesProps) {
  return (
    <section id="features" className="w-full py-16 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
            {features.title}
          </h2>
          <p className="text-lg text-gray-500 md:text-xl lg:text-xl dark:text-gray-400">
            {features.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {features.items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-full mb-4">
                <span className="text-3xl">{item.icon}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
