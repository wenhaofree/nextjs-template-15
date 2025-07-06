'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';

/**
 * 应用头部组件
 */
const AppHeader = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href={ROUTES.HOME} className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">
              Next.js Template
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href={ROUTES.FEATURES}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Features
            </Link>
            <Link
              href={ROUTES.PRICING}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Pricing
            </Link>
            <Link
              href={ROUTES.ABOUT}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              About
            </Link>
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* 搜索框可以在这里添加 */}
          </div>
          <nav className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm">Welcome, {user?.name || user?.email}</span>
                <Link
                  href={ROUTES.USER.PROFILE}
                  className="text-sm font-medium transition-colors hover:text-foreground/80"
                >
                  Profile
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href={ROUTES.AUTH.LOGIN}
                  className="text-sm font-medium transition-colors hover:text-foreground/80"
                >
                  Login
                </Link>
                <Link
                  href={ROUTES.AUTH.REGISTER}
                  className="text-sm font-medium transition-colors hover:text-foreground/80"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
