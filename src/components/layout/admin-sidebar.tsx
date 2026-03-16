import Link from "next/link";
import { ADMIN_NAV_LINKS } from "@/constants/routes";
import { Badge } from "@/components/ui/badge";

export function AdminSidebar() {
  return (
    <aside className="card-shell h-fit p-6">
      <Badge variant="primary">Admin Panel</Badge>
      <nav className="mt-6 flex flex-col gap-2">
        {ADMIN_NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            className="rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-surface hover:text-foreground"
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
