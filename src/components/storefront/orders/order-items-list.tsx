import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { formatOrderCurrency } from "@/lib/orders/order-presentation";
import type { OrderRecord } from "@/types/order";

type OrderItemsListProps = {
  order: OrderRecord;
};

export function OrderItemsList({ order }: OrderItemsListProps) {
  return (
    <Card className="space-y-6 p-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
          Purchased items
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
          What you ordered
        </h2>
      </div>

      <div className="space-y-4">
        {order.items.map((item) => {
          const image = item.image?.url ?? "";
          const unitPrice = item.salePrice ?? item.price;

          return (
            <div
              key={item.productId}
              className="flex flex-col gap-4 rounded-[1.7rem] border border-white/80 bg-white/72 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-[1.4rem] bg-surface">
                  {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={item.image?.alt ?? item.name}
                      className="h-full w-full object-cover"
                      src={image}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <Link
                    className="font-medium hover:text-primary"
                    href={ROUTES.storefront.product(item.slug)}
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-sm sm:text-right">
                <p className="text-muted-foreground">
                  Unit price: {formatOrderCurrency(unitPrice, order.currency)}
                </p>
                <p className="text-base font-semibold">
                  {formatOrderCurrency(unitPrice * item.quantity, order.currency)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
