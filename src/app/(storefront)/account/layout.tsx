import type { ReactNode } from "react";
import { AccountSidebar } from "@/components/account";
import { Container } from "@/components/ui/container";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { ROUTES } from "@/constants/routes";

type AccountLayoutProps = {
  children: ReactNode;
};

export default async function AccountLayout({ children }: AccountLayoutProps) {
  await requireAuthenticatedUser(ROUTES.storefront.account);

  return (
    <section className="section-space">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <AccountSidebar />
          <main>{children}</main>
        </div>
      </Container>
    </section>
  );
}
