import Link from "next/link";
import { APP_NAME } from "@/constants/app";
import { STOREFRONT_NAV_LINKS } from "@/constants/routes";
import { Badge } from "@/components/ui/badge";
import { Container } from "@/components/ui/container";

export function StorefrontHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-white/85 backdrop-blur">
      <Container className="flex items-center justify-between gap-6 py-4">
        <Link className="flex items-center gap-3 text-lg font-semibold tracking-tight" href="/">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground">
            AS
          </span>
          <span>{APP_NAME}</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {STOREFRONT_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              className="font-medium hover:text-foreground"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}
          <Badge variant="secondary">Single Vendor</Badge>
        </nav>
      </Container>
    </header>
  );
}
