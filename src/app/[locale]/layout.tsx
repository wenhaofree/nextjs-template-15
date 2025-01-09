import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from '@/i18n/routing';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import '../globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getLandingPage } from '@/app/actions';

// 从 routing 中获取具体的 locale 类型
type Locale = (typeof routing.locales)[number];

// 修改类型定义，使用 generateStaticParams 来处理参数
export async function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

// 更新 Layout 组件以支持异步 params
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // 获取并等待 locale
  const locale = params.locale;
  
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
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <div className="fixed inset-x-0 top-0 z-50 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="h-full">
                {page.header && <Header header={page.header} />}
              </div>
          </div>
          <main className="flex-1 pt-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          <div className="border-t">
            {page.footer && <Footer footer={page.footer} />}
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}