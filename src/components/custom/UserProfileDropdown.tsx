'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logout } from '@/app/actions/auth.actions';
import type { User } from '@/lib/types';
import { Button } from '../ui/button';

export function UserProfileDropdown({ user }: { user: User }) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
          <UserIcon className="h-5 w-5" />
          <span className="sr-only">Benutzermenü öffnen</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Mein Profil</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:text-destructive-foreground focus:bg-destructive" asChild>
            <form action={logout} className="w-full">
                 <button type="submit" className="w-full text-left flex items-center cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Abmelden</span>
                </button>
            </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
