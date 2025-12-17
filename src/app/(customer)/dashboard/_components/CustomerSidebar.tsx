
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  User,
  LogOut,
  ShoppingCart,
  Sparkles,
  NotebookPen,
  PartyPopper,
  History,
} from 'lucide-react';
import { logout } from '@/app/actions/auth.actions';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/common/Logo';

const navItems = [
  { href: '/dashboard', icon: ShoppingCart, label: 'Entdecken', id: 'discover' },
  { href: '/dashboard/orders', icon: History, label: 'Meine Bestellungen', id: 'orders' },
  { href: '/dashboard/concierge', icon: NotebookPen, label: 'Concierge', id: 'concierge' },
  { href: '/dashboard/planner', icon: PartyPopper, label: 'Party Planer', id: 'planner' },
  { href: '/dashboard/loyalty', icon: CreditCard, label: 'Fidelity', id: 'loyalty' },
  { href: '/dashboard/sommelier', icon: Sparkles, label: 'AI Sommelier', id: 'sommelier' },
];

export function CustomerSidebar({ showPlanner, showSommelier }: { showPlanner: boolean; showSommelier: boolean; }) {
  const pathname = usePathname();
  const visibleNavItems = navItems.filter(item => {
    if (item.id === 'planner') return showPlanner;
    if (item.id === 'sommelier') return showSommelier;
    return true;
  });

  return (
    <div className="h-full flex flex-col">
        <div className="p-4 border-b h-16 flex items-center justify-center bg-primary">
            <Logo />
        </div>
      <nav className="flex-1 p-4 space-y-1">
        {visibleNavItems.map((item) => {
           const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
           return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto p-4">
        <Separator className="mb-2"/>
        <Link
          href="/dashboard/profile"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 mb-1",
            pathname.startsWith('/dashboard/profile') 
              ? "bg-secondary text-foreground" 
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          )}
        >
          <User className="h-5 w-5" strokeWidth={2} />
          <span>Mein Profil</span>
        </Link>
        <form action={logout}>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground text-sm px-3 py-2.5">
            <LogOut className="mr-3 h-5 w-5" strokeWidth={2}/>
            Abmelden
          </Button>
        </form>
        <Separator className="my-2"/>
        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
            <Link href="/impressum" className="hover:text-primary">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-primary">Datenschutz</Link>
        </div>
      </div>
    </div>
  );
}
