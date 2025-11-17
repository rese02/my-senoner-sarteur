
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
import { logout } from '@/app/actions/auth.actions';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { href: '/dashboard', icon: ShoppingCart, label: 'Order' },
  { href: '/dashboard/loyalty', icon: CreditCard, label: 'My Loyalty Card' },
  { href: '/dashboard/profile', icon: User, label: 'My Profile' },
];

export function CustomerSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.label}
            variant={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)) ? 'primary' : 'ghost'}
            className="w-full justify-start transition-colors duration-200"
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
          <Button variant="ghost" className="w-full justify-start transition-colors duration-200">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}
