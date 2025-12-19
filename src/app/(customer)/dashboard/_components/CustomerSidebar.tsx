
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
import { useLanguage } from '@/components/providers/LanguageProvider';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

export function CustomerSidebar({ showPlanner, showSommelier }: { showPlanner: boolean; showSommelier: boolean; }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const navItems = [
    { href: '/dashboard', icon: ShoppingCart, label: t.nav.dashboard, id: 'discover' },
    { href: '/dashboard/orders', icon: History, label: t.nav.orders, id: 'orders' },
    { href: '/dashboard/concierge', icon: NotebookPen, label: t.nav.concierge, id: 'concierge' },
    { href: '/dashboard/planner', icon: PartyPopper, label: t.nav.planner, id: 'planner' },
    { href: '/dashboard/loyalty', icon: CreditCard, label: t.nav.loyalty, id: 'loyalty' },
    { href: '/dashboard/sommelier', icon: Sparkles, label: t.nav.sommelier, id: 'sommelier' },
  ];

  const visibleNavItems = navItems.filter(item => {
    if (item.id === 'planner') return showPlanner;
    if (item.id === 'sommelier') return showSommelier;
    return true;
  });

  return (
    <div className="h-full flex flex-col">
        <div className="p-4 border-b border-primary-foreground/20 h-16 flex items-center justify-center">
            <Logo />
        </div>

      <nav className="flex-1 p-4 pt-4 space-y-1">
        {visibleNavItems.map((item) => {
           const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
           return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                isActive 
                  ? "bg-primary-foreground/10 text-white" 
                  : "text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto p-4">
        <Separator className="my-2 bg-primary-foreground/20" />
        
        <div className="p-2">
            <LanguageSwitcher />
        </div>

        <Separator className="my-2 bg-primary-foreground/20" />
        
        <Link
          href="/dashboard/profile"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 mb-1",
            pathname.startsWith('/dashboard/profile') 
              ? "bg-primary-foreground/10 text-white" 
              : "text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-white"
          )}
        >
          <User className="h-5 w-5" strokeWidth={2} />
          <span>{t.nav.profile}</span>
        </Link>
        <form action={logout}>
          <Button variant="ghost" className="w-full justify-start text-primary-foreground/70 hover:text-destructive hover:bg-destructive/10 text-sm px-3 py-2.5">
            <LogOut className="mr-3 h-5 w-5" strokeWidth={2}/>
            {t.common.logout}
          </Button>
        </form>
      </div>
    </div>
  );
}
