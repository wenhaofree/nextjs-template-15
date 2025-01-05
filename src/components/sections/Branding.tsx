"use client";

interface BrandingProps {
  section: {
    title: string;
    subtitle: string;
    brands: Array<{
      name: string;
      logo: string;
    }>;
  };
}

export function Branding({ section }: BrandingProps) {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
          <p className="text-lg text-gray-600">{section.subtitle}</p>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {section.brands.map((brand, index) => (
            <div key={index} className="flex items-center">
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-8 md:h-12 object-contain grayscale hover:grayscale-0 transition-all"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
