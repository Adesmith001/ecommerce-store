"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";
import { ACCOUNT_NAV_LINKS } from "@/constants/routes";
import { cn } from "@/helpers/cn";

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <Card className="space-y-5 p-4">
      <div className="rounded-[1.7rem] border border-white/80 bg-white/72 p-5">
        <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
          Account center
        </p>
        <h2 className="font-display mt-3 text-2xl font-semibold tracking-[-0.05em]">
          Your profile, orders, and saved pieces
        </h2>
      </div>

      <nav className="flex flex-col gap-2">
        {ACCOUNT_NAV_LINKS.map((link) => {
          const active =
            link.href === "/account"
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
    </Card>
  );
}
