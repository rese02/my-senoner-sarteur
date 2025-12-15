
'use server';

import { getSession } from "@/lib/session";
import { UserProfileDropdown } from "@/components/custom/UserProfileDropdown";
import { Logo } from "@/components/common/Logo";
import { MobileNav } from "@/components/custom/MobileNav";
import { CustomerSidebar } from "./_components/CustomerSidebar";
import { Menu } from "lucide-react";
import { redirect } from "next/navigation";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

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
    <div className="flex min-h-[100dvh] bg-background text-foreground">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col">
        <header className={cn("lg:hidden flex-none flex h-16 items-center justify-between px-4 sticky top-0 z-30 bg-primary text-primary-foreground backdrop-blur-sm border-b")}>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Menü öffnen</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <SheetHeader className="sr-only">
                    <SheetTitle>Hauptmenü</SheetTitle>
                    <SheetDescription>Navigation für den Kundenbereich</SheetDescription>
                </SheetHeader>
                <CustomerSidebar />
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              {session && <UserProfileDropdown user={session as User} />}
            </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-28 lg:pb-8">
            {children}
        </main>
         <MobileNav />
      </div>
    </div>
  );
}
