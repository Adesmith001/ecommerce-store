import Link from "next/link";
import { APP_NAME } from "@/constants/app";
import {
  FOOTER_LINK_GROUPS,
  SOCIAL_PLACEHOLDERS,
  STORE_TAGLINE,
} from "@/constants/storefront";
import { Container } from "@/components/ui/container";

export function StorefrontFooter() {
  return (
    <footer className="mt-12 border-t border-border bg-white">
      <Container className="grid gap-10 py-12 lg:grid-cols-[1.3fr_0.9fr_0.8fr]">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-semibold text-primary-foreground">
              AS
            </span>
            <div>
              <p className="text-lg font-semibold">{APP_NAME}</p>
              <p className="text-sm text-muted-foreground">{STORE_TAGLINE}</p>
            </div>
          </div>
          <p className="max-w-md text-sm leading-6 text-muted-foreground">
            A polished single-vendor storefront foundation built for product discovery,
            conversion-focused merchandising, and future ecommerce workflows.
          </p>
          <div className="flex flex-wrap gap-3">
            {SOCIAL_PLACEHOLDERS.map((social) => (
              <Link
                key={social.label}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                href={social.href}
              >
                {social.label}
              </Link>
            ))}
          </div>
        </div>

        {FOOTER_LINK_GROUPS.map((group) => (
          <div key={group.title} className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground">
              {group.title}
            </p>
            <div className="flex flex-col gap-3">
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                  href={link.href}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </Container>

      <Container className="border-t border-border py-5 text-sm text-muted-foreground">
        © 2026 {APP_NAME}. Storefront skeleton ready for real ecommerce features.
      </Container>
    </footer>
  );
}
