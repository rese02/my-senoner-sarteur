
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  User,
  LogOut,
  ShoppingCart,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { logout } from '@/app/actions/auth.actions';
import { Separator } from '@/components/ui/separator';
import type { User as UserType } from '@/lib/types';


const navItems = [
  { href: '/dashboard', icon: ShoppingCart, label: 'Order' },
  { href: '/dashboard/loyalty', icon: CreditCard, label: 'My Loyalty Card' },
  { href: '/dashboard/profile', icon: User, label: 'My Profile' },
];

export function CustomerSidebar({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

  const sidebarContent = (
    <>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.label}
            variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
      <div className="mt-auto p-4">
        <Separator className="mb-4"/>
        <form action={logout}>
          <Button variant="ghost" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </form>
      </div>
    </>
  );

  if (isMobile) {
    return <div className="flex flex-col h-full">{sidebarContent}</div>;
  }

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r">
      <div className="p-4 border-b">
        <Logo />
      </div>
       {sidebarContent}
    </aside>
  );
}
