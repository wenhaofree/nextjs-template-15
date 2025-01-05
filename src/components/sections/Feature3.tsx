"use client";

interface Feature3Props {
  section: {
    title: string;
    subtitle: string;
    steps: Array<{
      title: string;
      description: string;
      image: string;
    }>;
  };
}

export function Feature3({ section }: Feature3Props) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{section.subtitle}</p>
        </div>
        <div className="space-y-20">
          {section.steps.map((step, index) => (
            <div
              key={index}
              className={`grid md:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                <img
                  src={step.image}
                  alt={step.title}
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
