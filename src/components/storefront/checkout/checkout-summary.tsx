"use client";

import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/helpers/format-currency";
import type { CartItem } from "@/types/cart";
import type { CheckoutPricing } from "@/types/checkout";

type CheckoutSummaryProps = {
  items: CartItem[];
  pricing: CheckoutPricing;
};

export function CheckoutSummary({ items, pricing }: CheckoutSummaryProps) {
  return (
    <Card className="space-y-5 rounded-[1.8rem] bg-white/55 p-6">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
          Order summary
        </p>
        <h2 className="font-display mt-3 text-4xl font-bold uppercase tracking-[-0.08em]">
          Review your order
        </h2>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const unitPrice = item.salePrice ?? item.price;

          return (
            <div
              key={item.productId}
              className="flex items-start justify-between gap-4 rounded-[1.2rem] border border-border bg-white/72 p-4"
            >
              <div className="min-w-0">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">Qty {item.quantity}</p>
              </div>
              <p className="shrink-0 font-medium">
                {formatCurrency(unitPrice * item.quantity)}
              </p>
            </div>
          );
        })}
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Cart subtotal</span>
          <span className="font-medium">{formatCurrency(pricing.subtotal)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Shipping fee</span>
          <span className="font-medium">{formatCurrency(pricing.shippingFee)}</span>
        </div>
        {pricing.discountAmount > 0 ? (
          <div className="flex items-center justify-between gap-3 text-success">
            <span>
              Discount{pricing.appliedCoupon ? ` (${pricing.appliedCoupon.code})` : ""}
            </span>
            <span className="font-medium">-{formatCurrency(pricing.discountAmount)}</span>
          </div>
        ) : null}
        <div className="flex items-center justify-between gap-3">
          <span className="text-muted-foreground">Total quantity</span>
          <span className="font-medium">{pricing.totalQuantity}</span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-[1.2rem] border border-border bg-muted/55 px-4 py-4">
          <span className="text-muted-foreground">Estimated total</span>
          <span className="font-display text-3xl font-bold tracking-[-0.06em]">
            {formatCurrency(pricing.estimatedTotal)}
          </span>
        </div>
      </div>
    </Card>
  );
}
