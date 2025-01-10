"use client";

interface TestimonialProps {
  section: {
    title: string;
    subtitle: string;
    testimonials: Array<{
      content: string;
      author: {
        name: string;
        title: string;
        company: string;
        image: string;
      };
    }>;
  };
}

export function Testimonial({ section }: TestimonialProps) {
  return (
    <section id="testimonial" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">{section.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {section.testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-6">
                <svg
                  className="h-8 w-8 text-gray-400 mb-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-600 mb-6">{testimonial.content}</p>
              </div>
              <div className="flex items-center">
                <img
                  src={testimonial.author.image}
                  alt={testimonial.author.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div>
                  <div className="font-semibold">{testimonial.author.name}</div>
                  <div className="text-sm text-gray-600">
                    {testimonial.author.title}, {testimonial.author.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
