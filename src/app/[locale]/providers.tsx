'use client'

import { SessionProvider } from 'next-auth/react'
import { NextIntlClientProvider } from 'next-intl'

interface ProvidersProps {
  children: React.ReactNode
  locale: string
  messages: Record<string, string> // 修改这里

}

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <SessionProvider>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone='Asia/Shanghai'>
        {children}
      </NextIntlClientProvider>
    </SessionProvider>
  )
} 