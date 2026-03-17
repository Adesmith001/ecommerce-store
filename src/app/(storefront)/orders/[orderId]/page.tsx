import Link from "next/link";
import { notFound } from "next/navigation";
import { StorePageHero, SectionWrapper } from "@/components/storefront";
import {
  OrderAddressCard,
  OrderItemsList,
  OrderStatusTimeline,
} from "@/components/storefront/orders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import {
  formatOrderCurrency,
  formatOrderDate,
  getOrderStatusLabel,
  getOrderStatusVariant,
  getPaymentStatusLabel,
  getPaymentStatusVariant,
} from "@/lib/orders/order-presentation";
import { getOrderForClerkUser } from "@/lib/orders/order-service";

type OrderDetailPageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderId } = await params;
  const session = await requireAuthenticatedUser(ROUTES.storefront.order(orderId));
  const order = await getOrderForClerkUser({
    clerkId: session.userId,
    orderId,
  });

  if (!order) {
    notFound();
  }

  return (
    <>
      <StorePageHero
        breadcrumbs={[
          { label: "Home", href: ROUTES.storefront.home },
          { label: "Orders", href: ROUTES.storefront.orders },
          { label: order.orderNumber },
        ]}
        description="Review the full order summary, delivery details, and current shipment progress."
        eyebrow="Order details"
        title={order.orderNumber}
        actions={
          <Link href={ROUTES.storefront.orders}>
            <Button variant="outline">Back to orders</Button>
          </Link>
        }
      />
      <SectionWrapper>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <Card className="space-y-6 p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Order summary
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                    {order.orderNumber}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Placed on {formatOrderDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={getPaymentStatusVariant(order.paymentStatus)}>
                    {getPaymentStatusLabel(order.paymentStatus)}
                  </Badge>
                  <Badge variant={getOrderStatusVariant(order.orderStatus)}>
                    {getOrderStatusLabel(order.orderStatus)}
                  </Badge>
                </div>
              </div>

              <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="text-muted-foreground">Total amount</p>
                  <p className="mt-1 font-medium">
                    {formatOrderCurrency(order.pricing.estimatedTotal, order.currency)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Payment reference</p>
                  <p className="mt-1 font-medium">{order.paymentReference}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Delivery method</p>
                  <p className="mt-1 font-medium capitalize">
                    {order.deliveryMethod.replace("-", " ")}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Items ordered</p>
                  <p className="mt-1 font-medium">{order.pricing.totalQuantity}</p>
                </div>
              </div>
            </Card>

            <OrderStatusTimeline order={order} />
            <OrderItemsList order={order} />
          </div>

          <div className="space-y-6">
            <Card className="space-y-5 p-6">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  Totals
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                  Charges
                </h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    {formatOrderCurrency(order.pricing.subtotal, order.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Shipping fee</span>
                  <span className="font-medium">
                    {formatOrderCurrency(order.pricing.shippingFee, order.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Total amount</span>
                  <span className="text-lg font-semibold">
                    {formatOrderCurrency(order.pricing.estimatedTotal, order.currency)}
                  </span>
                </div>
              </div>
            </Card>

            <OrderAddressCard order={order} />
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
