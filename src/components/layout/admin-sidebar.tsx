"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { ADMIN_NAV_LINKS } from "@/constants/routes";
import { cn } from "@/helpers/cn";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="card-shell hidden h-fit p-6 lg:block">
      <Badge variant="primary">Admin panel</Badge>
      <div className="mt-5 space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          Back office
        </p>
        <h2 className="font-display text-3xl font-semibold tracking-[-0.05em]">
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
                "rounded-[1.4rem] px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-foreground text-white shadow-[0_16px_34px_rgba(20,21,26,0.16)]"
                  : "border border-white/80 bg-white/60 text-muted-foreground hover:bg-white hover:text-foreground",
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
