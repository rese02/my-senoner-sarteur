import { AdminSidebar } from "./_components/AdminSidebar";
import { AdminMobileNav } from "./_components/AdminMobileNav";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth.actions";
import { LogOut, Menu } from "lucide-react";


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-secondary">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
         <header className="flex h-16 items-center justify-between md:justify-end border-b bg-primary text-primary-foreground md:bg-card md:text-card-foreground px-4 md:px-6 sticky top-0 z-20">
            <div className="md:hidden h-8">
              <Logo />
            </div>
             <form action={logout}>
              <Button variant="ghost" size="sm" className="text-primary-foreground md:text-card-foreground hover:bg-primary-foreground/10 md:hover:bg-accent">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </form>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 md:pb-8">
            {children}
        </main>
      </div>
       <AdminMobileNav />
    </div>
  );
}

    