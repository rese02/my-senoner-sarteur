
'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, NotebookPen, CreditCard, ShoppingBag, ShoppingCart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useCartStore } from '@/hooks/use-cart-store';
import { Cart } from '@/app/(customer)/dashboard/_components/Cart';

type NavItem = {
    href: string;
    icon: React.ElementType;
    label: string;
    isCentral?: boolean;
    id: 'home' | 'concierge' | 'loyalty' | 'orders' | 'sommelier';
};

const allNavItems: NavItem[] = [
  { id: 'home', href: '/dashboard', icon: Home, label: 'Home' },
  { id: 'concierge', href: '/dashboard/concierge', icon: NotebookPen, label: 'Concierge' },
  { id: 'sommelier', href: '/dashboard/sommelier', icon: Sparkles, label: 'AI Scan' },
  { id: 'loyalty', href: '/dashboard/loyalty', icon: CreditCard, label: 'Fidelity', isCentral: true },
  { id: 'orders', href: '/dashboard/orders', icon: ShoppingBag, label: 'Bestell.' },
];

export function MobileNav({ showSommelier }: { showSommelier: boolean }) {
  const pathname = usePathname();
  const cartItems = useCartStore(state => state.items);

  // Filter out sommelier if it's not active
  const navItems = allNavItems.filter(item => {
      if (item.id === 'sommelier') return showSommelier;
      return true;
  });

  // Adjust grid columns based on number of items
  const gridColsClass = `grid-cols-${navItems.length + 1}`; // +1 for the cart

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border/50 shadow-t-lg lg:hidden z-40">
      <nav className={cn("grid h-full items-center px-1", gridColsClass)}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          if (item.isCentral) {
            return (
              <div key={item.href} className="flex justify-center">
                <Link 
                  href={item.href}
                  className={cn(
                    "relative -mt-6 flex h-16 w-16 flex-col items-center justify-center gap-1 rounded-full shadow-lg transition-all duration-300 p-2 border-4 border-background",
                    isActive ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-secondary"
                  )}
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
                  <span className="absolute top-1 right-3 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-accent-foreground text-[10px] font-bold" aria-hidden="true">
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
