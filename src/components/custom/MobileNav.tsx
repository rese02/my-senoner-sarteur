
'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, NotebookPen, CreditCard, ShoppingBag, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { useCartStore } from '@/hooks/use-cart-store';
import { Cart } from '@/app/(customer)/dashboard/_components/Cart';

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/dashboard/concierge', icon: NotebookPen, label: 'Concierge' },
  { href: '/dashboard/loyalty', icon: CreditCard, label: 'Treuekarte', isCentral: true },
  { href: '/dashboard/orders', icon: ShoppingBag, label: 'Bestell.' },
];

export function MobileNav() {
  const pathname = usePathname();
  const cartItems = useCartStore(state => state.items);
  
  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border/50 shadow-t-lg lg:hidden z-40">
      <nav className="grid h-full grid-cols-5 items-center px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          if (item.isCentral) {
            return (
              <div key={item.href} className="flex justify-center">
                <Link 
                  href={item.href}
                  className={cn(
                    "relative -mt-8 flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-full shadow-lg transition-all duration-300 p-2",
                    isActive ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border hover:bg-secondary"
                  )}
                >
                  <item.icon className="h-7 w-7" />
                  <span className="text-xs font-bold">{item.label}</span>
                </Link>
              </div>
            )
          }

          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={cn(
                'flex h-full flex-col items-center justify-center gap-1 p-1 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
        
        {/* Cart Trigger */}
        <Sheet>
            <SheetTrigger asChild>
              <button className="flex h-full flex-col items-center justify-center gap-1 p-1 text-muted-foreground hover:text-primary transition-colors relative">
                 {cartItems.length > 0 && (
                  <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-foreground text-[10px] font-bold">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
                <ShoppingCart className="h-5 w-5" />
                <span className="text-[10px] font-medium">Korb</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] flex flex-col rounded-t-2xl p-0 bg-background">
              <Cart />
            </SheetContent>
          </Sheet>

      </nav>
    </div>
  );
}
