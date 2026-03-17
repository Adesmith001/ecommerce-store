import Link from "next/link";
import { OrderCard } from "@/components/storefront/orders";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ROUTES } from "@/constants/routes";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { listOrdersForClerkUser } from "@/lib/orders/order-service";

export default async function AccountOrdersPage() {
  const session = await requireAuthenticatedUser(ROUTES.storefront.accountOrders);
  const orders = await listOrdersForClerkUser(session.userId);

  return (
    <div className="space-y-6">
      <Card className="space-y-3 p-6">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
          Account
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-[-0.06em]">
          Orders
        </h1>
      </Card>

      {orders.length === 0 ? (
        <EmptyState
          action={
            <Link href={ROUTES.storefront.shop}>
              <Button>Start shopping</Button>
            </Link>
          }
          description="Once you complete a purchase, your orders will appear here for tracking and quick reference."
          title="No orders yet"
        />
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
