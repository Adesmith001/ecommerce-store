"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminImageField } from "@/components/admin/admin-image-field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MERCHANDISING_STATUS_OPTIONS } from "@/constants/admin";
import { ROUTES } from "@/constants/routes";
import {
  slugifyMerchandisingName,
  validateBrandForm,
} from "@/lib/admin/admin-merchandising-validation";
import type { BrandFormContext, BrandFormErrors } from "@/types/admin-merchandising";

type AdminBrandFormProps = BrandFormContext;

export function AdminBrandForm({
  brandId,
  initialValues,
  mode,
}: AdminBrandFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<BrandFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateValues = (nextValues: typeof values) => {
    setValues(nextValues);
    setErrors(validateBrandForm(nextValues));
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-4 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              {mode === "create" ? "Create brand" : "Edit brand"}
            </p>
            <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.06em]">
              {mode === "create" ? "New brand" : values.name || "Brand editor"}
            </h1>
          </div>
          <Link href={ROUTES.admin.brands}>
            <Button variant="outline">Back to brands</Button>
          </Link>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card className="space-y-5 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Basic info
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Brand identity
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Brand name</label>
                <Input
                  onChange={(event) => updateValues({ ...values, name: event.target.value })}
                  value={values.name}
                />
                {errors.name ? <p className="text-sm text-danger">{errors.name}</p> : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Slug</label>
                <div className="flex gap-2">
                  <Input
                    onChange={(event) => updateValues({ ...values, slug: event.target.value })}
                    value={values.slug}
                  />
                  <Button
                    onClick={() =>
                      updateValues({
                        ...values,
                        slug: slugifyMerchandisingName(values.name),
                      })
                    }
                    type="button"
                    variant="outline"
                  >
                    Generate
                  </Button>
                </div>
                {errors.slug ? <p className="text-sm text-danger">{errors.slug}</p> : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  onChange={(event) =>
                    updateValues({
                      ...values,
                      status: event.target.value as typeof values.status,
                    })
                  }
                  value={values.status}
                >
                  {MERCHANDISING_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  onChange={(event) =>
                    updateValues({ ...values, description: event.target.value })
                  }
                  rows={6}
                  value={values.description}
                />
              </div>
            </div>
          </Card>

          <Card className="space-y-5 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Media
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Logo or image
              </h2>
            </div>

            <AdminImageField
              helperText="This image can be reused in future brand pages and storefront filters."
              image={values.image}
              label="Brand logo"
              onChange={(image) => updateValues({ ...values, image })}
            />
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4 p-6">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Save
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-[-0.05em]">
              Save this brand
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Archived brands remain in admin history but are filtered out of new product forms.
            </p>

            <Button
              disabled={isSaving}
              onClick={async () => {
                const nextErrors = validateBrandForm(values);
                setErrors(nextErrors);
                setSubmitError(null);

                if (Object.keys(nextErrors).length > 0) {
                  return;
                }

                setIsSaving(true);

                try {
                  const response = await fetch(
                    mode === "create" ? "/api/admin/brands" : `/api/admin/brands/${brandId}`,
                    {
                      body: JSON.stringify(values),
                      headers: { "Content-Type": "application/json" },
                      method: mode === "create" ? "POST" : "PATCH",
                    },
                  );

                  const payload = (await response.json()) as {
                    brand?: { id: string };
                    message?: string;
                  };

                  if (!response.ok || !payload.brand) {
                    throw new Error(payload.message ?? "Failed to save brand.");
                  }

                  router.push(`${ROUTES.admin.brands}/${payload.brand.id}/edit`);
                  router.refresh();
                } catch (error) {
                  setSubmitError(
                    error instanceof Error ? error.message : "Failed to save brand.",
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
                  ? "Create brand"
                  : "Save changes"}
            </Button>

            {submitError ? <p className="text-sm text-danger">{submitError}</p> : null}
          </Card>
        </div>
      </div>
    </div>
  );
}
