import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from '@/i18n/routing';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import '../globals.css';
import Header from '@/components/Header';
// import Footer from '@/components/Footer';
import { getLandingPage } from '@/app/actions';
import { Providers } from '@/app/providers';
import { SplashCursor } from "@/components/ui/splash-cursor";
import type { Metadata } from "next";


// 修改类型定义，使用 generateStaticParams 来处理参数
export async function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

// Add metadata for better SEO
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages(locale);

  return {
    title: {
      template: `%s | ${messages.header.logo}`,
      default: messages.header.logo,
    },
    description: messages.hero.description,
    keywords: ["Next.js", "React", "JavaScript", "Web Development", "AI"],
    authors: [{ name: "NextLaunchPad Team" }],
    openGraph: {
      title: messages.hero.title,
      description: messages.hero.description,
      type: "website",
    },
  };
}

// 更新 Layout 组件以支持异步 params
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // 使用 await 获取 locale
  const { locale } = await params;

  // 验证 locale
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // 并行获取消息和页面数据
  const [messages, page] = await Promise.all([
    getMessages(locale),
    getLandingPage(locale)
  ]);

  return (
    <html lang={locale} className="scroll-smooth" suppressHydrationWarning>
      <body>
          <SplashCursor />
          <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>
            {page.header && <Header header={page.header} />}
            <main className="flex-1">
              {children}
            </main>
            {/* <div className="border-t">
              {page.footer && <Footer footer={page.footer} />}
            </div> */}
            </Providers>
          </NextIntlClientProvider>

      </body>
    </html>
  );
}