import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";

export default async function AccountPage() {
  return (
    <div className="space-y-6">
      <Card className="space-y-4 p-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Account center
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Manage your account
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Keep your profile up to date, manage saved addresses, review your
            orders, and revisit products you saved for later.
          </p>
        </div>
      </Card>

      <div className="grid gap-5 md:grid-cols-2">
        <Card className="space-y-4 p-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Personal details
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Profile
            </h2>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            Update your storefront profile information, phone number, and avatar.
          </p>
          <Link href={ROUTES.storefront.accountProfile}>
            <Button>Open profile</Button>
          </Link>
        </Card>

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
            Review saved products and move them into your cart when you are ready.
          </p>
          <Link href={ROUTES.storefront.accountWishlist}>
            <Button variant="outline">Open wishlist</Button>
          </Link>
        </Card>

        <Card className="space-y-4 p-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Delivery details
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Addresses
            </h2>
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            Save delivery addresses so future checkout flows can reuse them quickly.
          </p>
          <Link href={ROUTES.storefront.accountAddresses}>
            <Button variant="outline">Manage addresses</Button>
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
