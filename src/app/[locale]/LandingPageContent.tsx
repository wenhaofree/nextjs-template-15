'use client';

import { Hero } from "@/components/sections/Hero";
import { Branding } from "@/components/sections/Branding";
import { Feature1 } from "@/components/sections/Feature1";
import { Feature2 } from "@/components/sections/Feature2";
import { Feature3 } from "@/components/sections/Feature3";
import { Features } from "@/components/sections/Features";
import Showcase from "@/components/sections/Showcase";
import Stats from "@/components/sections/Stats";
import { Pricing } from "@/components/sections/Pricing";
import Testimonial from "@/components/sections/Testimonial";
import FAQ from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import AuthCheck from "@/components/AuthCheck";

interface HeroSection {
  title: string;
  subtitle: string;
  cta: {
    primary: string;
    secondary: string;
  };
}

interface BrandingSection {
  title: string;
  subtitle: string;
  brands: Array<{
    name: string;
    logo: string;
  }>;
}

interface FeatureSection {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

interface ShowcaseSection {
  title: string;
  subtitle: string;
  items: Array<{
    title: string;
    description: string;
    image: string;
  }>;
}

interface StatsSection {
  title: string;
  subtitle: string;
  stats: Array<{
    title: string;
    value: string;
  }>;
}

interface PricingSection {
  title: string;
  subtitle: string;
  plans: Array<{
    name: string;
    price: string;
    amount?: number;
    description: string;
    features: string[];
  }>;
}

interface TestimonialSection {
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
}

interface FAQSection {
  title: string;
  subtitle: string;
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

interface CTASection {
  title: string;
  subtitle: string;
  cta: {
    primary: string;
  };
}

interface LandingPageContentProps {
  page: {
    hero?: HeroSection;
    branding?: BrandingSection;
    introduce?: FeatureSection;
    benefit?: FeatureSection;
    usage?: FeatureSection;
    feature?: FeatureSection[];
    showcase?: ShowcaseSection;
    stats?: StatsSection;
    pricing?: PricingSection;
    testimonial?: TestimonialSection;
    faq?: FAQSection;
    cta?: CTASection;
  };
}

export default function LandingPageContent({ page }: LandingPageContentProps) {
  return (
    <>
      <AuthCheck />
      {page.hero && <Hero hero={page.hero} />}
      {page.branding && <Branding section={page.branding} />}
      {page.introduce && <Feature1 section={page.introduce} />}
      {page.benefit && <Feature2 section={page.benefit} />}
      {page.usage && <Feature3 section={page.usage} />}
      {page.feature && <Features features={page.feature} />}
      {page.showcase && <Showcase section={page.showcase} />}
      {page.stats && <Stats section={page.stats} />}
      {page.pricing && <Pricing pricing={page.pricing} />}
      {page.testimonial && <Testimonial section={page.testimonial} />}
      {page.faq && <FAQ section={page.faq} />}
      {page.cta && <CTA section={page.cta} />}
    </>
  );
}
