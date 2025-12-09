'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History, NotebookPen, Scan, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/dashboard/orders', icon: History, label: 'Bestellungen' },
  { href: '/dashboard/sommelier', icon: Scan, label: 'AI Scan' },
  { href: '/dashboard/concierge', icon: NotebookPen, label: 'Concierge' },
  { href: '/dashboard/profile', icon: User, label: 'Profil' },
];

export function MobileNav() {
  const pathname = usePathname();
  
  return (
    <div className="fixed bottom-4 left-4 right-4 h-16 bg-card/95 backdrop-blur-sm border rounded-2xl shadow-lg lg:hidden z-40">
      <nav className="grid grid-cols-5 items-center h-full px-2">
        {navItems.map((item, index) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          const isCenter = index === 2;

          if (isCenter) {
            return (
                <div key={item.href} className="flex justify-center -mt-6">
                    <Button asChild size="icon" className="w-16 h-16 rounded-full shadow-lg border-4 border-secondary">
                        <Link href={item.href}>
                             <item.icon className="w-7 h-7" />
                        </Link>
                    </Button>
                </div>
            )
          }

          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={cn(
                'flex flex-col items-center justify-center gap-1 p-1 rounded-md transition-colors h-full',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
