import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";

export default async function AccountPage() {
  return (
    <div className="space-y-6">
      <Card className="space-y-4 p-6 sm:p-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Account center
          </p>
          <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.06em]">
            Manage your account
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Keep your profile current, manage saved addresses, review past orders,
            and revisit products you saved for later.
          </p>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="space-y-4 p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Personal details
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
              Profile
            </h2>
          </div>
          <p className="text-sm leading-7 text-muted-foreground">
            Update your storefront profile details, phone number, and avatar.
          </p>
          <Link href={ROUTES.storefront.accountProfile}>
            <Button>Open profile</Button>
          </Link>
        </Card>

        <Card className="space-y-4 p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Saved products
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
              Wishlist
            </h2>
          </div>
          <p className="text-sm leading-7 text-muted-foreground">
            Review saved pieces and move them into your cart when you are ready.
          </p>
          <Link href={ROUTES.storefront.accountWishlist}>
            <Button variant="outline">Open wishlist</Button>
          </Link>
        </Card>

        <Card className="space-y-4 p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Delivery details
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
              Addresses
            </h2>
          </div>
          <p className="text-sm leading-7 text-muted-foreground">
            Save delivery addresses so checkout can reuse them quickly.
          </p>
          <Link href={ROUTES.storefront.accountAddresses}>
            <Button variant="outline">Manage addresses</Button>
          </Link>
        </Card>

        <Card className="space-y-4 p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Purchase history
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
              Orders
            </h2>
          </div>
          <p className="text-sm leading-7 text-muted-foreground">
            Track deliveries, review past purchases, and open detailed order summaries.
          </p>
          <Link href={ROUTES.storefront.accountOrders}>
            <Button variant="outline">View orders</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
