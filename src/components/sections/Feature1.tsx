"use client";

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
    <section id="introduce" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
            <p className="text-xl text-gray-600 mb-6">{section.subtitle}</p>
            <p className="text-gray-600 mb-8">{section.description}</p>
            <div className="space-y-6">
              {section.features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <i className={feature.icon} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src={section.image}
              alt={section.title}
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
