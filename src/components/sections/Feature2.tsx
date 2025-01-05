"use client";

interface Feature2Props {
  section: {
    title: string;
    subtitle: string;
    benefits: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
}

export function Feature2({ section }: Feature2Props) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{section.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {section.benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <i className={benefit.icon} />
              </div>
              <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
