'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants/routes';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Settings,
  ChevronRight
} from 'lucide-react';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: ROUTES.DASHBOARD.HOME,
    icon: LayoutDashboard,
    description: 'Overview and metrics',
  },
  {
    title: 'Analytics',
    href: ROUTES.DASHBOARD.ANALYTICS,
    icon: BarChart3,
    description: 'Data insights and reports',
  },
  {
    title: 'Users',
    href: ROUTES.DASHBOARD.USERS,
    icon: Users,
    description: 'User management',
  },
  {
    title: 'Settings',
    href: ROUTES.DASHBOARD.SETTINGS,
    icon: Settings,
    description: 'Application settings',
  },
];

/**
 * Application sidebar component with navigation items
 */
const AppSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="pb-12 w-64 border-r bg-background">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Dashboard
          </h2>
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    'hover:bg-accent hover:text-accent-foreground',
                    'focus:bg-accent focus:text-accent-foreground focus:outline-none',
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  <Icon className={cn(
                    'mr-3 h-4 w-4 transition-colors',
                    isActive ? 'text-accent-foreground' : 'text-muted-foreground'
                  )} />
                  <div className="flex-1">
                    <div className="font-medium">{item.title}</div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground">
                        {item.description}
                      </div>
                    )}
                  </div>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-accent-foreground" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSidebar;
