import Link from "next/link";
import { APP_NAME } from "@/constants/app";
import { STOREFRONT_NAV_LINKS } from "@/constants/routes";

export function StorefrontHeader() {
  return (
    <header className="border-b border-border bg-card/80 backdrop-blur">
      <div className="app-shell flex items-center justify-between gap-6 py-4">
        <Link className="text-lg font-semibold tracking-tight" href="/">
          {APP_NAME}
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {STOREFRONT_NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
