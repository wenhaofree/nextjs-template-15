'use client'
import { Link } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import {useRouter,usePathname} from 'next/navigation';

export function Footer() {
  const t = useTranslations('Footer')
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (locale: 'en' | 'zh' | 'ja') => {
    const newPathname = pathname.replace(/^\/[a-z]{2}/, '')
    const newPath = `/${locale}${newPathname || ''}`
    router.replace(newPath)
  }

  return (
    <footer className="bg-[#12122A] pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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
          <div>
            <h3 className="text-[#7B68EE] font-semibold mb-4">{t('language.title')}</h3>
            <ul className="space-y-2">
              <li><button onClick={() => handleLanguageChange('en')} className="text-[#B0B0DA] hover:text-[#7B68EE] transition-colors">{t('language.english')}</button></li>
              <li><button onClick={() => handleLanguageChange('zh')} className="text-[#B0B0DA] hover:text-[#7B68EE] transition-colors">{t('language.chinese')}</button></li>
              <li><button onClick={() => handleLanguageChange('ja')} className="text-[#B0B0DA] hover:text-[#7B68EE] transition-colors">{t('language.japanese')}</button></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
} 