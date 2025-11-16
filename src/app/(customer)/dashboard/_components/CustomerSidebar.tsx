'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  CreditCard,
  User,
  LogOut,
  ShoppingCart,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import { logout } from '@/app/actions/auth.actions';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User as UserType } from '@/lib/types';
import { cn } from '@/lib/utils';


const navItems = [
  { href: '/dashboard', icon: ShoppingCart, label: 'Order' },
  { href: '/dashboard/loyalty', icon: CreditCard, label: 'My Loyalty Card' },
];

export function CustomerSidebar({ user, isMobile = false }: { user?: UserType, isMobile?: boolean }) {
  const pathname = usePathname();

  const sidebarContent = (
    <>
      {isMobile && user && (
         <div className="p-4 border-b">
            <div className="flex items-center gap-4">
                <Avatar>
                    <AvatarImage src={`https://api.dicebear.com/8.x/initials/svg?seed=${user?.name}`} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
            </div>
        </div>
      )}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.label}
            variant={pathname === item.href ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
         {isMobile && (
            <>
                <Separator />
                 <Button
                    variant={pathname === '/dashboard/profile' ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    asChild
                >
                    <Link href={'/dashboard/profile'}>
                        <User className="mr-2 h-4 w-4" />
                        My Profile
                    </Link>
                </Button>
            </>
         )}
      </nav>
      <Separator />
      <div className="p-4">
        <form action={logout}>
          <Button variant="ghost" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </form>
      </div>
    </>
  );

  if (isMobile) {
    return <div className="flex flex-col h-full">{sidebarContent}</div>;
  }

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r">
      <div className="p-4 border-b">
        <Logo />
      </div>
       <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.label}
            variant={pathname === item.href ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            asChild
          >
            <Link href={item.href}>
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
    </aside>
  );
}
