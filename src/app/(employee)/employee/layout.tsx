import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import { logout } from "@/app/actions/auth.actions";
import { LogOut } from "lucide-react";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between p-4 border-b bg-card">
        <Logo />
        <form action={logout}>
          <Button variant="ghost" size="sm">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </form>
      </header>
      <main className="flex-1 flex items-center justify-center bg-secondary/50 p-4">
        {children}
      </main>
    </div>
  );
}
