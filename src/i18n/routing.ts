import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

// Define supported locales type
export type Locale = 'en' | 'zh' | 'ja';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['zh', 'en', 'ja'] as const,
 
  // Used when no locale matches
  defaultLocale: 'en'
});
 
export const {Link, redirect, usePathname, useRouter} =
  createNavigation(routing);