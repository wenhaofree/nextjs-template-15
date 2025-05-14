import { Hero } from "@/components/sections/Hero";
import { Feature2 } from "@/components/sections/Feature2";
import { Stats } from "@/components/sections/Stats";
import { Pricing } from "@/components/sections/Pricing";
import { Testimonial } from "@/components/sections/Testimonial";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import { getLandingPage } from "@/app/actions";
import { setRequestLocale } from 'next-intl/server';
import { getMessages } from '@/i18n/routing';
import GoogleOneTapWrapper from "@/components/GoogleOneTapWrapper";
import type { Metadata } from "next";
import { Footer } from "@/components/ui/footer-section";

// Add page-specific metadata
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages(locale);

  return {
    title: messages.hero.title,
    description: messages.hero.description,
  };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // 使用 await 获取 locale
  const { locale } = await params;

  // 设置请求的 locale
  setRequestLocale(locale);

  // 获取页面数据
  const page = await getLandingPage(locale);

  return (
    <>
      {/* Google One Tap组件 */}
      <GoogleOneTapWrapper />

      {page.hero && <Hero hero={page.hero} />}
      {/* {page.branding && <Branding section={page.branding} />} */}
      {/* {page.introduce && <Feature1 section={page.introduce} />} */}
      {page.benefit && <Feature2 section={page.benefit} />}
      {/* {page.usage && <Feature3 section={page.usage} />} */}
      {/* {page.feature && <Features features={page.feature} />} */}
      {/* {page.showcase && <Showcase section={page.showcase} />} */}
      {page.stats && <Stats section={page.stats} />}
      {page.pricing && <Pricing pricing={page.pricing} />}
      {page.testimonial && <Testimonial section={page.testimonial} />}
      {page.faq && <FAQ section={page.faq} />}
      {page.cta && <CTA section={page.cta} />}

      {/* {page.footer && <Footerdemo footer={page.footer} />} */}
      <Footer />
    </>
  );
}
