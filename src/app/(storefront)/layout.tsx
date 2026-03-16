import type { ReactNode } from "react";
import { StorefrontFooter } from "@/components/layout/storefront-footer";
import { StorefrontHeader } from "@/components/layout/storefront-header";

type StorefrontLayoutProps = {
  children: ReactNode;
};

export default function StorefrontLayout({
  children,
}: StorefrontLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <StorefrontHeader />
      <main className="flex-1 py-10">{children}</main>
      <StorefrontFooter />
    </div>
  );
}
