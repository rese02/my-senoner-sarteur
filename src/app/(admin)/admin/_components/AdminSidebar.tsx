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

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Bestellungen', icon: ShoppingCart },
  { href: '/admin/products', label: 'Produkte', icon: Package },
  { href: '/admin/customers', label: 'Kunden', icon: Users },
  { href: '/admin/marketing', label: 'Marketing', icon: Megaphone },
  { href: '/admin/sommelier', label: 'Sommelier', icon: Sparkles },
];

const secondaryNavItems = [
    { href: '/admin/settings', label: 'Einstellungen', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-gradient-to-br from-primary to-[#003366] text-primary-foreground shadow-2xl">
      <div className="p-6 border-b border-primary-foreground/10 h-20 flex items-center">
        <Logo />
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Button
              key={item.label}
              variant={isActive ? 'secondary' : 'ghost'}
              className={`w-full justify-start text-base font-medium transition-all duration-300 group rounded-lg
                ${isActive
                  ? 'bg-card text-primary shadow-md translate-x-1'
                  : 'text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-white'
                }`}
              asChild
            >
              <Link href={item.href}>
                <item.icon 
                  className={`mr-3 h-5 w-5 transition-colors duration-300 
                  ${isActive ? 'text-accent' : 'text-primary-foreground/70 group-hover:text-white'}`} 
                  strokeWidth={1.75} />
                {item.label}
              </Link>
            </Button>
          )
        })}
      </nav>

      <div className="mt-auto">
        <Separator className="bg-primary-foreground/10" />
        <nav className="p-4 space-y-2">
            {secondaryNavItems.map((item) => {
               const isActive = pathname.startsWith(item.href);
               return (
                <Button
                    key={item.label}
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={`w-full justify-start text-base font-medium transition-all duration-300 group rounded-lg
                      ${isActive
                        ? 'bg-card text-primary shadow-md translate-x-1'
                        : 'text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-white'
                      }`}
                    asChild
                >
                    <Link href={item.href}>
                      <item.icon className={`mr-3 h-5 w-5 transition-colors duration-300 
                        ${isActive ? 'text-accent' : 'text-primary-foreground/70 group-hover:text-white'}`} 
                        strokeWidth={1.75} />
                      {item.label}
                    </Link>
                </Button>
               )
            })}
        </nav>
        <Separator className="bg-primary-foreground/10" />
        <div className="p-4">
            <form action={logout}>
            <Button variant="ghost" className="w-full justify-start text-base transition-colors duration-200 hover:bg-primary-foreground/10 text-primary-foreground/80 hover:text-white">
                <LogOut className="mr-3 h-5 w-5" strokeWidth={1.75}/>
                Sign Out
            </Button>
            </form>
        </div>
      </div>
    </aside>
  );
}
