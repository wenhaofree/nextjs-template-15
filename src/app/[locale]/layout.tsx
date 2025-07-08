import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '@/app/globals.css';
import { LandingHeader } from '@/components/sections';
import { getLandingPage } from '@/app/actions';
import { Providers } from '@/app/providers';
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});


// 修改类型定义，使用 generateStaticParams 来处理参数
export async function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

/**
 * Generate metadata for better SEO based on locale
 */
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  try {
    const { locale } = await params;

    // Skip metadata generation for non-locale requests (like favicon.ico, manifest.json, robots.txt, etc.)
    if (!locale ||
        locale.includes('.') ||
        locale === 'favicon.ico' ||
        locale === 'manifest.json' ||
        locale === 'robots.txt' ||
        locale === 'sitemap.xml' ||
        !hasLocale(routing.locales, locale)) {
      return {
        title: 'NextLaunchPad',
        description: 'A modern Next.js SaaS template',
      };
    }

    const messages = await getMessages(locale);

    return {
      title: {
        template: `%s | ${messages.header?.logo || 'NextLaunchPad'}`,
        default: messages.header?.logo || 'NextLaunchPad',
      },
      description: messages.hero?.description || 'A modern Next.js SaaS template',
      keywords: [
        "Next.js",
        "React",
        "TypeScript",
        "SaaS",
        "Template",
        "Web Development",
        "AI"
      ],
      authors: [{ name: "NextLaunchPad Team" }],
      openGraph: {
        title: messages.hero?.title || 'NextLaunchPad',
        description: messages.hero?.description || 'A modern Next.js SaaS template',
        type: "website",
        locale: locale,
        siteName: messages.header?.logo || 'NextLaunchPad',
      },
      alternates: {
        languages: routing.locales.reduce((acc, loc) => {
          acc[loc] = `/${loc}`;
          return acc;
        }, {} as Record<string, string>),
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    // Fallback metadata
    return {
      title: 'NextLaunchPad',
      description: 'A modern Next.js SaaS template',
    };
  }
}

/**
 * Locale-specific layout component with internationalization support
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  try {
    // Extract locale from params
    const { locale } = await params;

    // Skip layout for non-locale requests (like favicon.ico, manifest.json, robots.txt, etc.)
    // These should be handled by the root layout or specific route handlers
    if (!locale ||
        locale.includes('.') ||
        locale.startsWith('_') ||
        locale === 'favicon.ico' ||
        locale === 'manifest.json' ||
        locale === 'robots.txt' ||
        locale === 'sitemap.xml') {
      notFound();
    }

    // Validate locale against supported locales using hasLocale
    if (!hasLocale(routing.locales, locale)) {
      console.warn(`Invalid locale received: ${locale}`);
      notFound();
    }

    // Parallel data fetching for better performance
    const [messages, page] = await Promise.all([
      getMessages(locale),
      getLandingPage(locale)
    ]);

    return (
      <html
        lang={locale}
        className="scroll-smooth"
        suppressHydrationWarning
      >
        <body
          className={`${inter.variable} font-sans antialiased`}
          suppressHydrationWarning
        >
          <NextIntlClientProvider messages={messages} locale={locale}>
            <Providers>
              {/* Header Section */}
              {page.header && (
                <LandingHeader header={page.header} />
              )}

              {/* Main Content */}
              <main className="flex-1 min-h-screen">
                {children}
              </main>

              {/* Footer Section - Currently handled in page components */}
            </Providers>
          </NextIntlClientProvider>
        </body>
      </html>
    );
  } catch (error) {
    console.error('Error in LocaleLayout:', error);
    notFound();
  }
}