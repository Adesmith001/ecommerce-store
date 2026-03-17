"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";

type CartSummaryProps = {
  estimatedTotal: number;
  lineItemCount: number;
  subtotal: number;
  totalQuantity: number;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(value);
}

export function CartSummary({
  estimatedTotal,
  lineItemCount,
  subtotal,
  totalQuantity,
}: CartSummaryProps) {
  return (
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
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between gap-3 rounded-[1.35rem] border border-white/80 bg-white/72 px-4 py-4">
          <span className="text-muted-foreground">Estimated total</span>
          <span className="font-display text-2xl font-semibold tracking-[-0.05em]">
            {formatPrice(estimatedTotal)}
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
  );
}
