
import { getSession } from "@/lib/session";
import { mockUsers } from "@/lib/mock-data";
import { UserProfileDropdown } from "@/components/custom/UserProfileDropdown";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { MobileNav } from "@/components/custom/MobileNav";

// We can extract this to its own component if it grows
function DesktopSidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r">
        <div className="p-4 border-b">
            <Logo />
        </div>
        {/* Navigation for Desktop */}
        <div className="flex-1">
          {/* This content is now in MobileNav for mobile */}
        </div>
    </aside>
  );
}


export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const session = await getSession();
    const user = mockUsers.find(u => u.id === session?.userId);
    
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex h-16 items-center justify-between md:justify-end border-b bg-card px-4 md:px-6 sticky top-0 z-30">
            <div className="md:hidden">
              <Logo />
            </div>
            {user && <UserProfileDropdown user={user} />}
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 md:pb-8">
            {children}
        </main>
      </div>
       <MobileNav />
    </div>
  );
}
