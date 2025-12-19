
'use server'; // Make this a full Server Component

import { AdminSidebar } from "./_components/AdminSidebar";
import { AdminMobileNav } from "./_components/AdminMobileNav";
import { getSession } from "@/lib/session";
import { redirect } from 'next/navigation';
import { UserProfileDropdown } from "@/components/custom/UserProfileDropdown";
import type { User } from "@/lib/types";
import { AppFooter } from "@/components/common/AppFooter";
import { FirebaseClientProvider } from "@/firebase/client-provider"; 
import { Toaster } from "@/components/ui/toaster";


// This layout is now a Server Component, which is faster and more secure.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Primary security check on the server.
  // If no session, or the user is not an admin, redirect immediately.
  // This happens before any child pages (like the dashboard) are rendered.
  if (!session || session.role !== 'admin') {
    const callbackUrl = '/admin/dashboard'; // Default admin callback
    redirect(`/login?callbackUrl=${callbackUrl}`);
  }

  return (
    <FirebaseClientProvider>
      <div className="flex h-dvh bg-secondary/50 text-foreground">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex-none h-16 flex items-center justify-between md:justify-end border-b bg-card px-4 md:px-6 sticky top-0 z-20">
              <div className="md:hidden font-bold font-headline text-lg text-primary">
                  Admin
              </div>
              <UserProfileDropdown user={session as User} />
          </header>
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 md:pb-8 bg-background">
              {children}
              <AppFooter />
          </main>
          <AdminMobileNav />
        </div>
      </div>
      <Toaster />
    </FirebaseClientProvider>
  );
}
