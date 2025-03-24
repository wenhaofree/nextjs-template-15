import { Hero } from "@/components/sections/Hero";
import { Branding } from "@/components/sections/Branding";
import { Feature1 } from "@/components/sections/Feature1";
import { Feature2 } from "@/components/sections/Feature2";
import { Feature3 } from "@/components/sections/Feature3";
import { Features } from "@/components/sections/Features";
import { Showcase } from "@/components/sections/Showcase";
import { Stats } from "@/components/sections/Stats";
import { Pricing } from "@/components/sections/Pricing";
import { Testimonial } from "@/components/sections/Testimonial";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import { getLandingPage } from "@/app/actions";
import { unstable_setRequestLocale } from 'next-intl/server';
import {routing} from '@/i18n/routing';

type Locale = (typeof routing.locales)[number];

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  // 使用 await 获取 locale
  const { locale } = await params;

  // 设置请求的 locale
  unstable_setRequestLocale(locale);

  // 获取页面数据
  const page = await getLandingPage(locale);

  return (
    <>
      {page.hero && <Hero hero={page.hero} />}
      {/* {page.branding && <Branding section={page.branding} />}
      {page.introduce && <Feature1 section={page.introduce} />}
      {page.benefit && <Feature2 section={page.benefit} />}
      {page.usage && <Feature3 section={page.usage} />}
      {page.feature && <Features features={page.feature} />}
      {page.showcase && <Showcase section={page.showcase} />}
      {page.stats && <Stats section={page.stats} />}
      {page.pricing && <Pricing pricing={page.pricing} />}
      {page.testimonial && <Testimonial section={page.testimonial} />}
      {page.faq && <FAQ section={page.faq} />}
      {page.cta && <CTA section={page.cta} />} */}
    </>
  );
}
