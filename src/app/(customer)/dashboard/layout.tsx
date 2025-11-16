import { CustomerSidebar } from "./_components/CustomerSidebar";
import { getSession } from "@/lib/session";
import { mockUsers } from "@/lib/mock-data";
import { UserProfileDropdown } from "@/components/custom/UserProfileDropdown";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Logo } from "@/components/common/Logo";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const session = await getSession();
    const user = mockUsers.find(u => u.id === session?.userId);
    
  return (
    <div className="flex min-h-screen bg-secondary/50">
      <CustomerSidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6 sticky top-0 z-10">
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col p-0">
                  <div className="p-4 border-b">
                    <Logo />
                  </div>
                  {/* We can pass the user to a mobile-specific sidebar if needed */}
                  <CustomerSidebar isMobile={true} user={user}/>
                </SheetContent>
              </Sheet>
            </div>
             <div className="hidden md:block">
                {/* Placeholder for potential header content on desktop */}
            </div>
            {user && <UserProfileDropdown user={user} />}
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
        </main>
      </div>
    </div>
  );
}
