import { CustomerSidebar } from "./_components/CustomerSidebar";
import { getSession } from "@/lib/session";
import { mockUsers } from "@/lib/mock-data";

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const session = await getSession();
    const user = mockUsers.find(u => u.id === session?.userId);
    
  return (
    <div className="flex min-h-screen bg-secondary/50">
      <CustomerSidebar user={user} />
      <div className="flex-1">
        <main className="p-4 sm:p-6 lg:p-8">
            {children}
        </main>
      </div>
    </div>
  );
}
