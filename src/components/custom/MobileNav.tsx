
'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, NotebookPen, CreditCard, Sparkles, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/dashboard/concierge', icon: NotebookPen, label: 'Concierge' },
  { href: '/dashboard/sommelier', icon: Sparkles, label: 'AI Scan' },
  { href: '/dashboard/orders', icon: ShoppingBag, label: 'Bestell.' },
  { href: '/dashboard/loyalty', icon: CreditCard, label: 'Karte' },
];

export function MobileNav() {
  const pathname = usePathname();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border/50 shadow-t-lg lg:hidden z-40">
      <nav className="grid h-full grid-cols-5 items-center px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={cn(
                'flex h-full flex-col items-center justify-center gap-1 rounded-md p-1 transition-colors relative',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              )}
            >
              {isActive && <div className="absolute top-0 h-1 w-full max-w-8 bg-primary rounded-full animate-in fade-in-0 slide-in-from-top-1 duration-300" />}
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
