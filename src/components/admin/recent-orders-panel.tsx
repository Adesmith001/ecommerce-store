import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/helpers/format-currency";
import { formatOrderDate } from "@/lib/orders/order-presentation";
import type { AdminRecentOrder } from "@/types/admin";

type RecentOrdersPanelProps = {
  orders: AdminRecentOrder[];
};

export function RecentOrdersPanel({ orders }: RecentOrdersPanelProps) {
  return (
    <Card className="space-y-5 p-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Recent orders
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
          Latest activity
        </h2>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          No orders yet.
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="grid gap-3 rounded-[1.4rem] border border-white/80 bg-white/72 px-4 py-4 lg:grid-cols-[1.2fr_0.8fr_0.7fr]"
            >
              <div>
                <p className="font-medium">{order.orderNumber}</p>
                <p className="text-sm text-muted-foreground">{order.customerName}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={order.paymentStatus === "paid" ? "primary" : "outline"}>
                  {order.paymentStatus}
                </Badge>
                <Badge variant={order.orderStatus === "pending" ? "secondary" : "outline"}>
                  {order.orderStatus}
                </Badge>
              </div>
              <div className="text-sm lg:text-right">
                <p className="font-medium">{formatCurrency(order.total)}</p>
                <p className="text-muted-foreground">{formatOrderDate(order.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
