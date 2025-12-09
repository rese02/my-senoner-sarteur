'use client';

import { AdminSidebar } from "./_components/AdminSidebar";
import { AdminMobileNav } from "./_components/AdminMobileNav";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth.actions";
import { LogOut } from "lucide-react";
import type { User } from "@/lib/types";
import { useSession } from "@/hooks/use-session";
import { redirect } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";


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
      return (
        <div className="flex h-screen w-screen items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
      );
  }


  return (
    <div className="flex h-[100dvh] bg-background text-foreground overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
         <header className="flex-none h-16 flex items-center justify-between md:justify-end border-b bg-primary text-primary-foreground px-4 md:px-6 sticky top-0 z-20">
            <div className="md:hidden h-8">
              <Link href="/" className="flex items-center h-full">
                <Image src="/logo.png" alt="Senoner Sarteur Logo" width={120} height={24} className="object-contain h-full w-auto" />
              </Link>
            </div>
             <form action={logout}>
              <Button variant="ghost" size="sm" className="hover:bg-primary-foreground/10 text-primary-foreground">
                <LogOut className="mr-2 h-4 w-4" />
                Abmelden
              </Button>
            </form>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 md:pb-8 bg-secondary md:bg-background">
            {children}
        </main>
      </div>
       <AdminMobileNav />
    </div>
  );
}
