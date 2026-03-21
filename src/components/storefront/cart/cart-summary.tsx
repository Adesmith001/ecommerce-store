"use client";

import Link from "next/link";
import { CouponApplicationCard } from "@/components/storefront/promotions/coupon-application-card";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/helpers/format-currency";
import type { CheckoutPricing } from "@/types/checkout";

type CartSummaryProps = {
  lineItemCount: number;
  pricing: CheckoutPricing;
  totalQuantity: number;
};

export function CartSummary({
  lineItemCount,
  pricing,
  totalQuantity,
}: CartSummaryProps) {
  return (
    <div className="space-y-6">
      <Card className="space-y-6 rounded-[1.8rem] bg-white/55 p-6">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Order summary
          </p>
          <h2 className="font-display mt-3 text-4xl font-bold uppercase tracking-[-0.08em]">
            Total
          </h2>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Line items</span>
            <span className="font-medium">{lineItemCount}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Total quantity</span>
            <span className="font-medium">{totalQuantity}</span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground">Cart subtotal</span>
            <span className="font-medium">{formatCurrency(pricing.subtotal)}</span>
          </div>
          {pricing.discountAmount > 0 ? (
            <div className="flex items-center justify-between gap-3 text-success">
              <span>
                Discount{pricing.appliedCoupon ? ` (${pricing.appliedCoupon.code})` : ""}
              </span>
              <span className="font-medium">-{formatCurrency(pricing.discountAmount)}</span>
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-4">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">Calculated at checkout</span>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-[1.2rem] border border-border bg-muted/55 px-4 py-4">
            <span className="text-muted-foreground">Estimated total</span>
            <span className="font-display text-3xl font-bold tracking-[-0.06em]">
              {formatCurrency(pricing.estimatedTotal)}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            className={buttonVariants({ className: "w-full", size: "lg" })}
            href={ROUTES.storefront.checkout}
          >
            Continue
          </Link>
          <Link
            className={buttonVariants({
              className: "w-full",
              size: "lg",
              variant: "outline",
            })}
            href={ROUTES.storefront.shop}
          >
            Continue shopping
          </Link>
        </div>

        <div className="rounded-[1.2rem] border border-border bg-white/70 p-4 text-sm leading-7 text-muted-foreground">
          Taxes, shipping, and payment handling finalize in checkout.
        </div>
      </Card>

      <CouponApplicationCard title="Apply a coupon" />
    </div>
  );
}
