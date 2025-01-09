"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeNames } from "@/i18n/routing";

interface FooterProps {
  footer: {
    copyright: string;
    about: {
      title: string;
      about: string;
      blog: string;
    };
    support: {
      title: string;
      helpCenter: string;
      contactUs: string;
    };
    legal: {
      title: string;
      privacy: string;
      terms: string;
    };
    language: {
      title: string;
      english: string;
      chinese: string;
      japanese: string;
      korean: string;
      french: string;
    };
  };
}

export default function Footer({ footer }: FooterProps) {
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1];

  const switchLocale = (locale: string) => {
    const newPathname = pathname.replace(`/${currentLocale}`, `/${locale}`);
    window.location.href = newPathname;
  };

  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{footer.about.title}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm hover:underline">
                  {footer.about.about}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm hover:underline">
                  {footer.about.blog}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{footer.support.title}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-sm hover:underline">
                  {footer.support.helpCenter}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:underline">
                  {footer.support.contactUs}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{footer.legal.title}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm hover:underline">
                  {footer.legal.privacy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm hover:underline">
                  {footer.legal.terms}
                </Link>
              </li>
            </ul>
          </div>

          {/* Language Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">{footer.language.title}</h3>
            <ul className="space-y-2">
              {locales.map((locale) => (
                <li key={locale}>
                  <button
                    onClick={() => switchLocale(locale)}
                    className={`text-sm hover:underline ${
                      locale === currentLocale ? 'font-bold' : ''
                    }`}
                  >
                    {localeNames[locale]}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t py-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} {footer.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}