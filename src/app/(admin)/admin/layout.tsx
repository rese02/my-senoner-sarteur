'use client';

import { AdminSidebar } from "./_components/AdminSidebar";
import { useSession } from "@/hooks/use-session";
import { redirect } from 'next/navigation';
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";


function AdminLoadingSkeleton() {
    return (
        <div className="flex h-screen w-screen bg-background">
            {/* Sidebar Skeleton */}
            <div className="hidden md:flex flex-col w-64 border-r">
                <div className="p-4 h-16 flex items-center justify-center bg-primary">
                    <Skeleton className="h-8 w-36" />
                </div>
                <div className="flex-1 p-4 space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                    ))}
                </div>
                 <div className="p-4 mt-auto">
                    <Skeleton className="h-10 w-full" />
                 </div>
            </div>
            <div className="flex-1 flex flex-col">
                {/* Header Skeleton */}
                <header className="flex-none h-16 flex items-center justify-between md:justify-end border-b bg-card px-4 md:px-6 sticky top-0 z-20">
                    <div className="md:hidden">
                        <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                </header>
                {/* Main Content Skeleton */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                     <div className="space-y-2 mb-8">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-5 w-72" />
                    </div>
                    <Skeleton className="h-[400px] w-full rounded-lg" />
                </main>
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
  

  // SICHERHEITS-CHECK: Nur Admins dürfen hier rein.
  if (!loading && session && session.role !== 'admin') {
    // Falls ein Kunde/Mitarbeiter hier landet, leite ihn zu seiner Startseite.
    const homePage = session.role === 'employee' ? '/employee/scanner' : '/dashboard';
    redirect(homePage);
  }

  if (loading || !session) {
      return <AdminLoadingSkeleton />;
  }


  return (
    <div className="flex h-[100dvh] bg-secondary text-foreground overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-8 bg-background">
            {children}
        </main>
      </div>
    </div>
  );
}
