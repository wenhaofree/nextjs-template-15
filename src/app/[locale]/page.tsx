import {
  Hero,
  Benefits,
  Stats,
  Pricing,
  Testimonial,
  FAQ,
  CTA,
  Footer
} from "@/components/sections";
import { getLandingPage } from "@/app/actions";
import { setRequestLocale } from 'next-intl/server';
import { getMessages } from '@/i18n/routing';
import GoogleOneTapWrapper from "@/components/GoogleOneTapWrapper";
import type { Metadata } from "next";

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
    <main className="min-h-screen">
      {/* Google One Tap组件 */}
      <GoogleOneTapWrapper />

      {/* 页面主要内容区域 */}
      {page.hero && <Hero hero={page.hero} />}
      {page.benefit && <Benefits section={page.benefit} />}
      {page.stats && <Stats section={page.stats} />}
      {page.pricing && <Pricing pricing={page.pricing} />}
      {page.testimonial && <Testimonial section={page.testimonial} />}
      {page.faq && <FAQ section={page.faq} />}
      {page.cta && <CTA section={page.cta} />}

      {/* 页面底部 */}
      {page.footer && <Footer footer={page.footer} />}
    </main>
  );
}
