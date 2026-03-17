"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdminImageField } from "@/components/admin/admin-image-field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { validateBannerForm } from "@/lib/admin/admin-merchandising-validation";
import type { BannerFormContext, BannerFormErrors } from "@/types/admin-merchandising";

type AdminBannerFormProps = BannerFormContext;

export function AdminBannerForm({
  bannerId,
  initialValues,
  mode,
}: AdminBannerFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<BannerFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateValues = (nextValues: typeof values) => {
    setValues(nextValues);
    setErrors(validateBannerForm(nextValues));
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-4 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              {mode === "create" ? "Create banner" : "Edit banner"}
            </p>
            <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.06em]">
              {mode === "create" ? "New homepage banner" : values.title || "Banner editor"}
            </h1>
          </div>
          <Link href={ROUTES.admin.banners}>
            <Button variant="outline">Back to banners</Button>
          </Link>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <Card className="space-y-5 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Campaign copy
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Banner content
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  onChange={(event) => updateValues({ ...values, title: event.target.value })}
                  value={values.title}
                />
                {errors.title ? <p className="text-sm text-danger">{errors.title}</p> : null}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Subtitle</label>
                <Input
                  onChange={(event) =>
                    updateValues({ ...values, subtitle: event.target.value })
                  }
                  value={values.subtitle}
                />
                {errors.subtitle ? (
                  <p className="text-sm text-danger">{errors.subtitle}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">CTA text</label>
                <Input
                  onChange={(event) =>
                    updateValues({ ...values, ctaText: event.target.value })
                  }
                  value={values.ctaText}
                />
                {errors.ctaText ? <p className="text-sm text-danger">{errors.ctaText}</p> : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">CTA link</label>
                <Input
                  onChange={(event) =>
                    updateValues({ ...values, ctaLink: event.target.value })
                  }
                  placeholder="/shop"
                  value={values.ctaLink}
                />
                {errors.ctaLink ? <p className="text-sm text-danger">{errors.ctaLink}</p> : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sort order</label>
                <Input
                  inputMode="numeric"
                  onChange={(event) =>
                    updateValues({ ...values, sortOrder: event.target.value })
                  }
                  value={values.sortOrder}
                />
                {errors.sortOrder ? (
                  <p className="text-sm text-danger">{errors.sortOrder}</p>
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
              Show this banner on the storefront campaign section
            </label>
          </Card>

          <Card className="space-y-5 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Media
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Campaign image
              </h2>
            </div>

            <AdminImageField
              helperText="Used on the homepage promotional section and future campaign surfaces."
              image={values.image}
              label="Banner image"
              onChange={(image) => updateValues({ ...values, image })}
            />
            {errors.image ? <p className="text-sm text-danger">{errors.image}</p> : null}
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4 p-6">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Save
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-[-0.05em]">
              Save this campaign banner
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Inactive banners remain available for later reuse without showing on the homepage.
            </p>

            <Button
              disabled={isSaving}
              onClick={async () => {
                const nextErrors = validateBannerForm(values);
                setErrors(nextErrors);
                setSubmitError(null);

                if (Object.keys(nextErrors).length > 0) {
                  return;
                }

                setIsSaving(true);

                try {
                  const response = await fetch(
                    mode === "create" ? "/api/admin/banners" : `/api/admin/banners/${bannerId}`,
                    {
                      body: JSON.stringify(values),
                      headers: { "Content-Type": "application/json" },
                      method: mode === "create" ? "POST" : "PATCH",
                    },
                  );

                  const payload = (await response.json()) as {
                    banner?: { id: string };
                    message?: string;
                  };

                  if (!response.ok || !payload.banner) {
                    throw new Error(payload.message ?? "Failed to save banner.");
                  }

                  router.push(`${ROUTES.admin.banners}/${payload.banner.id}/edit`);
                  router.refresh();
                } catch (error) {
                  setSubmitError(
                    error instanceof Error ? error.message : "Failed to save banner.",
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
                  ? "Create banner"
                  : "Save changes"}
            </Button>

            {submitError ? <p className="text-sm text-danger">{submitError}</p> : null}
          </Card>
        </div>
      </div>
    </div>
  );
}
