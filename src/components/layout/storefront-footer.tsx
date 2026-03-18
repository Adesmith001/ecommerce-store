import Link from "next/link";
import { Container } from "@/components/ui/container";
import { FOOTER_LINK_GROUPS } from "@/constants/storefront";
import type { StoreSettings } from "@/types/store-settings";

type StorefrontFooterProps = {
  settings: StoreSettings;
};

export function StorefrontFooter({ settings }: StorefrontFooterProps) {
  const socialLinks = [
    { href: settings.instagramUrl, label: "Instagram" },
    { href: settings.tiktokUrl, label: "TikTok" },
    { href: settings.pinterestUrl, label: "Pinterest" },
  ].filter((social) => social.href.trim());

  return (
    <footer className="section-space pb-8">
      <Container className="space-y-6">
        <div className="editorial-panel overflow-hidden px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                {settings.logo?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={settings.logo.alt || settings.storeName}
                    className="h-11 w-11 rounded-[1.35rem] object-cover"
                    src={settings.logo.url}
                  />
                ) : (
                  <span className="flex h-11 w-11 items-center justify-center rounded-[1.35rem] bg-foreground text-sm font-semibold text-white">
                    {settings.storeName.slice(0, 2).toUpperCase()}
                  </span>
                )}
                <div>
                  <p className="font-display text-lg font-semibold tracking-[-0.05em]">
                    {settings.storeName}
                  </p>
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    {settings.tagline}
                  </p>
                </div>
              </div>

              <p className="max-w-md text-sm leading-7 text-muted-foreground">
                {settings.supportText}
              </p>

              <div className="flex flex-wrap gap-2">
                {socialLinks.map((social) => (
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
          <p>&copy; 2026 {settings.storeName}. Crafted for elegant everyday commerce.</p>
          <p>
            {settings.contactEmail} · {settings.phoneNumber}
          </p>
        </div>
      </Container>
    </footer>
  );
}
