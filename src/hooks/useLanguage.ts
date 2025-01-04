'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export function useLanguage() {
  const locale = useLocale();
  const router = useRouter();

  useEffect(() => {
    // Get preferred language from localStorage
    const storedLanguage = localStorage.getItem('preferredLanguage');
    
    // If there's a stored language preference and it's different from current locale
    if (storedLanguage && storedLanguage !== locale) {
      // Update the URL to use the preferred language
      const currentPath = window.location.pathname;
      const newPath = currentPath.replace(`/${locale}`, `/${storedLanguage}`);
      router.push(newPath);
    } else {
      // If no stored preference, store the current locale
      localStorage.setItem('preferredLanguage', locale);
    }

    // Set language preference in cookie for server-side detection
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`; // 1 year
  }, [locale, router]);

  return locale;
}
