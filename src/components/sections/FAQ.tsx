"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  section: {
    title: string;
    subtitle: string;
    faqs: Array<{
      question: string;
      answer: string;
    }>;
  };
}

export function FAQ({ section }: FAQProps) {
  return (
    <section id="faq" className="py-24 bg-gray-50 dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 text-foreground">{section.title}</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{section.subtitle}</p>
        </div>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            {section.faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-foreground">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
