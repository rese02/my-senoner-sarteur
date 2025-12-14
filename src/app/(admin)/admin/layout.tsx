
'use client';

import { AdminSidebar } from "./_components/AdminSidebar";
import { AdminMobileNav } from "./_components/AdminMobileNav";
import { useSession } from "@/hooks/use-session";
import { redirect, usePathname } from 'next/navigation';
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { UserProfileDropdown } from "@/components/custom/UserProfileDropdown";
import type { User } from "@/lib/types";
import { PageHeader } from "@/components/common/PageHeader";

function AdminLoadingSkeleton() {
    return (
        <div className="flex h-screen w-screen bg-background">
            {/* Sidebar Skeleton */}
            <div className="hidden md:flex flex-col w-64 border-r bg-card">
                <div className="p-4 h-16 flex items-center justify-center border-b">
                    <Skeleton className="h-8 w-36" />
                </div>
                <div className="flex-1 p-4 space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                    ))}
                </div>
                 <div className="p-4 mt-auto border-t">
                    <Skeleton className="h-10 w-full" />
                 </div>
            </div>
            <div className="flex-1 flex flex-col">
                {/* Header Skeleton */}
                <header className="flex-none h-16 flex items-center justify-between md:justify-end border-b bg-card px-4 md:px-6 sticky top-0 z-20">
                    <div className="md:hidden">
                       <Skeleton className="h-8 w-24" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full" />
                </header>
                {/* Main Content Skeleton */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                     <div className="space-y-2 mb-8">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-5 w-72" />
                    </div>
                    {/* Stat Cards Skeleton */}
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-6">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                    <Skeleton className="h-[400px] w-full rounded-lg" />
                </main>
                 {/* Mobile Nav Skeleton */}
                <div className="h-16 border-t bg-card md:hidden p-2 flex justify-around">
                     {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center justify-center gap-1 w-1/5">
                            <Skeleton className="h-6 w-6 rounded-md"/>
                            <Skeleton className="h-3 w-10"/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, loading } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !session) {
      redirect(`/login?callbackUrl=${pathname}`);
    }
  }, [session, loading, pathname]);
  

  if (loading) {
      return <AdminLoadingSkeleton />;
  }
  
  // SICHERHEITS-CHECK: Nur Admins dürfen hier rein.
  // Führen Sie die Umleitung durch, wenn die Daten geladen wurden und der Benutzer kein Admin ist.
  if (!loading && session && session.role !== 'admin') {
    const homePage = session.role === 'employee' ? '/employee/scanner' : '/dashboard';
    redirect(homePage);
    return null; // Geben Sie null zurück, während die Umleitung stattfindet
  }

  // Fallback, wenn die Session noch nicht geladen ist, aber nicht mehr "loading" ist
  if (!session) {
    return <AdminLoadingSkeleton />;
  }


  return (
    <div className="flex h-dvh bg-secondary/50 text-foreground">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
         <header className="flex-none h-16 flex items-center justify-between md:justify-end border-b bg-card px-4 md:px-6 sticky top-0 z-20">
             <div className="md:hidden font-bold font-headline text-lg text-foreground">
                 Admin
             </div>
             {session && <UserProfileDropdown user={session as User} />}
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 md:pb-8 bg-background rounded-tl-2xl">
            {children}
        </main>
        <AdminMobileNav />
      </div>
    </div>
  );
}
