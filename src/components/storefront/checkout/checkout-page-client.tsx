"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CouponApplicationCard } from "@/components/storefront/promotions/coupon-application-card";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/helpers/format-currency";
import { useAppSelector } from "@/hooks/use-redux";
import { buildCheckoutOrderDraft } from "@/lib/checkout/checkout-order";
import { buildCheckoutPricing } from "@/lib/checkout/checkout-pricing";
import { validateCheckoutForm } from "@/lib/checkout/checkout-validation";
import {
  selectCartAppliedCoupon,
  selectCartHydrated,
  selectCartItems,
} from "@/store/features/cart/cart-slice";
import type { CheckoutFormErrors, CheckoutFormValues, DeliveryMethod } from "@/types/checkout";
import type { ShippingMethod } from "@/types/shipping";
import { CheckoutSummary } from "@/components/storefront/checkout/checkout-summary";

type CheckoutPageClientProps = {
  initialValues: CheckoutFormValues;
  shippingMethods: ShippingMethod[];
};

const EMPTY_ERRORS: CheckoutFormErrors = {};

export function CheckoutPageClient({
  initialValues,
  shippingMethods,
}: CheckoutPageClientProps) {
  const hydrated = useAppSelector(selectCartHydrated);
  const appliedCoupon = useAppSelector(selectCartAppliedCoupon);
  const items = useAppSelector(selectCartItems);
  const [values, setValues] = useState<CheckoutFormValues>(initialValues);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(
    shippingMethods[0]?.code ?? "pickup",
  );
  const [errors, setErrors] = useState<CheckoutFormErrors>(EMPTY_ERRORS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const pricing = useMemo(
    () =>
      buildCheckoutPricing({
        appliedCoupon,
        deliveryMethod,
        items,
        shippingMethods,
      }),
    [appliedCoupon, deliveryMethod, items, shippingMethods],
  );

  if (!hydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <Skeleton className="h-[56rem] w-full rounded-[2rem]" />
        <Skeleton className="h-[30rem] w-full rounded-[2rem]" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        action={
          <Link href={ROUTES.storefront.cart}>
            <Button>Return to cart</Button>
          </Link>
        }
        description="Add products to your cart before proceeding to checkout."
        title="Your cart is empty"
      />
    );
  }

  if (shippingMethods.length === 0) {
    return (
      <EmptyState
        description="There are no active delivery methods right now. Please check back after the store updates shipping settings."
        title="Shipping is temporarily unavailable"
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
      <div className="space-y-6">
        <div className="space-y-6 border-b border-border/70 pb-6">
          <div className="flex flex-wrap gap-8 text-lg font-medium uppercase tracking-[0.14em]">
            <span className="text-foreground">Information</span>
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-muted-foreground">Payment</span>
          </div>
        </div>

        <Card className="space-y-6 rounded-[1.8rem] bg-white/55 p-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Contact info
            </p>
            <h2 className="font-display mt-3 text-4xl font-bold uppercase tracking-[-0.08em]">
              Checkout
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium" htmlFor="fullName">
                Full name
              </label>
              <Input
                id="fullName"
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    fullName: event.target.value,
                  }))
                }
                value={values.fullName}
              />
              {errors.fullName ? (
                <p className="text-sm text-danger">{errors.fullName}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    email: event.target.value,
                  }))
                }
                type="email"
                value={values.email}
              />
              {errors.email ? (
                <p className="text-sm text-danger">{errors.email}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="phoneNumber">
                Phone number
              </label>
              <Input
                id="phoneNumber"
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    phoneNumber: event.target.value,
                  }))
                }
                value={values.phoneNumber}
              />
              {errors.phoneNumber ? (
                <p className="text-sm text-danger">{errors.phoneNumber}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="country">
                Country
              </label>
              <Input
                id="country"
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    country: event.target.value,
                  }))
                }
                value={values.country}
              />
              {errors.country ? (
                <p className="text-sm text-danger">{errors.country}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="state">
                State
              </label>
              <Input
                id="state"
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    state: event.target.value,
                  }))
                }
                value={values.state}
              />
              {errors.state ? (
                <p className="text-sm text-danger">{errors.state}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="city">
                City
              </label>
              <Input
                id="city"
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    city: event.target.value,
                  }))
                }
                value={values.city}
              />
              {errors.city ? (
                <p className="text-sm text-danger">{errors.city}</p>
              ) : null}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium" htmlFor="addressLine">
                Address line
              </label>
              <Textarea
                id="addressLine"
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    addressLine: event.target.value,
                  }))
                }
                rows={4}
                value={values.addressLine}
              />
              {errors.addressLine ? (
                <p className="text-sm text-danger">{errors.addressLine}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="landmark">
                Landmark
              </label>
              <Input
                id="landmark"
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    landmark: event.target.value,
                  }))
                }
                value={values.landmark}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="postalCode">
                Postal code
              </label>
              <Input
                id="postalCode"
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    postalCode: event.target.value,
                  }))
                }
                value={values.postalCode}
              />
            </div>
          </div>
        </Card>

        <Card className="space-y-5 rounded-[1.8rem] bg-white/55 p-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Delivery Method
            </p>
            <h2 className="font-display mt-3 text-3xl font-bold uppercase tracking-[-0.08em]">
              Shipping
            </h2>
          </div>

          <div className="grid gap-3">
            {shippingMethods.map((method) => (
              <label
                key={method.id}
                className={`flex cursor-pointer items-start gap-4 rounded-[1.2rem] border px-4 py-4 ${
                  deliveryMethod === method.code
                    ? "border-foreground bg-foreground text-primary-foreground"
                    : "border-border bg-white/70"
                }`}
              >
                <input
                  checked={deliveryMethod === method.code}
                  className="mt-1 h-4 w-4 accent-primary"
                  name="deliveryMethod"
                  onChange={() => setDeliveryMethod(method.code)}
                  type="radio"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{method.name}</p>
                    <p className="font-semibold">
                      {method.fee === 0
                        ? "Free"
                        : formatCurrency(method.fee)}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {method.description} {method.estimatedDelivery ? `| ${method.estimatedDelivery}` : ""}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </Card>

        <CouponApplicationCard title="Apply a promotion" />

        <div className="flex flex-wrap gap-3">
          <Button
            disabled={isSubmitting}
            onClick={async () => {
              const nextErrors = validateCheckoutForm(values);
              setErrors(nextErrors);
              setSubmitError(null);

              if (Object.keys(nextErrors).length > 0) {
                return;
              }

              const orderDraft = buildCheckoutOrderDraft({
                appliedCoupon,
                couponCode: appliedCoupon?.code,
                deliveryMethod,
                items,
                shippingMethods,
                values,
              });

              try {
                setIsSubmitting(true);

                const response = await fetch("/api/payments/kora/initialize", {
                  body: JSON.stringify(orderDraft),
                  headers: {
                    "Content-Type": "application/json",
                  },
                  method: "POST",
                });

                const payload =
                  (await response.json()) as { checkoutUrl?: string; message?: string };

                if (!response.ok || !payload.checkoutUrl) {
                  throw new Error(
                    payload.message ??
                      "We could not start your payment right now. Please try again.",
                  );
                }

                window.location.assign(payload.checkoutUrl);
              } catch (error) {
                setSubmitError(
                  error instanceof Error
                    ? error.message
                    : "We could not start your payment right now. Please try again.",
                );
              } finally {
                setIsSubmitting(false);
              }
            }}
            size="lg"
          >
            {isSubmitting ? "Redirecting to payment..." : "Proceed to payment"}
          </Button>
          <Link href={ROUTES.storefront.cart}>
            <Button size="lg" variant="outline">
              Back to cart
            </Button>
          </Link>
        </div>

        {submitError ? (
          <Card className="space-y-3 rounded-[1.6rem] border-danger/20 bg-white/55 p-6">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-danger">
              Payment initialization failed
            </p>
            <p className="text-sm text-muted-foreground">{submitError}</p>
          </Card>
        ) : null}
      </div>

      <div className="space-y-6">
        <CheckoutSummary items={items} pricing={pricing} />
        <Card className="space-y-3 rounded-[1.6rem] bg-white/55 p-5 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Payment note</p>
          <p>
            Orders are created before payment starts, and the cart will only clear
            after a verified successful response from Kora.
          </p>
        </Card>
      </div>
    </div>
  );
}
