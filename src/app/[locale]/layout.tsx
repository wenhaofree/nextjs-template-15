import { Providers } from './providers'
import { Header } from '@/components/layout/header'
import "./globals.css";
import {getMessages, unstable_setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Locale, routing} from '@/i18n/routing';
import { Toaster } from 'sonner'
import { Footer } from '@/components/layout/footer';
import { Metadata } from 'next'

// Define metadata for better SEO
export const metadata: Metadata = {
  metadataBase: new URL('https://aistak.com'),
  icons:{
    icon:[
      {
        url: '/favicon.ico',
        sizes: 'any',
      }
    ]
  },
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'zh-CN': '/zh',
      'ja-JP': '/ja'
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aistak.com',
    siteName: 'AIstak',
    images: [
      {
        url: 'https://aistak.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AIstak - Your AI Assistant',
      }
    ],
    description: 'Your AI-powered assistant for everyday tasks',
    title: 'AIstak - AI Assistant',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@aistak', // Your Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add Google verification
  }
}

// Add JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'AIstak',
  url: 'https://aistak.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://aistak.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  unstable_setRequestLocale(locale);

  const messages = await getMessages();
  const typedMessages = messages as Record<string, string>;

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        
        {/* Add structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Providers locale={locale} messages={typedMessages}>
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return [{locale: 'en'}, {locale: 'zh'},{locale: 'ja'}];
}