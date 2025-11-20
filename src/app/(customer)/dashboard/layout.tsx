
import { getSession } from "@/lib/session";
import { mockUsers } from "@/lib/mock-data";
import { UserProfileDropdown } from "@/components/custom/UserProfileDropdown";
import { Logo } from "@/components/common/Logo";
import { MobileNav } from "@/components/custom/MobileNav";
import { CustomerSidebar } from "./_components/CustomerSidebar";

function DesktopSidebar() {
  return (
    <aside className="hidden md:flex flex-col w-60 bg-primary border-r border-primary-foreground/10">
        <div className="p-4 border-b border-primary-foreground/10 h-20 flex items-center justify-center">
            <Logo />
        </div>
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
    const user = mockUsers.find(u => u.id === session?.userId);
    
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DesktopSidebar />
      <div className="flex-1 flex flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-primary text-primary-foreground px-4 sticky top-0 z-30 md:hidden">
            <div className="h-8">
              <Logo />
            </div>
            <div className="md:hidden">
                 {user && <UserProfileDropdown user={user} />}
            </div>
            <div className="hidden md:flex-1 md:flex md:justify-end">
              {user && <UserProfileDropdown user={user} />}
            </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-background pb-24 md:pb-8">
            {children}
        </main>
      </div>
       <MobileNav />
    </div>
  );
}
