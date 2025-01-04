'use client';

import { useLanguage } from '@/hooks/useLanguage';

export function ClientLanguageManager({ locale }: { locale: string }) {
  useLanguage();
  return null;
}
