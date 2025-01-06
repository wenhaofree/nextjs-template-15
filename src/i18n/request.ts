import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as 'zh' | 'en')) {
    locale = routing.defaultLocale;
  }

  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    // If the requested locale file doesn't exist, fallback to English
    messages = (await import(`../../messages/en.json`)).default;
  }

  return {
    locale,
    timeZone: 'Asia/Shanghai',
    messages
  };
});