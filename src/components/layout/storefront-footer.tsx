import Link from "next/link";
import { Container } from "@/components/ui/container";
import { FOOTER_LINK_GROUPS } from "@/constants/storefront";
import type { StoreSettings } from "@/types/store-settings";

type StorefrontFooterProps = {
  settings: StoreSettings;
};

function BrandMark() {
  return <span aria-hidden="true" className="storefront-brand-mark shrink-0" />;
}

export function StorefrontFooter({ settings }: StorefrontFooterProps) {
  const socialLinks = [
    { href: settings.instagramUrl, label: "Instagram" },
    { href: settings.tiktokUrl, label: "TikTok" },
    { href: settings.pinterestUrl, label: "Pinterest" },
  ].filter((social) => social.href.trim());

  return (
    <footer className="section-space pb-10 pt-16">
      <Container className="space-y-8">
        <div className="grid gap-8 border-t border-border/70 pt-8 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <BrandMark />
              <div>
                <p className="font-display text-4xl font-bold uppercase leading-none tracking-[-0.08em]">
                  {settings.storeName}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  {settings.tagline}
                </p>
              </div>
            </div>

            <p className="max-w-xl text-sm leading-7 text-muted-foreground">
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
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
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

        <div className="flex flex-col gap-3 border-t border-border/70 pt-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 {settings.storeName}. Built for editorial commerce.</p>
          <p>
            {settings.contactEmail} · {settings.phoneNumber}
          </p>
        </div>
      </Container>
    </footer>
  );
}
