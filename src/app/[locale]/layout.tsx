import {use} from 'react';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import '../globals.css';

// 从 routing 中获取具体的 locale 类型
type Locale = (typeof routing.locales)[number];

// 修改类型定义，使用 generateStaticParams 来处理参数
export async function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

// 移除自定义的 LayoutProps 类型，使用 Next.js 的默认类型
export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const resolvedParams = use(params);
  
  // 验证 locale
  if (!routing.locales.includes(resolvedParams.locale)) {
    notFound();
  }
 
  // 传递正确类型的 locale 参数给 getMessages
  const messages = use(getMessages({ locale: resolvedParams.locale }));
 
  return (
    <html lang={resolvedParams.locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}