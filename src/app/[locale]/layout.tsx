import { Providers } from './providers'
import { Header } from '@/components/layout/header'
import { unstable_setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { getRequestConfig } from 'next-intl/server'
import "./globals.css";

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  // Validate locale
  if (!routing.locales.includes(locale)) {
    notFound()
  }

  // Enable static rendering
  unstable_setRequestLocale(locale)

  // Load messages
  const messages = (await import(`../../../messages/${locale}.json`)).default

  return (
    <html lang={locale}>
      <body>
        <Providers locale={locale} messages={messages}>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}

// Enable static rendering
export const dynamic = 'force-static'