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
      <Card className="space-y-5 p-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Summary
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
            Order overview
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
          <div className="flex items-center justify-between gap-3 rounded-[1.35rem] border border-white/80 bg-white/72 px-4 py-4">
            <span className="text-muted-foreground">Estimated total</span>
            <span className="font-display text-2xl font-semibold tracking-[-0.05em]">
              {formatCurrency(pricing.estimatedTotal)}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            className={buttonVariants({ className: "w-full", size: "lg" })}
            href={ROUTES.storefront.checkout}
          >
            Proceed to checkout
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

        <div className="rounded-[1.5rem] border border-white/80 bg-white/72 p-4 text-sm leading-7 text-muted-foreground">
          Taxes, shipping, and payment handling will plug into this summary in the
          checkout phase.
        </div>
      </Card>

      <CouponApplicationCard title="Apply a coupon" />
    </div>
  );
}
