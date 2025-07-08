import type { Metadata } from "next";
import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

/**
 * Generate metadata for authentication pages based on locale
 */
export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  try {
    const { locale } = await params;

    // Validate locale
    if (!routing.locales.includes(locale as any)) {
      throw new Error(`Invalid locale: ${locale}`);
    }

    const t = await getTranslations('auth');

    return {
      title: t('signInTitle'),
      description: t('signInDescription'),
      robots: {
        index: false, // Don't index auth pages
        follow: false,
      },
    };
  } catch (error) {
    console.error('Error generating auth metadata:', error);
    return {
      title: "Authentication",
      description: "User authentication",
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

/**
 * Authentication layout component with locale support
 */
export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  try {
    // Extract locale from params
    const { locale } = await params;

    // Validate locale
    if (!routing.locales.includes(locale as any)) {
      notFound();
    }

    // Set request locale for next-intl
    setRequestLocale(locale);

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex min-h-screen flex-col justify-center">
          {children}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in AuthLayout:', error);
    notFound();
  }
}