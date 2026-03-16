import Link from "next/link";
import { ADMIN_NAV_LINKS } from "@/constants/routes";

export function AdminSidebar() {
  return (
    <aside className="surface h-fit p-6">
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
        Admin
      </p>
      <nav className="mt-6 flex flex-col gap-2">
        {ADMIN_NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            className="rounded-2xl px-4 py-3 text-sm font-medium hover:bg-muted"
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
