"use client";

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
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{section.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {section.stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-lg font-semibold mb-2">{stat.label}</div>
              <p className="text-gray-600">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
