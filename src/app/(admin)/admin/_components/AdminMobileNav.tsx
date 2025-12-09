'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Package, Users, Megaphone, Sparkles, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Bestell.' },
  { href: '/admin/products', icon: Package, label: 'Produkte' },
  { href: '/admin/customers', icon: Users, label: 'Kunden' },
  { href: '/admin/marketing', icon: Megaphone, label: 'Marketing' },
  { href: '/admin/sommelier', icon: Sparkles, label: 'Sommelier' },
];

export function AdminMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex justify-around items-center md:hidden z-30">
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href) && (item.href !== '/admin/dashboard' || pathname === '/admin/dashboard');
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded-md transition-colors w-1/5 relative',
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            )}
          >
            {isActive && <div className="absolute top-0 h-0.5 w-8 bg-primary rounded-full animate-in fade-in-0 slide-in-from-top-2 duration-300" />}
            <item.icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
