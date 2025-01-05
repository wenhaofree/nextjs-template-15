import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from "@/i18n/LanguageSwitcher";

export default function Home() {
  const t = useTranslations('HomePage');
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 z-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold">{t('title')}</h1>
            <nav className="flex items-center space-x-6">
              <a href="#about" className="text-sm hover:text-gray-600 dark:hover:text-gray-300">{t('about')}</a>
              <a href="#products" className="text-sm hover:text-gray-600 dark:hover:text-gray-300">{t('aiProducts')}</a>
              <a href="#categories" className="text-sm hover:text-gray-600 dark:hover:text-gray-300">{t('category')}</a>
              <a href="#rankings" className="text-sm hover:text-gray-600 dark:hover:text-gray-300">{t('rankings')}</a>
              <div className="ml-2">
                <LanguageSwitcher />
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        <section className="py-20 px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">{t('heroTitle')}</h2>
          <p className="max-w-2xl mx-auto text-lg mb-8">{t('heroDescription')}</p>
          <div className="max-w-xl mx-auto">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </section>

        <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">{t('tool')}</h3>
              <p>{t('toolDescription')}</p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">{t('aiAssistant')}</h3>
              <p>{t('toolDescription')}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
