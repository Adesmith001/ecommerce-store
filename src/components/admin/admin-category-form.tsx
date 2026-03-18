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
  validateCategoryForm,
} from "@/lib/admin/admin-merchandising-validation";
import type {
  CategoryFormContext,
  CategoryFormErrors,
} from "@/types/admin-merchandising";

type AdminCategoryFormProps = CategoryFormContext;

export function AdminCategoryForm({
  categoryId,
  initialValues,
  mode,
  parentOptions,
}: AdminCategoryFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<CategoryFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateValues = (nextValues: typeof values) => {
    setValues(nextValues);
    setErrors(validateCategoryForm(nextValues));
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-4 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              {mode === "create" ? "Create category" : "Edit category"}
            </p>
            <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.06em]">
              {mode === "create" ? "New category" : values.name || "Category editor"}
            </h1>
          </div>
          <Link href={ROUTES.admin.categories}>
            <Button variant="outline">Back to categories</Button>
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
                Identity and hierarchy
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Category name</label>
                <Input
                  onChange={(event) => updateValues({ ...values, name: event.target.value })}
                  value={values.name}
                />
                {errors.name ? <p className="text-sm text-danger">{errors.name}</p> : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Parent category</label>
                <Select
                  onChange={(event) =>
                    updateValues({ ...values, parentCategoryId: event.target.value })
                  }
                  value={values.parentCategoryId}
                >
                  <option value="">No parent</option>
                  {parentOptions.map((option) => (
                    <option key={option.id} value={option.id}>
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
                {errors.description ? (
                  <p className="text-sm text-danger">{errors.description}</p>
                ) : null}
              </div>
            </div>
          </Card>

          <Card className="space-y-5 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Media
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Category image
              </h2>
            </div>

            <AdminImageField
              helperText="Used across discovery cards, collection sections, and future navigation surfaces."
              image={values.image}
              label="Category image"
              onChange={(image) => updateValues({ ...values, image })}
            />
          </Card>

          <Card className="space-y-5 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Merchandising
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Visibility settings
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>

            <label className="flex items-center gap-3 rounded-[1.4rem] border border-white/80 bg-white/72 px-4 py-3 text-sm font-medium">
              <input
                checked={values.featured}
                className="h-4 w-4 accent-primary"
                onChange={(event) =>
                  updateValues({ ...values, featured: event.target.checked })
                }
                type="checkbox"
              />
              Feature this category on storefront surfaces
            </label>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4 p-6">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Save
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-[-0.05em]">
              Publish this category
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Active categories remain available to merchandising flows. Archived categories
              stay visible only in admin.
            </p>

            <Button
              disabled={isSaving}
              onClick={async () => {
                const nextErrors = validateCategoryForm(values);
                setErrors(nextErrors);
                setSubmitError(null);

                if (Object.keys(nextErrors).length > 0) {
                  return;
                }

                setIsSaving(true);

                try {
                  const response = await fetch(
                    mode === "create"
                      ? "/api/admin/categories"
                      : `/api/admin/categories/${categoryId}`,
                    {
                      body: JSON.stringify(values),
                      headers: { "Content-Type": "application/json" },
                      method: mode === "create" ? "POST" : "PATCH",
                    },
                  );

                  const payload = (await response.json()) as {
                    category?: { id: string };
                    message?: string;
                  };

                  if (!response.ok || !payload.category) {
                    throw new Error(payload.message ?? "Failed to save category.");
                  }

                  router.push(`${ROUTES.admin.categories}/${payload.category.id}/edit`);
                  router.refresh();
                } catch (error) {
                  setSubmitError(
                    error instanceof Error ? error.message : "Failed to save category.",
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
                  ? "Create category"
                  : "Save changes"}
            </Button>

            {submitError ? <p className="text-sm text-danger">{submitError}</p> : null}
          </Card>
        </div>
      </div>
    </div>
  );
}
