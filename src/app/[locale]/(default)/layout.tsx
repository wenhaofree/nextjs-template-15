import "../../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from '@/i18n';
import { getLandingPage } from '@/app/actions';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { locales } from '@/i18n/config';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Providers } from '../../providers';

interface Props {
  children: React.ReactNode;
  params: { locale: string };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Props) {
  const { locale } = await Promise.resolve(params);
  
  // Enable static rendering
  unstable_setRequestLocale(locale);
  
  const messages = await getMessages(locale);
  const page = await getLandingPage(locale);

  return (
    <html lang={locale} className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>
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
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}