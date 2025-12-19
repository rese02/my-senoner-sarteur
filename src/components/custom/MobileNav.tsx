
'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, NotebookPen, CreditCard, ShoppingBag, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useCartStore } from '@/hooks/use-cart-store';
import { Cart } from '@/app/(customer)/dashboard/_components/Cart';

type NavItem = {
    href: string;
    icon: React.ElementType;
    label: string;
    id: 'home' | 'concierge' | 'loyalty' | 'orders' | 'sommelier';
    isCentral?: boolean;
};

const navItems: NavItem[] = [
  { id: 'home', href: '/dashboard', icon: Home, label: 'Home' },
  { id: 'concierge', href: '/dashboard/concierge', icon: NotebookPen, label: 'Concierge' },
  { id: 'loyalty', href: '/dashboard/loyalty', icon: CreditCard, label: 'Fidelity', isCentral: true },
  { id: 'orders', href: '/dashboard/orders', icon: ShoppingBag, label: 'Bestell.' },
];

export function MobileNav({ showSommelier }: { showSommelier: boolean }) {
  const pathname = usePathname();
  const cartItems = useCartStore(state => state.items);

  const visibleNavItems = navItems.filter(item => {
    if (item.id === 'sommelier') return showSommelier;
    return true;
  });

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-card border-t border-border/50 shadow-t-lg lg:hidden z-40">
      <nav className="grid h-full grid-cols-5 items-center px-2">
        {visibleNavItems.map((item) => {
          const isActive = pathname === item.href;
          if (item.isCentral) {
            return (
              <div key={item.href} className="flex justify-center">
                <Link
                  href={item.href}
                  className={cn(
                    "relative -mt-8 flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-full shadow-lg transition-all duration-300 p-2",
                    isActive ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground border hover:bg-secondary"
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="text-[10px] font-bold">{item.label}</span>
                </Link>
              </div>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex h-full flex-col items-center justify-center gap-1 p-1 transition-colors rounded-lg',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* Cart Trigger */}
        <Sheet>
            <SheetTrigger asChild>
              <button className="flex h-full flex-col items-center justify-center gap-1 p-1 text-muted-foreground hover:text-primary transition-colors relative rounded-lg" aria-label="Warenkorb öffnen">
                 {cartItems.length > 0 && (
                  <span className="absolute top-2.5 right-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold" aria-hidden="true">
                    {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
                <ShoppingCart className="h-5 w-5" />
                <span className="text-[10px] font-medium">Korb</span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh] flex flex-col rounded-t-2xl p-0 bg-background" aria-describedby="cart-sheet-description">
               <SheetHeader className="sr-only">
                <SheetTitle>Warenkorb</SheetTitle>
                <SheetDescription id="cart-sheet-description">Verwalten Sie hier die Artikel in Ihrem Warenkorb und schließen Sie Ihre Vorbestellung ab.</SheetDescription>
              </SheetHeader>
              <Cart />
            </SheetContent>
          </Sheet>

      </nav>
    </div>
  );
}
