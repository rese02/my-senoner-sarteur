
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { PRIMARY_NAV_ITEMS } from './admin-nav-items';


export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border grid grid-cols-4 items-center md:hidden z-30">
      {PRIMARY_NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.href) && (item.href !== '/admin/dashboard' || pathname === '/admin/dashboard');
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded-md transition-colors w-full h-full justify-center relative',
              isActive ? 'text-primary bg-secondary' : 'text-muted-foreground hover:text-primary'
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
