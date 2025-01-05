"use client";

import { Button } from "@/components/ui/button";

interface CTAProps {
  section: {
    title: string;
    subtitle: string;
    cta: {
      primary: string;
      secondary: string;
    };
  };
}

export function CTA({ section }: CTAProps) {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">{section.title}</h2>
          <p className="text-xl text-gray-600 mb-8">{section.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#00C7B0] hover:bg-[#00B3A0] text-white rounded-full px-8">
              {section.cta.primary}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8"
            >
              {section.cta.secondary}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
