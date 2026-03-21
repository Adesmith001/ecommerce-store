"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ADMIN_NAV_LINKS } from "@/constants/routes";
import { cn } from "@/helpers/cn";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="admin-panel sticky top-6 hidden h-fit p-6 lg:block">
      <Badge variant="secondary">Admin panel</Badge>
      <div className="mt-5 space-y-2">
        <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          Back office
        </p>
        <h2 className="font-display text-4xl font-bold uppercase tracking-[-0.08em]">
          Operations
        </h2>
      </div>
      <nav className="mt-6 flex flex-col gap-2">
        {ADMIN_NAV_LINKS.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === link.href
              : pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              className={cn(
                "rounded-[1rem] px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-foreground text-white shadow-[0_16px_34px_rgba(20,21,26,0.12)]"
                  : "border border-border bg-white/60 text-muted-foreground hover:bg-white hover:text-foreground",
              )}
              href={link.href}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
