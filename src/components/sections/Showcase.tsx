"use client";

import Image from "next/image";

interface ShowcaseProps {
  section: {
    title: string;
    subtitle: string;
    gallery: Array<{
      image: string;
      title: string;
      description: string;
    }>;
  };
}

export function Showcase({ section }: ShowcaseProps) {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              {section.title}
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              {section.subtitle}
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {section.gallery.map((item, index) => (
            <div key={index} className="group relative overflow-hidden rounded-lg">
              <Image
                src={item.image}
                alt={item.title}
                width={400}
                height={300}
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <div className="flex h-full flex-col items-center justify-center p-4 text-white">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
