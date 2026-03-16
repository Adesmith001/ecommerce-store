import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export function AdminHeader() {
  return (
    <header className="surface flex items-center justify-between px-6 py-4">
      <div>
        <p className="text-sm text-muted-foreground">Admin workspace</p>
        <h1 className="text-xl font-semibold">Dashboard</h1>
      </div>
      <Link
        className="rounded-full border border-border px-4 py-2 text-sm font-medium"
        href={ROUTES.storefront.home}
      >
        View storefront
      </Link>
    </header>
  );
}
