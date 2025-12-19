
'use server';

import { getSession } from "@/lib/session";
import { UserProfileDropdown } from "@/components/custom/UserProfileDropdown";
import { MobileNav } from "@/components/custom/MobileNav";
import { CustomerSidebar } from "./_components/CustomerSidebar";
import { Menu } from "lucide-react";
import { redirect } from "next/navigation";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { adminDb } from "@/lib/firebase-admin";
import { getSommelierSettings } from "@/app/actions/wine-manager.actions";
import { AppFooter } from "@/components/common/AppFooter";

async function checkPlannerEventsExist() {
    const plannerEventsSnap = await adminDb.collection('plannerEvents').limit(1).get();
    return !plannerEventsSnap.empty;
}

async function checkSommelierIsActive() {
    try {
        const settings = await getSommelierSettings();
        return settings.isActive;
    } catch (error) {
        console.error("Could not check sommelier settings:", error);
        return false;
    }
}

function DesktopSidebar({ showPlanner, showSommelier }: { showPlanner: boolean; showSommelier: boolean; }) {
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-card border-r">
        <CustomerSidebar showPlanner={showPlanner} showSommelier={showSommelier} />
    </aside>
  );
}

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const session = await getSession();
    
    if (!session) {
      redirect('/login?callbackUrl=/dashboard');
      return null;
    }

    if (session.role === 'admin') {
      redirect('/admin/dashboard');
      return null;
    }
    if (session.role === 'employee') {
      redirect('/employee/scanner');
      return null;
    }

    const [showPlanner, showSommelier] = await Promise.all([
        checkPlannerEventsExist(),
        checkSommelierIsActive()
    ]);
    
  return (
      <div className="flex min-h-[100dvh] bg-background text-foreground">
        <DesktopSidebar showPlanner={showPlanner} showSommelier={showSommelier} />
        <div className="flex-1 flex flex-col">
          <header className={cn("lg:hidden flex-none flex h-16 items-center justify-between px-4 sticky top-0 z-30 bg-card backdrop-blur-sm border-b")}>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-foreground hover:bg-secondary">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Menü öffnen</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-64 bg-card">
                  <SheetHeader className="sr-only">
                      <SheetTitle>Hauptmenü</SheetTitle>
                      <SheetDescription>Navigation für den Kundenbereich</SheetDescription>
                  </SheetHeader>
                  <CustomerSidebar showPlanner={showPlanner} showSommelier={showSommelier} />
                </SheetContent>
              </Sheet>

              <div className="flex items-center gap-2">
                <UserProfileDropdown user={session as User} />
              </div>
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-28 lg:pb-8">
              {children}
              <AppFooter />
          </main>
          <MobileNav showSommelier={showSommelier} />
        </div>
      </div>
  );
}
