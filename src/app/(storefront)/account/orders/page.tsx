import Link from "next/link";
import { OrderCard } from "@/components/storefront/orders";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ROUTES } from "@/constants/routes";
import { listOrdersForClerkUser } from "@/lib/orders/order-service";
import { requireAuthenticatedUser } from "@/lib/auth/guards";

export default async function AccountOrdersPage() {
  const session = await requireAuthenticatedUser(ROUTES.storefront.accountOrders);
  const orders = await listOrdersForClerkUser(session.userId);

  return (
    <div className="space-y-6">
      <Card className="space-y-3 p-6">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Account
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Orders</h1>
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
