import Link from "next/link";
import { StorePageHero, SectionWrapper } from "@/components/storefront";
import { OrderCard } from "@/components/storefront/orders";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ROUTES } from "@/constants/routes";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { listOrdersForClerkUser } from "@/lib/orders/order-service";

export default async function OrdersPage() {
  const session = await requireAuthenticatedUser(ROUTES.storefront.orders);
  const orders = await listOrdersForClerkUser(session.userId);

  return (
    <>
      <StorePageHero
        breadcrumbs={[
          { label: "Home", href: ROUTES.storefront.home },
          { label: "Orders" },
        ]}
        description="Track your purchases, review order details, and keep an eye on delivery progress."
        eyebrow="My orders"
        title="Order history"
      />
      <SectionWrapper>
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
      </SectionWrapper>
    </>
  );
}
