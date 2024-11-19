import { Providers } from './providers'
import { Header } from '@/components/layout/header'
import "./globals.css";
import {getMessages, unstable_setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';
import { Toaster } from 'sonner'
import { Footer } from '@/components/layout/footer';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  // First await the params object itself
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as  'zh' | 'en')) {
    notFound();
  }

  // This will properly set up the locale for the request
  unstable_setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const typedMessages = messages as Record<string, string>;

  return (
    <html lang={locale}>
      <body>
        <Providers locale={locale} messages={typedMessages}>
          <Header />
          {children}
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

// Add this to enable static rendering
export function generateStaticParams() {
  return [{locale: 'en'}, {locale: 'zh'}]; // Add your supported locales
}