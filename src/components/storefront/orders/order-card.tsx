import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import {
  formatOrderCurrency,
  formatOrderDate,
  getOrderStatusLabel,
  getOrderStatusVariant,
  getPaymentStatusLabel,
  getPaymentStatusVariant,
} from "@/lib/orders/order-presentation";
import type { OrderRecord } from "@/types/order";

type OrderCardProps = {
  order: OrderRecord;
};

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Card className="space-y-5 p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Order {order.orderNumber}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={getPaymentStatusVariant(order.paymentStatus)}>
              {getPaymentStatusLabel(order.paymentStatus)}
            </Badge>
            <Badge variant={getOrderStatusVariant(order.orderStatus)}>
              {getOrderStatusLabel(order.orderStatus)}
            </Badge>
          </div>
        </div>

        <Link href={ROUTES.storefront.order(order.id)}>
          <Button variant="outline">View details</Button>
        </Link>
      </div>

      <div className="grid gap-4 text-sm sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <p className="text-muted-foreground">Order date</p>
          <p className="mt-1 font-medium">{formatOrderDate(order.createdAt)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Items</p>
          <p className="mt-1 font-medium">{order.pricing.totalQuantity}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Delivery method</p>
          <p className="mt-1 font-medium capitalize">
            {order.deliveryMethod.replace("-", " ")}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Total amount</p>
          <p className="mt-1 font-medium">
            {formatOrderCurrency(order.pricing.estimatedTotal, order.currency)}
          </p>
        </div>
      </div>

      <div className="rounded-3xl bg-surface p-4 text-sm text-muted-foreground">
        {order.items.length > 0
          ? `${order.items[0]?.name}${order.items.length > 1 ? ` and ${order.items.length - 1} more item(s)` : ""}`
          : "No items available for this order."}
      </div>
    </Card>
  );
}
