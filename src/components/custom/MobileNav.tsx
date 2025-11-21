
'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CreditCard, User, ShoppingCart, Sparkles, NotebookPen, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: ShoppingCart, label: 'Order' },
  { href: '/dashboard/concierge', icon: NotebookPen, label: 'Concierge' },
  { href: '/dashboard/planner', icon: Calculator, label: 'Planer' },
  { href: '/dashboard/loyalty', icon: CreditCard, label: 'Card' },
  { href: '/dashboard/sommelier', icon: Sparkles, label: 'AI Scan' },
];

export function MobileNav() {
  const pathname = usePathname();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border grid grid-cols-5 items-center md:hidden z-30">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
        return (
          <Link 
            key={item.href} 
            href={item.href} 
            className={cn(
              'flex flex-col items-center gap-1 p-2 rounded-md transition-colors',
              isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            )}
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
