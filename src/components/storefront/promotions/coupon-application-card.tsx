"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/helpers/format-currency";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { buildCartPricing } from "@/lib/checkout/checkout-pricing";
import {
  clearAppliedCoupon,
  selectCartAppliedCoupon,
  selectCartItems,
  setAppliedCoupon,
} from "@/store/features/cart/cart-slice";
import type { AppliedCoupon } from "@/types/coupon";

export function CouponApplicationCard({
  description = "Apply one valid coupon at a time. Invalid or expired coupons will not affect your total.",
  title = "Coupon code",
}: {
  description?: string;
  title?: string;
}) {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const appliedCoupon = useAppSelector(selectCartAppliedCoupon);
  const [code, setCode] = useState(appliedCoupon?.code ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pricing = useMemo(
    () =>
      buildCartPricing({
        appliedCoupon,
        items,
      }),
    [appliedCoupon, items],
  );

  useEffect(() => {
    setCode(appliedCoupon?.code ?? "");
  }, [appliedCoupon?.code]);

  return (
    <Card className="space-y-4 p-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Promotion
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">{description}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          value={code}
        />
        <Button
          disabled={isSubmitting || items.length === 0}
          onClick={async () => {
            setError(null);
            setMessage(null);

            try {
              setIsSubmitting(true);

              const response = await fetch("/api/coupons/apply", {
                body: JSON.stringify({ code, items }),
                headers: { "Content-Type": "application/json" },
                method: "POST",
              });

              const payload = (await response.json()) as {
                appliedCoupon?: AppliedCoupon;
                discountAmount?: number;
                message?: string;
              };

              if (!response.ok || !payload.appliedCoupon) {
                throw new Error(
                  payload.message ?? "This coupon could not be applied.",
                );
              }

              dispatch(setAppliedCoupon(payload.appliedCoupon));
              setCode(payload.appliedCoupon.code);
              setMessage(
                `${payload.message ?? "Coupon applied."} You saved ${formatCurrency(payload.discountAmount ?? 0)}.`,
              );
            } catch (nextError) {
              setError(
                nextError instanceof Error
                  ? nextError.message
                  : "This coupon could not be applied.",
              );
            } finally {
              setIsSubmitting(false);
            }
          }}
          variant="outline"
        >
          {isSubmitting ? "Applying..." : "Apply"}
        </Button>
      </div>

      {pricing.appliedCoupon ? (
        <div className="rounded-[1.35rem] border border-success/20 bg-success/8 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {pricing.appliedCoupon.code} is active
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Saving {formatCurrency(pricing.discountAmount)} on this order.
              </p>
            </div>
            <Button
              onClick={() => {
                dispatch(clearAppliedCoupon());
                setCode("");
                setError(null);
                setMessage("Coupon removed.");
              }}
              variant="outline"
            >
              Remove
            </Button>
          </div>
        </div>
      ) : null}

      {message ? <p className="text-sm text-success">{message}</p> : null}
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </Card>
  );
}
