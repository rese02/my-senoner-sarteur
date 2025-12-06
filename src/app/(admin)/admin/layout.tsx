import { AdminSidebar } from "./_components/AdminSidebar";
import { AdminMobileNav } from "./_components/AdminMobileNav";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth.actions";
import { LogOut } from "lucide-react";
import { getSession } from "@/lib/session";
import { redirect } from 'next/navigation';


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  if (session.role !== 'admin') {
    // This is a safety net. The middleware should already handle this.
    const homePage = session.role === 'employee' ? '/employee/scanner' : '/dashboard';
    redirect(homePage);
  }


  return (
    <div className="flex h-[100dvh] bg-secondary overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
         <header className="flex-none h-20 flex items-center justify-between md:justify-end border-b bg-card text-card-foreground px-4 md:px-6 sticky top-0 z-20">
            <div className="md:hidden h-8">
              <Logo />
            </div>
             <form action={logout}>
              <Button variant="ghost" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </form>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 bg-secondary">
            {children}
        </main>
      </div>
       <AdminMobileNav />
    </div>
  );
}
