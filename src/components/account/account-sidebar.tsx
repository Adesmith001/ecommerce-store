"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ACCOUNT_NAV_LINKS } from "@/constants/routes";
import { Card } from "@/components/ui/card";
import { cn } from "@/helpers/cn";

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <Card className="p-4">
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
                "rounded-2xl px-4 py-3 text-sm font-medium transition",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-surface hover:text-foreground",
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
