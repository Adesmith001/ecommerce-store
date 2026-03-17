import Link from "next/link";
import { StorePageHero, SectionWrapper } from "@/components/storefront";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { requireAuthenticatedUser } from "@/lib/auth/guards";

export default async function AccountPage() {
  await requireAuthenticatedUser(ROUTES.storefront.account);

  return (
    <>
      <StorePageHero
        breadcrumbs={[
          { label: "Home", href: ROUTES.storefront.home },
          { label: "Account" },
        ]}
        description="Quick access to your saved products and your recent orders."
        eyebrow="Account"
        title="Your account"
      />
      <SectionWrapper>
        <div className="grid gap-5 md:grid-cols-2">
          <Card className="space-y-4 p-6">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Saved products
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Wishlist
              </h2>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Review products you saved and move them into your cart when you are
              ready.
            </p>
            <Link href={ROUTES.storefront.wishlist}>
              <Button>Open wishlist</Button>
            </Link>
          </Card>

          <Card className="space-y-4 p-6">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Purchase history
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                Orders
              </h2>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              Track deliveries, review past purchases, and open detailed order
              summaries.
            </p>
            <Link href={ROUTES.storefront.orders}>
              <Button variant="outline">View orders</Button>
            </Link>
          </Card>
        </div>
      </SectionWrapper>
    </>
  );
}
