import Link from "next/link";
import { Container } from "@/components/ui/container";
import { APP_NAME } from "@/constants/app";
import {
  FOOTER_LINK_GROUPS,
  SOCIAL_PLACEHOLDERS,
  STORE_TAGLINE,
} from "@/constants/storefront";

export function StorefrontFooter() {
  return (
    <footer className="section-space pb-8">
      <Container className="space-y-6">
        <div className="editorial-panel overflow-hidden px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-[1.35rem] bg-foreground text-sm font-semibold text-white">
                  AS
                </span>
                <div>
                  <p className="font-display text-lg font-semibold tracking-[-0.05em]">
                    {APP_NAME}
                  </p>
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    {STORE_TAGLINE}
                  </p>
                </div>
              </div>

              <p className="max-w-md text-sm leading-7 text-muted-foreground">
                Designed like a polished editorial storefront: product-first, softly
                layered, and ready to scale across catalog, checkout, wishlist, and
                customer account flows.
              </p>

              <div className="flex flex-wrap gap-2">
                {SOCIAL_PLACEHOLDERS.map((social) => (
                  <Link key={social.label} className="chip-link" href={social.href}>
                    {social.label}
                  </Link>
                ))}
              </div>
            </div>

            {FOOTER_LINK_GROUPS.map((group) => (
              <div key={group.title} className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  {group.title}
                </p>
                <div className="grid gap-3">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      className="text-sm font-medium text-foreground/80 hover:text-foreground"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 px-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {APP_NAME}. Crafted for elegant everyday commerce.</p>
          <p>Secure payments, thoughtful support, and a calmer shopping flow.</p>
        </div>
      </Container>
    </footer>
  );
}
