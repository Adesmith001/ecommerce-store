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
    <div className="admin-workspace grid min-h-screen gap-6 lg:grid-cols-[270px_minmax(0,1fr)] lg:items-start">
      <AdminSidebar />
      <div className="min-w-0 space-y-6">
        <AdminHeader />
        <main className="min-w-0">
          <div className="mx-auto w-full max-w-280">{children}</div>
        </main>
      </div>
    </div>
  );
}
