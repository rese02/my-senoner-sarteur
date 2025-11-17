'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  Megaphone,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { logout } from '@/app/actions/auth.actions';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Bestellungen' },
  { href: '/admin/products', icon: Package, label: 'Produkte' },
  { href: '/admin/customers', icon: Users, label: 'Kunden' },
  { href: '/admin/marketing', icon: Megaphone, label: 'Marketing' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-primary text-primary-foreground">
      <div className="p-4 border-b border-primary-foreground/10">
        <Logo />
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.label}
            variant={pathname.startsWith(item.href) ? 'secondary' : 'ghost'}
            className="w-full justify-start text-base transition-colors duration-200 hover:bg-primary-foreground/10 hover:text-primary-foreground data-[variant=secondary]:text-primary"
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-3 h-5 w-5" strokeWidth={1.75} />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
      <Separator className="bg-primary-foreground/10" />
      <div className="p-4">
        <form action={logout}>
          <Button variant="ghost" className="w-full justify-start text-base transition-colors duration-200 hover:bg-primary-foreground/10 hover:text-primary-foreground">
            <LogOut className="mr-3 h-5 w-5" strokeWidth={1.75}/>
            Sign Out
          </Button>
        </form>
      </div>
    </aside>
  );
}
