'use client'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'

export function Footer() {
  const t = useTranslations('Footer')

  return (
    <footer className="bg-[#12122A] pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-[#7B68EE] font-semibold mb-4">{t('about.title')}</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-[#B0B0DA] hover:text-[#7B68EE] transition-colors">{t('about.about')}</Link></li>
              <li><Link href="#" className="text-[#B0B0DA] hover:text-[#7B68EE] transition-colors">{t('about.blog')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#7B68EE] font-semibold mb-4">{t('support.title')}</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-[#B0B0DA] hover:text-[#7B68EE] transition-colors">{t('support.helpCenter')}</Link></li>
              <li><Link href="#" className="text-[#B0B0DA] hover:text-[#7B68EE] transition-colors">{t('support.contactUs')}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-[#7B68EE] font-semibold mb-4">{t('legal.title')}</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-[#B0B0DA] hover:text-[#7B68EE] transition-colors">{t('legal.privacy')}</Link></li>
              <li><Link href="#" className="text-[#B0B0DA] hover:text-[#7B68EE] transition-colors">{t('legal.terms')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-[#2A2A4A]">
          <p className="text-[#B0B0DA] text-center">
            {t('copyright')} <span className="text-[#7B68EE]">{new Date().getFullYear()}</span> AI STAK
          </p>
        </div>
      </div>
    </footer>
  )
}