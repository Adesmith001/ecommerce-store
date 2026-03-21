"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ADMIN_NAV_LINKS, ROUTES } from "@/constants/routes";

const ADMIN_PAGE_META: Record<string, { eyebrow: string; title: string }> = {
  [ROUTES.admin.dashboard]: {
    eyebrow: "Overview",
    title: "Dashboard",
  },
  [ROUTES.admin.analytics]: {
    eyebrow: "Analytics",
    title: "Reporting overview",
  },
  [ROUTES.admin.orders]: {
    eyebrow: "Orders",
    title: "Order operations",
  },
  [ROUTES.admin.products]: {
    eyebrow: "Products",
    title: "Catalog operations",
  },
  [ROUTES.admin.inventory]: {
    eyebrow: "Inventory",
    title: "Stock operations",
  },
  [ROUTES.admin.shipping]: {
    eyebrow: "Shipping",
    title: "Delivery settings",
  },
  [ROUTES.admin.settings]: {
    eyebrow: "Settings",
    title: "Store configuration",
  },
  [ROUTES.admin.notifications]: {
    eyebrow: "Notifications",
    title: "Operational alerts",
  },
  [ROUTES.admin.coupons]: {
    eyebrow: "Coupons",
    title: "Promotion management",
  },
  [ROUTES.admin.categories]: {
    eyebrow: "Categories",
    title: "Category management",
  },
  [ROUTES.admin.brands]: {
    eyebrow: "Brands",
    title: "Brand management",
  },
  [ROUTES.admin.banners]: {
    eyebrow: "Banners",
    title: "Campaign management",
  },
  [ROUTES.admin.customers]: {
    eyebrow: "Customers",
    title: "Customer workspace",
  },
};

export function AdminHeader() {
  const pathname = usePathname();
  const pageMeta =
    Object.entries(ADMIN_PAGE_META).find(([route]) =>
      route === ROUTES.admin.dashboard
        ? pathname === route
        : pathname === route || pathname.startsWith(`${route}/`),
    )?.[1] ?? ADMIN_PAGE_META[ROUTES.admin.dashboard];

  return (
    <header className="space-y-4">
      <div className="admin-panel flex flex-col gap-5 px-5 py-5 sm:px-7 sm:py-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-3">
          <Badge variant="outline">{pageMeta.eyebrow}</Badge>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Admin workspace
            </p>
            <h1 className="font-display mt-2 text-3xl font-bold uppercase tracking-[-0.08em] sm:text-4xl">
              {pageMeta.title}
            </h1>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            className={buttonVariants({ className: "w-full md:w-auto", variant: "outline" })}
            href={ROUTES.storefront.home}
          >
            View storefront
          </Link>
        </div>
      </div>

      <div className="admin-panel -mx-1 flex gap-2 overflow-x-auto p-3 lg:hidden">
        {ADMIN_NAV_LINKS.map((link) => {
          const active =
            link.href === "/admin"
              ? pathname === link.href
              : pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <Link
              key={link.href}
              className={
                active
                  ? "whitespace-nowrap rounded-full bg-foreground px-4 py-2 text-sm font-medium text-white"
                  : "whitespace-nowrap rounded-full border border-border bg-white/70 px-4 py-2 text-sm font-medium text-muted-foreground"
              }
              href={link.href}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
