import { AdminSidebar } from "./_components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1">
        <main className="p-4 sm:p-6 lg:p-8">
            {children}
        </main>
      </div>
    </div>
  );
}
