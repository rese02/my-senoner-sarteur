
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
    <div className="flex flex-col h-full text-primary-foreground">
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.label}
            variant={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)) ? 'secondary' : 'ghost'}
            className="w-full justify-start text-base transition-colors duration-200 hover:bg-primary-foreground/10 data-[variant=secondary]:text-primary"
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-3 h-5 w-5" strokeWidth={1.75} />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
      <div className="mt-auto p-4">
        <Separator className="mb-4 bg-primary-foreground/10"/>
        <form action={logout}>
          <Button variant="ghost" className="w-full justify-start text-base transition-colors duration-200 hover:bg-primary-foreground/10">
            <LogOut className="mr-3 h-5 w-5" strokeWidth={1.75}/>
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}
