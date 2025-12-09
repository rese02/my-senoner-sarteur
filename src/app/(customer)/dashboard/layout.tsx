'use server';

import { getSession } from "@/lib/session";
import { UserProfileDropdown } from "@/components/custom/UserProfileDropdown";
import { Logo } from "@/components/common/Logo";
import { MobileNav } from "@/components/custom/MobileNav";
import { CustomerSidebar } from "./_components/CustomerSidebar";
import { Phone } from "lucide-react";
import { redirect } from "next/navigation";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";

function DesktopSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-card border-r">
        <CustomerSidebar />
    </aside>
  );
}

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const session = await getSession();
    
    // SICHERHEITS-CHECK: Wenn keine Session existiert, sofort zum Login umleiten.
    if (!session) {
      redirect('/login');
    }

    // Rollen-Sicherheitsnetz: Verhindert, dass Admins/Mitarbeiter auf das Kundendashboard kommen.
    if (session.role === 'admin') {
      redirect('/admin/dashboard');
    }
    if (session.role === 'employee') {
      redirect('/employee/scanner');
    }
    
  return (
    <div className="flex min-h-[100dvh] bg-secondary text-foreground">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col">
        <header className={cn("lg:hidden flex-none flex h-16 items-center justify-between px-4 sticky top-0 z-30 bg-secondary")}>
            <div className="h-8">
              <Logo />
            </div>
            <div className="flex items-center gap-2">
              <a href="tel:+390471123456" className="p-2 hover:bg-card rounded-full transition-colors">
                <Phone size={20} />
                <span className="sr-only">Anrufen</span>
              </a>
              {session && <UserProfileDropdown user={session as User} />}
            </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-28 md:pb-8">
            {children}
        </main>
         <MobileNav />
      </div>
    </div>
  );
}
