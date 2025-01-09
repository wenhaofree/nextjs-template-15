import { getLandingPage } from "@/app/actions";
import { unstable_setRequestLocale } from 'next-intl/server';
import type { Metadata, PageProps } from 'next';
import LandingPageContent from './LandingPageContent';

type LocaleParams = {
  locale: string;
};

export async function generateMetadata({ params }: PageProps<LocaleParams>): Promise<Metadata> {
  const { locale } = params;

  return {
    title: locale === 'zh' ? '下一代模板' : 'Next.js Template',
    description: locale === 'zh' ? '一个现代化的Next.js模板' : 'A modern Next.js template',
  };
}

export default async function Page({ params }: PageProps<LocaleParams>) {
  const { locale } = params;
  unstable_setRequestLocale(locale);
  const page = await getLandingPage(locale);

  return <LandingPageContent page={page} />;
}

export async function generateStaticParams(): Promise<LocaleParams[]> {
  return [
    { locale: 'en' },
    { locale: 'zh' }
  ];
}
