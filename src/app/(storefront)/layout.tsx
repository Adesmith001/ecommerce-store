import type { ReactNode } from "react";
import { StorefrontFooter } from "@/components/layout/storefront-footer";
import { StorefrontHeader } from "@/components/layout/storefront-header";
import { getStoreSettings } from "@/lib/settings/store-settings-service";

type StorefrontLayoutProps = {
  children: ReactNode;
};

export default async function StorefrontLayout({
  children,
}: StorefrontLayoutProps) {
  const settings = await getStoreSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <StorefrontHeader
        announcementText={settings.announcementBarText}
        logoAlt={settings.logo?.alt}
        logoUrl={settings.logo?.url}
        storeName={settings.storeName}
        tagline={settings.tagline}
        topbarDetail={settings.contactEmail}
      />
      <main className="flex-1">{children}</main>
      <StorefrontFooter settings={settings} />
    </div>
  );
}
