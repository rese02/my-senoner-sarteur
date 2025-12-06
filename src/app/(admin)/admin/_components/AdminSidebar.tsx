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
  Sparkles,
  Settings,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { logout } from '@/app/actions/auth.actions';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Bestellungen', icon: ShoppingCart },
  { href: '/admin/products', label: 'Produkte', icon: Package },
  { href: '/admin/customers', label: 'Kunden', icon: Users },
  { href: '/admin/marketing', label: 'Marketing', icon: Megaphone },
  { href: '/admin/sommelier', label: 'AI Sommelier', icon: Sparkles },
];

const secondaryNavItems = [
    { href: '/admin/settings', label: 'Einstellungen', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card text-card-foreground border-r">
      <div className="p-4 border-b h-16 flex items-center justify-center">
        <div className="h-8">
          <Logo />
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href) && (item.href !== '/admin/dashboard' || pathname === '/admin/dashboard');
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(`group flex w-full items-center justify-start rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`)}
            >
              <item.icon 
                className={cn(`mr-3 h-5 w-5 transition-colors duration-200`, 
                isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                )}
                strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto">
        <div className="p-4 space-y-1">
            {secondaryNavItems.map((item) => {
               const isActive = pathname.startsWith(item.href);
               return (
                <Link
                    key={item.label}
                    href={item.href}
                    className={cn(`group flex w-full items-center justify-start rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
                      ${isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`)}
                >
                    <item.icon className={cn(`mr-3 h-5 w-5 transition-colors duration-200`,
                     isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                     )}
                    strokeWidth={isActive ? 2.5 : 2} />
                    {item.label}
                </Link>
               )
            })}
        </div>
        <Separator className="bg-border/50" />
        <div className="p-4">
            <form action={logout}>
            <Button variant="ghost" className="w-full justify-start text-sm transition-colors duration-200 hover:bg-secondary text-muted-foreground hover:text-foreground">
                <LogOut className="mr-3 h-5 w-5" strokeWidth={2}/>
                Abmelden
            </Button>
            </form>
        </div>
      </div>
    </aside>
  );
}
