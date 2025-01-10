import { Pathnames } from "next-intl/routing";
import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

// Define supported locales
export const locales = ["en", "zh", "ja", "ko", "fr"];

export const localeNames: any = {
  en: "English",
  zh: "简体中文",
  ja: "日本語",
  ko: "한국어",
  fr: "Français",
};

export const defaultLocale = "en";
export const localePrefix = "always";
export const localeDetection = true;

export const pathnames = {
  en: {
    "privacy-policy": "/privacy-policy",
    "terms-of-service": "/terms-of-service",
  },
} satisfies Pathnames<typeof locales>;

// Routing configuration
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix,
  localeDetection,
});

// Navigation utilities
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);

// Get messages for each locale
export async function getMessages(locale: string) {
  try {
    return (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

// Request configuration for next-intl
export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: await getMessages(locale),
  };
});