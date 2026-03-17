"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { COUPON_DISCOUNT_TYPE_OPTIONS } from "@/constants/admin";
import { ROUTES } from "@/constants/routes";
import { validateAdminCouponForm } from "@/lib/admin/admin-coupon-validation";
import { normalizeCouponCode } from "@/lib/coupons/coupon-pricing";
import type {
  AdminCouponFormContext,
  AdminCouponFormErrors,
} from "@/types/admin-coupon";

export function AdminCouponForm({
  couponId,
  initialValues,
  mode,
}: AdminCouponFormContext) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<AdminCouponFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateValues = (nextValues: typeof values) => {
    setValues(nextValues);
    setErrors(validateAdminCouponForm(nextValues));
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-4 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              {mode === "create" ? "Create coupon" : "Edit coupon"}
            </p>
            <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.06em]">
              {mode === "create" ? "New promotion rule" : values.code || "Coupon editor"}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={ROUTES.admin.coupons}>
              <Button variant="outline">Back to coupons</Button>
            </Link>
            {couponId ? (
              <Link href={`${ROUTES.admin.coupons}/${couponId}`}>
                <Button variant="outline">View details</Button>
              </Link>
            ) : null}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card className="space-y-5 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Rule basics
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Discount identity and value
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Coupon code</label>
                <div className="flex gap-2">
                  <Input
                    onChange={(event) =>
                      updateValues({
                        ...values,
                        code: event.target.value.toUpperCase(),
                      })
                    }
                    value={values.code}
                  />
                  <Button
                    onClick={() =>
                      updateValues({
                        ...values,
                        code: normalizeCouponCode(values.code),
                      })
                    }
                    type="button"
                    variant="outline"
                  >
                    Format
                  </Button>
                </div>
                {errors.code ? <p className="text-sm text-danger">{errors.code}</p> : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Discount type</label>
                <Select
                  onChange={(event) =>
                    updateValues({
                      ...values,
                      discountType: event.target.value as typeof values.discountType,
                    })
                  }
                  value={values.discountType}
                >
                  {COUPON_DISCOUNT_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Discount value</label>
                <Input
                  inputMode="decimal"
                  onChange={(event) =>
                    updateValues({ ...values, discountValue: event.target.value })
                  }
                  placeholder={values.discountType === "percentage" ? "10" : "25"}
                  value={values.discountValue}
                />
                {errors.discountValue ? (
                  <p className="text-sm text-danger">{errors.discountValue}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum spend</label>
                <Input
                  inputMode="decimal"
                  onChange={(event) =>
                    updateValues({ ...values, minimumSpend: event.target.value })
                  }
                  value={values.minimumSpend}
                />
                {errors.minimumSpend ? (
                  <p className="text-sm text-danger">{errors.minimumSpend}</p>
                ) : null}
              </div>
            </div>
          </Card>

          <Card className="space-y-5 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Validity window
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Dates and usage caps
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start date</label>
                <Input
                  onChange={(event) =>
                    updateValues({ ...values, startDate: event.target.value })
                  }
                  type="datetime-local"
                  value={values.startDate}
                />
                {errors.startDate ? (
                  <p className="text-sm text-danger">{errors.startDate}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End date</label>
                <Input
                  onChange={(event) =>
                    updateValues({ ...values, endDate: event.target.value })
                  }
                  type="datetime-local"
                  value={values.endDate}
                />
                {errors.endDate ? <p className="text-sm text-danger">{errors.endDate}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Usage limit</label>
                <Input
                  inputMode="numeric"
                  onChange={(event) =>
                    updateValues({ ...values, usageLimit: event.target.value })
                  }
                  placeholder="Leave blank for unlimited"
                  value={values.usageLimit}
                />
                {errors.usageLimit ? (
                  <p className="text-sm text-danger">{errors.usageLimit}</p>
                ) : null}
              </div>
            </div>

            <label className="flex items-center gap-3 rounded-[1.4rem] border border-white/80 bg-white/72 px-4 py-3 text-sm font-medium">
              <input
                checked={values.active}
                className="h-4 w-4 accent-primary"
                onChange={(event) =>
                  updateValues({ ...values, active: event.target.checked })
                }
                type="checkbox"
              />
              Allow customers to apply this coupon
            </label>
          </Card>

          <Card className="space-y-5 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Restrictions
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Optional scope controls
              </h2>
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Restricted category slugs</label>
                <Textarea
                  onChange={(event) =>
                    updateValues({
                      ...values,
                      restrictedCategorySlugs: event.target.value,
                    })
                  }
                  placeholder="bags, travel, new-arrivals"
                  rows={4}
                  value={values.restrictedCategorySlugs}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Restricted product IDs</label>
                <Textarea
                  onChange={(event) =>
                    updateValues({
                      ...values,
                      restrictedProductIds: event.target.value,
                    })
                  }
                  placeholder="product-id-1, product-id-2"
                  rows={4}
                  value={values.restrictedProductIds}
                />
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4 p-6">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Save
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-[-0.05em]">
              Save this coupon rule
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Coupon totals are revalidated on the server before payment starts, so invalid rules never affect an order.
            </p>

            <Button
              disabled={isSaving}
              onClick={async () => {
                const nextErrors = validateAdminCouponForm(values);
                setErrors(nextErrors);
                setSubmitError(null);

                if (Object.keys(nextErrors).length > 0) {
                  return;
                }

                setIsSaving(true);

                try {
                  const response = await fetch(
                    mode === "create" ? "/api/admin/coupons" : `/api/admin/coupons/${couponId}`,
                    {
                      body: JSON.stringify(values),
                      headers: { "Content-Type": "application/json" },
                      method: mode === "create" ? "POST" : "PATCH",
                    },
                  );

                  const payload = (await response.json()) as {
                    coupon?: { id: string };
                    message?: string;
                  };

                  if (!response.ok || !payload.coupon) {
                    throw new Error(payload.message ?? "Failed to save coupon.");
                  }

                  router.push(`${ROUTES.admin.coupons}/${payload.coupon.id}`);
                  router.refresh();
                } catch (error) {
                  setSubmitError(
                    error instanceof Error ? error.message : "Failed to save coupon.",
                  );
                } finally {
                  setIsSaving(false);
                }
              }}
              size="lg"
            >
              {isSaving
                ? "Saving..."
                : mode === "create"
                  ? "Create coupon"
                  : "Save changes"}
            </Button>

            {submitError ? <p className="text-sm text-danger">{submitError}</p> : null}
          </Card>
        </div>
      </div>
    </div>
  );
}
