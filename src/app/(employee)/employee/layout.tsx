
'use server'; // Make this a full Server Component

import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth.actions";
import { LogOut } from "lucide-react";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AppFooter } from "@/components/common/AppFooter";
import { FirebaseClientProvider } from "@/firebase/client-provider"; 

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Primary security check on the server.
  if (!session) {
    redirect('/login?callbackUrl=/employee/scanner');
    return null;
  }
  
  // Role check: Only employees and admins can access this area.
  if (!['employee', 'admin'].includes(session.role)) {
    redirect('/dashboard'); // Redirect other roles to their default page
    return null;
  }

  return (
    <FirebaseClientProvider>
      <div className="flex flex-col min-h-screen bg-background">
        <header className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground">
          <div className="h-8">
              <Logo />
          </div>
          <form action={logout}>
            <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
              {children}
          </div>
        </main>
        <AppFooter />
      </div>
    </FirebaseClientProvider>
  );
}
