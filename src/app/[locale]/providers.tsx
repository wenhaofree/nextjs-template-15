'use client'

import { SessionProvider } from 'next-auth/react'
import { NextIntlClientProvider } from 'next-intl'

interface ProvidersProps {
  children: React.ReactNode
  locale: string
  messages: Record<string, any>
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <SessionProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        {children}
      </NextIntlClientProvider>
    </SessionProvider>
  )
} 