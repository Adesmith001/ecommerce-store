import type { ReactNode } from "react";
import { AdminHeader } from "@/components/layout/admin-header";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { requireAdminUser } from "@/lib/auth/guards";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  await requireAdminUser();

  return (
    <div className="app-shell grid min-h-screen gap-4 py-4 sm:gap-6 sm:py-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <AdminSidebar />
      <div className="min-w-0 space-y-4 sm:space-y-6">
        <AdminHeader />
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
