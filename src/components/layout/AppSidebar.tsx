'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';

interface SidebarItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: ROUTES.DASHBOARD.HOME,
  },
  {
    title: 'Analytics',
    href: ROUTES.DASHBOARD.ANALYTICS,
  },
  {
    title: 'Users',
    href: ROUTES.DASHBOARD.USERS,
  },
  {
    title: 'Settings',
    href: ROUTES.DASHBOARD.SETTINGS,
  },
];

/**
 * 应用侧边栏组件
 */
const AppSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="pb-12 w-64">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Dashboard
          </h2>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                  pathname === item.href && 'bg-accent text-accent-foreground'
                )}
              >
                <div className="text-sm font-medium leading-none">
                  {item.title}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
