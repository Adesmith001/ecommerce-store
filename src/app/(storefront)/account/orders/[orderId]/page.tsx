import Link from "next/link";
import { notFound } from "next/navigation";
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

type AccountOrderDetailPageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function AccountOrderDetailPage({
  params,
}: AccountOrderDetailPageProps) {
  const { orderId } = await params;
  const session = await requireAuthenticatedUser(ROUTES.storefront.accountOrder(orderId));
  const order = await getOrderForClerkUser({
    clerkId: session.userId,
    orderId,
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-6 p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Order details
            </p>
            <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.06em]">
              {order.orderNumber}
            </h1>
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
          <div className="rounded-[1.35rem] border border-white/80 bg-white/72 p-4">
            <p className="text-muted-foreground">Total amount</p>
            <p className="mt-1 font-medium">
              {formatOrderCurrency(order.pricing.estimatedTotal, order.currency)}
            </p>
          </div>
          <div className="rounded-[1.35rem] border border-white/80 bg-white/72 p-4">
            <p className="text-muted-foreground">Payment reference</p>
            <p className="mt-1 font-medium">{order.paymentReference}</p>
          </div>
          <div className="rounded-[1.35rem] border border-white/80 bg-white/72 p-4">
            <p className="text-muted-foreground">Delivery method</p>
            <p className="mt-1 font-medium capitalize">
              {order.deliveryMethod.replace("-", " ")}
            </p>
          </div>
          <div className="rounded-[1.35rem] border border-white/80 bg-white/72 p-4">
            <p className="text-muted-foreground">Items ordered</p>
            <p className="mt-1 font-medium">{order.pricing.totalQuantity}</p>
          </div>
        </div>

        <Link href={ROUTES.storefront.accountOrders}>
          <Button variant="outline">Back to orders</Button>
        </Link>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <OrderStatusTimeline order={order} />
          <OrderItemsList order={order} />
        </div>
        <div className="space-y-6">
          <Card className="space-y-5 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
                Totals
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
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
              {order.pricing.discountAmount > 0 ? (
                <div className="flex items-center justify-between gap-3 text-success">
                  <span>
                    Discount{order.pricing.couponCode ? ` (${order.pricing.couponCode})` : ""}
                  </span>
                  <span className="font-medium">
                    -{formatOrderCurrency(order.pricing.discountAmount, order.currency)}
                  </span>
                </div>
              ) : null}
              <div className="flex items-center justify-between gap-3 rounded-[1.35rem] border border-white/80 bg-white/72 px-4 py-4">
                <span className="text-muted-foreground">Total amount</span>
                <span className="font-display text-2xl font-semibold tracking-[-0.05em]">
                  {formatOrderCurrency(order.pricing.estimatedTotal, order.currency)}
                </span>
              </div>
            </div>
          </Card>

          <OrderAddressCard order={order} />
        </div>
      </div>
    </div>
  );
}
