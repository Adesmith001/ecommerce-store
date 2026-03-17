import { notFound } from "next/navigation";
import {
  AdminOrderStatusManager,
} from "@/components/admin";
import {
  OrderAddressCard,
  OrderItemsList,
  OrderStatusTimeline,
} from "@/components/storefront/orders";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  getAdminOrderById,
  getAllowedAdminOrderTransitions,
} from "@/lib/admin/admin-order-service";
import {
  formatOrderCurrency,
  formatOrderDate,
  getOrderStatusLabel,
  getOrderStatusVariant,
  getPaymentStatusLabel,
  getPaymentStatusVariant,
} from "@/lib/orders/order-presentation";

type AdminOrderDetailPageProps = {
  params: Promise<{ orderId: string }>;
};

export default async function AdminOrderDetailPage({
  params,
}: AdminOrderDetailPageProps) {
  const { orderId } = await params;
  const order = await getAdminOrderById(orderId);

  if (!order) {
    notFound();
  }

  const transitions = getAllowedAdminOrderTransitions(order.orderStatus);

  return (
    <div className="space-y-6">
      <Card className="space-y-5 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={getPaymentStatusVariant(order.paymentStatus)}>
                {getPaymentStatusLabel(order.paymentStatus)}
              </Badge>
              <Badge variant={getOrderStatusVariant(order.orderStatus)}>
                {getOrderStatusLabel(order.orderStatus)}
              </Badge>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Order details
              </p>
              <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.06em]">
                {order.orderNumber}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {order.customer.fullName} · {order.customer.email}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 text-sm sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.3rem] border border-white/80 bg-white/72 p-4">
            <p className="text-muted-foreground">Total amount</p>
            <p className="mt-1 font-medium">
              {formatOrderCurrency(order.pricing.estimatedTotal, order.currency)}
            </p>
          </div>
          <div className="rounded-[1.3rem] border border-white/80 bg-white/72 p-4">
            <p className="text-muted-foreground">Created</p>
            <p className="mt-1 font-medium">{formatOrderDate(order.createdAt)}</p>
          </div>
          <div className="rounded-[1.3rem] border border-white/80 bg-white/72 p-4">
            <p className="text-muted-foreground">Payment reference</p>
            <p className="mt-1 font-medium break-all">{order.paymentReference}</p>
          </div>
          <div className="rounded-[1.3rem] border border-white/80 bg-white/72 p-4">
            <p className="text-muted-foreground">Delivery method</p>
            <p className="mt-1 font-medium capitalize">
              {order.deliveryMethod.replaceAll("-", " ")}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <OrderStatusTimeline order={order} />
          <OrderItemsList order={order} />

          <Card className="space-y-5 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Totals
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Order totals
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
                <span className="text-muted-foreground">Coupon</span>
                <span className="font-medium">{order.pricing.couponCode ?? "None"}</span>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                <span className="font-medium">Estimated total</span>
                <span className="font-semibold">
                  {formatOrderCurrency(order.pricing.estimatedTotal, order.currency)}
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <AdminOrderStatusManager order={order} transitions={transitions} />
          <OrderAddressCard order={order} />

          <Card className="space-y-4 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Payment details
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Reference and status
              </h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Payment provider</span>
                <span className="font-medium uppercase">{order.paymentProvider}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Payment method</span>
                <span className="font-medium">{order.paymentMethod ?? "Not set"}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Payment status</span>
                <span className="font-medium">{getPaymentStatusLabel(order.paymentStatus)}</span>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Payment reference</p>
                <p className="break-all font-medium">{order.paymentReference}</p>
              </div>
              {order.paymentMessage ? (
                <div className="space-y-1">
                  <p className="text-muted-foreground">Gateway message</p>
                  <p className="font-medium">{order.paymentMessage}</p>
                </div>
              ) : null}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
