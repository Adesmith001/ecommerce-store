"use client";

import { Card } from "@/components/ui/card";
import type { CartItem } from "@/types/cart";
import type { CheckoutPricing } from "@/types/checkout";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(value);
}

type CheckoutSummaryProps = {
  items: CartItem[];
  pricing: CheckoutPricing;
};

export function CheckoutSummary({ items, pricing }: CheckoutSummaryProps) {
  return (
    <Card className="space-y-5 p-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Order Summary
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Review your order
        </h2>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const unitPrice = item.salePrice ?? item.price;

          return (
            <div
              key={item.productId}
              className="flex items-start justify-between gap-4 border-b border-border pb-4 last:border-b-0 last:pb-0"
            >
              <div className="min-w-0">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  Qty {item.quantity} · {item.sku}
                </p>
              </div>
              <p className="shrink-0 font-medium">
                {formatPrice(unitPrice * item.quantity)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Cart subtotal</span>
          <span className="font-medium">{formatPrice(pricing.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Shipping fee</span>
          <span className="font-medium">{formatPrice(pricing.shippingFee)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Total quantity</span>
          <span className="font-medium">{pricing.totalQuantity}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Estimated total</span>
          <span className="text-lg font-semibold">
            {formatPrice(pricing.estimatedTotal)}
          </span>
        </div>
      </div>
    </Card>
  );
}
