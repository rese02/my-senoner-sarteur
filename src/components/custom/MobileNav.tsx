'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History, NotebookPen, CreditCard, User, Sparkles, Calculator } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/dashboard/orders', icon: History, label: 'Bestell.' },
  { href: '/dashboard/sommelier', icon: Sparkles, label: 'Sommelier' },
  { href: '/dashboard/loyalty', icon: CreditCard, label: 'Treue' },
  { href: '/dashboard/profile', icon: User, label: 'Profil' },
];

export function MobileNav() {
  const pathname = usePathname();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-primary border-t border-primary/50 shadow-t-lg lg:hidden z-40">
      <nav className="grid h-full grid-cols-5 items-center px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={cn(
                'flex h-full flex-col items-center justify-center gap-1 rounded-md p-1 transition-colors',
                isActive ? 'text-primary-foreground' : 'text-primary-foreground/60 hover:text-primary-foreground'
              )}
            >
              {isActive && <div className="absolute top-0 h-0.5 w-8 bg-accent rounded-full animate-in fade-in-0 slide-in-from-top-2 duration-300" />}
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
