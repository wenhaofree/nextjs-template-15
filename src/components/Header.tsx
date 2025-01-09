"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { locales } from "@/i18n/routing";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
  header: {
    logo: string;
    nav: {
      features: string;
      pricing: string;
      examples: string;
      docs: string;
    };
    cta: {
      login: string;
      signup: string;
    };
  };
}

export default function Header({ header }: HeaderProps) {
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1];

  const switchLocale = (locale: string) => {
    const newPathname = pathname.replace(`/${currentLocale}`, `/${locale}`);
    window.location.href = newPathname;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
      <nav className="relative flex h-16 items-center justify-between">
        {/* Left: Logo */}
        <div className="flex-none">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">{header.logo}</span>
          </Link>
        </div>

        {/* Center: Navigation Links - Desktop Only */}
        <div className="hidden md:flex items-center justify-center flex-1 px-8">
          <div className="flex space-x-8">
            {Object.entries(header.nav).map(([key, value]) => (
              <Link
                key={key}
                href={`#${key}`}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {value}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Language & CTA Buttons */}
        <div className="hidden md:flex items-center space-x-6">
          <select
            onChange={(e) => switchLocale(e.target.value)}
            value={currentLocale}
            className="bg-transparent text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            {locales.map((locale) => (
              <option key={locale} value={locale}>
                {locale.toUpperCase()}
              </option>
            ))}
          </select>

          <div className="flex items-center space-x-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
              {header.cta.login}
            </Link>
            <Button size="sm" className="bg-[#00C7B0] hover:bg-[#00B3A0] text-white rounded-full px-6">
              {header.cta.signup}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>{header.logo}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-6">
                {Object.entries(header.nav).map(([key, value]) => (
                  <Link
                    key={key}
                    href={`#${key}`}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {value}
                  </Link>
                ))}
                <select
                  onChange={(e) => switchLocale(e.target.value)}
                  value={currentLocale}
                  className="bg-transparent text-sm text-gray-600 hover:text-gray-900 py-2"
                >
                  {locales.map((locale) => (
                    <option key={locale} value={locale}>
                      {locale.toUpperCase()}
                    </option>
                  ))}
                </select>
                <div className="flex flex-col space-y-3 pt-4">
                  <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
                    {header.cta.login}
                  </Link>
                  <Button size="sm" className="bg-[#00C7B0] hover:bg-[#00B3A0] text-white rounded-full">
                    {header.cta.signup}
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </div>
  );
}