
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
  Calculator,
  History,
} from 'lucide-react';
import { logout } from '@/app/actions/auth.actions';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: ShoppingCart, label: 'Order' },
  { href: '/dashboard/orders', icon: History, label: 'My Orders'},
  { href: '/dashboard/concierge', icon: NotebookPen, label: 'Concierge' },
  { href: '/dashboard/planner', icon: Calculator, label: 'Party Planer' },
  { href: '/dashboard/loyalty', icon: CreditCard, label: 'My Loyalty Card' },
  { href: '/dashboard/sommelier', icon: Sparkles, label: 'AI Sommelier'},
  { href: '/dashboard/profile', icon: User, label: 'My Profile' },
];

export function CustomerSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full text-card-foreground">
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
           const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
           return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-base font-medium transition-colors hover:bg-secondary",
                isActive ? "bg-primary text-primary-foreground" : "text-card-foreground"
              )}
            >
              <item.icon className="h-5 w-5" strokeWidth={1.75} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto p-4">
        <Separator className="mb-4"/>
        <form action={logout}>
          <Button variant="ghost" className="w-full justify-start text-base transition-colors duration-200 hover:bg-secondary px-4 py-3">
            <LogOut className="mr-3 h-5 w-5" strokeWidth={1.75}/>
            Sign Out
          </Button>
        </form>
      </div>
    </div>
  );
}
