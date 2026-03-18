"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatCurrency } from "@/helpers/format-currency";
import { DEFAULT_DELIVERY_METHODS } from "@/lib/checkout/checkout-pricing";
import type {
  DeliveryMethod,
  ShippingMethod,
  ShippingMethodFormErrors,
  ShippingMethodFormValues,
} from "@/types";

function validateShippingMethodForm(values: ShippingMethodFormValues) {
  const errors: ShippingMethodFormErrors = {};
  const fee = Number(values.fee);

  if (!values.name.trim()) {
    errors.name = "Method name is required.";
  }

  if (!values.description.trim()) {
    errors.description = "Description is required.";
  }

  if (!values.estimatedDelivery.trim()) {
    errors.estimatedDelivery = "Estimated delivery text is required.";
  }

  if (!Number.isFinite(fee) || fee < 0) {
    errors.fee = "Fee must be zero or greater.";
  }

  return errors;
}

function toFormValues(method: ShippingMethod): ShippingMethodFormValues {
  return {
    active: method.active,
    code: method.code,
    description: method.description,
    estimatedDelivery: method.estimatedDelivery,
    fee: String(method.fee),
    name: method.name,
  };
}

export function AdminShippingSettingsManager({
  shippingMethods,
}: {
  shippingMethods: ShippingMethod[];
}) {
  const presets = useMemo(() => [...DEFAULT_DELIVERY_METHODS], []);
  const [selectedCode, setSelectedCode] = useState<DeliveryMethod>(
    shippingMethods[0]?.code ?? presets[0].code,
  );
  const [values, setValues] = useState<ShippingMethodFormValues>(() => {
    const initialMethod = shippingMethods[0] ?? presets[0];
    return toFormValues(initialMethod);
  });
  const [errors, setErrors] = useState<ShippingMethodFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const existingCodes = new Set(shippingMethods.map((method) => method.code));
  const selectedExistingMethod = shippingMethods.find(
    (method) => method.code === selectedCode,
  );

  const loadMethod = (code: DeliveryMethod) => {
    const method =
      shippingMethods.find((item) => item.code === code) ??
      presets.find((item) => item.code === code) ??
      presets[0];

    setSelectedCode(code);
    setValues(toFormValues(method));
    setErrors({});
    setSubmitError(null);
    setSubmitSuccess(null);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <Card className="space-y-4 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Shipping settings
              </p>
              <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.06em]">
                Delivery methods
              </h1>
            </div>
            <div className="rounded-[1.3rem] border border-white/80 bg-white/72 px-4 py-3 text-sm text-muted-foreground">
              Checkout only shows methods that are marked active here.
            </div>
          </div>
        </Card>

        {shippingMethods.length === 0 ? (
          <EmptyState
            description="No shipping methods are configured yet. Start by selecting a preset method on the right and saving it."
            title="No shipping methods configured"
          />
        ) : (
          <div className="space-y-4">
            {shippingMethods.map((method) => (
              <Card key={method.id} className="space-y-4 p-5">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={
                          method.active
                            ? "rounded-full border border-success/20 bg-success/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-success"
                            : "rounded-full border border-white/80 bg-white/72 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                        }
                      >
                        {method.active ? "Active" : "Inactive"}
                      </span>
                      <span className="rounded-full border border-white/80 bg-white/72 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        {method.code}
                      </span>
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-semibold tracking-[-0.05em]">
                        {method.name}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                    <div className="grid gap-3 text-sm sm:grid-cols-2">
                      <div className="rounded-[1.2rem] border border-white/80 bg-white/72 px-3 py-3">
                        <p className="text-muted-foreground">Fee</p>
                        <p className="mt-1 font-medium">{formatCurrency(method.fee)}</p>
                      </div>
                      <div className="rounded-[1.2rem] border border-white/80 bg-white/72 px-3 py-3">
                        <p className="text-muted-foreground">Estimated delivery</p>
                        <p className="mt-1 font-medium">{method.estimatedDelivery}</p>
                      </div>
                    </div>
                  </div>

                  <Button onClick={() => loadMethod(method.code)} variant="outline">
                    Edit method
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <Card className="space-y-5 p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Method editor
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
              {selectedExistingMethod ? "Update method" : "Create method"}
            </h2>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Method code</label>
            <Select
              onChange={(event) => loadMethod(event.target.value as DeliveryMethod)}
              value={selectedCode}
            >
              {presets.map((preset) => (
                <option key={preset.code} value={preset.code}>
                  {preset.name}
                  {existingCodes.has(preset.code) ? " (configured)" : " (new)"}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              onChange={(event) =>
                setValues((current) => ({ ...current, name: event.target.value }))
              }
              value={values.name}
            />
            {errors.name ? <p className="text-sm text-danger">{errors.name}</p> : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              value={values.description}
            />
            {errors.description ? (
              <p className="text-sm text-danger">{errors.description}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Estimated delivery</label>
            <Input
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  estimatedDelivery: event.target.value,
                }))
              }
              placeholder="3-5 business days"
              value={values.estimatedDelivery}
            />
            {errors.estimatedDelivery ? (
              <p className="text-sm text-danger">{errors.estimatedDelivery}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Fee</label>
            <Input
              inputMode="decimal"
              onChange={(event) =>
                setValues((current) => ({ ...current, fee: event.target.value }))
              }
              value={values.fee}
            />
            {errors.fee ? <p className="text-sm text-danger">{errors.fee}</p> : null}
          </div>

          <label className="flex items-center gap-3 rounded-[1.4rem] border border-white/80 bg-white/72 px-4 py-3 text-sm font-medium">
            <input
              checked={values.active}
              className="h-4 w-4 accent-primary"
              onChange={(event) =>
                setValues((current) => ({ ...current, active: event.target.checked }))
              }
              type="checkbox"
            />
            Show this method in checkout
          </label>

          <Button
            disabled={isSaving}
            onClick={async () => {
              const nextErrors = validateShippingMethodForm(values);
              setErrors(nextErrors);
              setSubmitError(null);
              setSubmitSuccess(null);

              if (Object.keys(nextErrors).length > 0) {
                return;
              }

              try {
                setIsSaving(true);

                const response = await fetch("/api/admin/shipping-methods", {
                  body: JSON.stringify(values),
                  headers: { "Content-Type": "application/json" },
                  method: "POST",
                });

                const payload = (await response.json()) as {
                  message?: string;
                };

                if (!response.ok) {
                  throw new Error(
                    payload.message ?? "Failed to save shipping method.",
                  );
                }

                setSubmitSuccess("Shipping method saved.");
                window.location.reload();
              } catch (error) {
                setSubmitError(
                  error instanceof Error
                    ? error.message
                    : "Failed to save shipping method.",
                );
              } finally {
                setIsSaving(false);
              }
            }}
            size="lg"
          >
            {isSaving ? "Saving..." : selectedExistingMethod ? "Save changes" : "Create method"}
          </Button>

          {submitSuccess ? <p className="text-sm text-success">{submitSuccess}</p> : null}
          {submitError ? <p className="text-sm text-danger">{submitError}</p> : null}
        </Card>
      </div>
    </div>
  );
}
