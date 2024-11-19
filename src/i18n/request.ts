import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';
 
export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;
 
  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as 'zh' | 'en')) {
    locale = routing.defaultLocale;
  }
 
  return {
    locale,
    timeZone: 'Asia/Shanghai', //欧洲 Europe/Vienna      timeZone: 'Asia/Shanghai'
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});