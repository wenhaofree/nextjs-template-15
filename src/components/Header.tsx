"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import { locales, localeNames } from "@/i18n/routing";
import { Menu, Globe } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ThemeToggle";

interface HeaderProps {
  header: {
    logo: string;
    nav: {
      benefit: string;
      stats: string;
      pricing: string;
      testimonial: string;
      faq: string;
    };
    cta: {
      login: string;
      signup: string;
    };
    userMenu: {
      myOrders: string;
      signOut: string;
      profile: string;
    };
  };
}

export default function Header({ header }: HeaderProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const switchLocale = (locale: string) => {
    const newPathname = pathname.replace(`/${currentLocale}`, `/${locale}`);
    window.location.href = newPathname;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 dark:border-gray-800/50 bg-white/80 dark:bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-background/60 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <nav className="relative flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex-none">
            <Link href="/" className="flex items-center group">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">{header.logo}</span>
            </Link>
          </div>

        {/* Center: Navigation Links - Desktop Only */}
        <div className="hidden md:flex items-center justify-center flex-1 px-8">
          <div className="flex space-x-8">
            {Object.entries(header.nav).map(([key, value]) => {
              // Map header nav keys to actual section IDs
              const sectionMap: Record<string, string> = {
                benefit: 'features',
                stats: 'stats',
                pricing: 'pricing',
                testimonial: 'testimonials',
                faq: 'faq'
              };
              const sectionId = sectionMap[key] || key;
              const isActive = pathname.includes(`#${sectionId}`) || pathname.endsWith(`#${sectionId}`);
              return (
                <Link
                  key={key}
                  href={`/${pathname.split('/')[1]}#${sectionId}`}
                  className={`text-sm hover:text-gray-900 dark:hover:text-white transition-colors duration-300 ${
                    isActive
                      ? "text-primary font-medium"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {value}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Language & CTA Buttons */}
        <div className="hidden md:flex items-center space-x-6">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300">
              <Globe className="h-4 w-4" />
              <span>{localeNames[currentLocale]}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {locales.map((locale) => (
                <DropdownMenuItem
                  key={locale}
                  onClick={() => switchLocale(locale)}
                  className="cursor-pointer"
                >
                  {localeNames[locale]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center space-x-3">
            {session ? (
              <div className="relative" ref={dropdownRef}>
                <div>
                  <button
                    type="button"
                    className="flex items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    {session.user?.image ? (
                      <Image
                        className="h-8 w-8 rounded-full"
                        src={session.user.image}
                        alt={session.user.name || ''}
                        width={32}
                        height={32}
                        unoptimized
                        priority
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600">
                          {session.user?.name?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                  </button>
                </div>

                {isDropdownOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 text-sm text-gray-700">
                      <div className="font-medium">{session.user?.name}</div>
                    </div>
                    <div className="px-4 py-2 text-sm text-gray-700">
                      <div className="text-gray-500">{session.user?.email}</div>
                    </div>
                    <div className="border-t border-gray-100" />
                    <Link
                      href={`/${currentLocale}/orders`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50"
                    >
                      {header.userMenu.myOrders}
                    </Link>
                    <Link
                      href={`/${currentLocale}/profile`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50"
                    >
                      {header.userMenu.profile}
                    </Link>
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: `/${currentLocale}` })}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-pink-50"
                    >
                      {header.userMenu.signOut}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center">
                <Button
                  onClick={() => signIn()}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {header.cta.login}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <ThemeToggle />
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
                {Object.entries(header.nav).map(([key, value]) => {
                  // Map header nav keys to actual section IDs
                  const sectionMap: Record<string, string> = {
                    benefit: 'features',
                    stats: 'stats',
                    pricing: 'pricing',
                    testimonial: 'testimonials',
                    faq: 'faq'
                  };
                  const sectionId = sectionMap[key] || key;
                  const isActive = pathname.includes(`#${sectionId}`) || pathname.endsWith(`#${sectionId}`);
                  return (
                    <Link
                      key={key}
                      href={`/${pathname.split('/')[1]}#${sectionId}`}
                      className={`text-sm hover:text-gray-900 transition-colors ${
                        isActive
                          ? "text-primary font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {value}
                    </Link>
                  );
                })}
                <div className="flex items-center space-x-1 text-sm text-gray-600" onClick={() => switchLocale(currentLocale)}>
                  <Globe className="h-4 w-4" />
                  <span>{localeNames[currentLocale]}</span>
                </div>
                {session ? (
                  <div className="flex flex-col space-y-3 pt-4">
                    <div className="font-medium">{session.user?.name}</div>
                    <div className="text-gray-500">{session.user?.email}</div>
                    <Link
                      href={`/${currentLocale}/orders`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50"
                    >
                      {header.userMenu.myOrders}
                    </Link>
                    <Link
                      href={`/${currentLocale}/profile`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50"
                    >
                      {header.userMenu.profile}
                    </Link>
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: `/${currentLocale}` })}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-pink-50"
                    >
                      {header.userMenu.signOut}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3 pt-4">
                    <Button
                      onClick={() => signIn()}
                      size="sm"
                      className="bg-[#00C7B0] hover:bg-[#00B3A0] text-white rounded-full"
                    >
                      {header.cta.login}
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        </nav>
      </div>
    </header>
  );
}