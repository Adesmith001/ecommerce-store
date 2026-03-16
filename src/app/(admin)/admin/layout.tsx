import type { ReactNode } from "react";
import { AdminHeader } from "@/components/layout/admin-header";
import { AdminSidebar } from "@/components/layout/admin-sidebar";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="app-shell grid min-h-screen gap-6 py-6 lg:grid-cols-[260px_minmax(0,1fr)]">
      <AdminSidebar />
      <div className="space-y-6">
        <AdminHeader />
        <main>{children}</main>
      </div>
    </div>
  );
}
