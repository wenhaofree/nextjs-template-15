'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavigationItem {
  title: string;
  href: string;
  description?: string;
}

interface AppNavigationProps {
  items: NavigationItem[];
  className?: string;
}

/**
 * 应用导航组件
 */
const AppNavigation = ({ items, className }: AppNavigationProps) => {
  const pathname = usePathname();

  return (
    <nav className={cn('flex items-center space-x-6', className)}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === item.href
              ? 'text-primary'
              : 'text-muted-foreground'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
};

export default AppNavigation;
