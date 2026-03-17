"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PRODUCT_STATUS_OPTIONS } from "@/constants/admin";
import { ROUTES } from "@/constants/routes";
import {
  slugifyProductName,
  validateAdminProductForm,
} from "@/lib/admin/admin-product-validation";
import {
  canUploadToCloudinary,
  uploadProductImageToCloudinary,
} from "@/lib/cloudinary/upload";
import type {
  AdminProductFormContext,
  AdminProductFormImage,
  AdminProductFormSpecification,
} from "@/types/admin-product";
import type { AdminProductFormErrors } from "@/types/admin-product";

type AdminProductFormProps = AdminProductFormContext;

export function AdminProductForm({
  brands,
  categories,
  initialValues,
  mode,
  productId,
}: AdminProductFormProps) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<AdminProductFormErrors>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const cloudinaryReady = useMemo(() => canUploadToCloudinary(), []);

  const syncErrors = (nextValues: typeof values) => {
    setErrors(validateAdminProductForm(nextValues));
  };

  const updateValues = (nextValues: typeof values) => {
    setValues(nextValues);
    syncErrors(nextValues);
  };

  const setImage = (imageId: string, nextImage: Partial<AdminProductFormImage>) => {
    updateValues({
      ...values,
      images: values.images.map((image) =>
        image.id === imageId ? { ...image, ...nextImage } : image,
      ),
    });
  };

  const setSpecification = (
    specificationId: string,
    nextSpecification: Partial<AdminProductFormSpecification>,
  ) => {
    updateValues({
      ...values,
      specifications: values.specifications.map((specification) =>
        specification.id === specificationId
          ? { ...specification, ...nextSpecification }
          : specification,
      ),
    });
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    setSubmitError(null);
    setIsUploading(true);

    try {
      const uploadedImages = await Promise.all(
        files.map((file) => uploadProductImageToCloudinary(file)),
      );

      updateValues({
        ...values,
        images: [...values.images, ...uploadedImages],
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to upload image.",
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="space-y-4 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              {mode === "create" ? "Create product" : "Edit product"}
            </p>
            <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.06em]">
              {mode === "create" ? "New product" : values.name || "Product editor"}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={ROUTES.admin.products}>
              <Button variant="outline">Back to products</Button>
            </Link>
            {productId ? (
              <Link href={`${ROUTES.admin.products}/${productId}`}>
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
                Basic info
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Identity and descriptions
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Product name</label>
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
                        slug: slugifyProductName(values.name),
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
                <label className="text-sm font-medium">SKU</label>
                <Input
                  onChange={(event) => updateValues({ ...values, sku: event.target.value })}
                  value={values.sku}
                />
                {errors.sku ? <p className="text-sm text-danger">{errors.sku}</p> : null}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Short description</label>
                <Textarea
                  onChange={(event) =>
                    updateValues({ ...values, shortDescription: event.target.value })
                  }
                  rows={4}
                  value={values.shortDescription}
                />
                {errors.shortDescription ? (
                  <p className="text-sm text-danger">{errors.shortDescription}</p>
                ) : null}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-sm font-medium">Full description</label>
                <Textarea
                  onChange={(event) =>
                    updateValues({ ...values, fullDescription: event.target.value })
                  }
                  rows={8}
                  value={values.fullDescription}
                />
                {errors.fullDescription ? (
                  <p className="text-sm text-danger">{errors.fullDescription}</p>
                ) : null}
              </div>
            </div>
          </Card>

          <Card className="space-y-5 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Pricing and inventory
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Commerce settings
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Price</label>
                <Input
                  inputMode="decimal"
                  onChange={(event) => updateValues({ ...values, price: event.target.value })}
                  value={values.price}
                />
                {errors.price ? <p className="text-sm text-danger">{errors.price}</p> : null}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sale price</label>
                <Input
                  inputMode="decimal"
                  onChange={(event) =>
                    updateValues({ ...values, salePrice: event.target.value })
                  }
                  value={values.salePrice}
                />
                {errors.salePrice ? (
                  <p className="text-sm text-danger">{errors.salePrice}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Stock</label>
                <Input
                  inputMode="numeric"
                  onChange={(event) => updateValues({ ...values, stock: event.target.value })}
                  value={values.stock}
                />
                {errors.stock ? <p className="text-sm text-danger">{errors.stock}</p> : null}
              </div>
            </div>
          </Card>

          <Card className="space-y-5 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Merchandising
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Category, brand, tags, and visibility
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  onChange={(event) =>
                    updateValues({ ...values, categoryId: event.target.value })
                  }
                  value={values.categoryId}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </Select>
                {errors.categoryId ? (
                  <p className="text-sm text-danger">{errors.categoryId}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Brand</label>
                <Select
                  onChange={(event) => updateValues({ ...values, brandId: event.target.value })}
                  value={values.brandId}
                >
                  <option value="">No brand</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.label}
                    </option>
                  ))}
                </Select>
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
                  {PRODUCT_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <Input
                  onChange={(event) => updateValues({ ...values, tags: event.target.value })}
                  placeholder="bags, leather, featured"
                  value={values.tags}
                />
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
              Feature this product on storefront surfaces
            </label>
          </Card>

          <Card className="space-y-5 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Media
                </p>
                <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                  Product images
                </h2>
              </div>
              <Button
                onClick={() =>
                  updateValues({
                    ...values,
                    images: [
                      ...values.images,
                      {
                        alt: "",
                        id: `image-${Date.now()}`,
                        isPrimary: values.images.length === 0,
                        publicId: "",
                        url: "",
                      },
                    ],
                  })
                }
                type="button"
                variant="outline"
              >
                Add image row
              </Button>
            </div>

            {cloudinaryReady ? (
              <div className="rounded-[1.4rem] border border-white/80 bg-white/72 p-4">
                <label className="text-sm font-medium">Upload with Cloudinary</label>
                <input
                  accept="image/*"
                  className="mt-3 block w-full text-sm"
                  multiple
                  onChange={(event) => void handleUpload(event)}
                  type="file"
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Uses your configured unsigned Cloudinary upload preset.
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Cloudinary upload is not configured yet. You can still paste image URLs
                manually below.
              </p>
            )}

            {errors.images ? <p className="text-sm text-danger">{errors.images}</p> : null}
            {isUploading ? (
              <p className="text-sm text-muted-foreground">Uploading image...</p>
            ) : null}

            <div className="space-y-4">
              {values.images.map((image, index) => (
                <div
                  key={image.id}
                  className="grid gap-4 rounded-[1.4rem] border border-white/80 bg-white/72 p-4 lg:grid-cols-[140px_minmax(0,1fr)]"
                >
                  <div className="overflow-hidden rounded-[1.2rem] bg-surface">
                    {image.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt={image.alt || `Product image ${index + 1}`}
                        className="aspect-square w-full object-cover"
                        src={image.url}
                      />
                    ) : (
                      <div className="aspect-square" />
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      onChange={(event) => setImage(image.id, { url: event.target.value })}
                      placeholder="Image URL"
                      value={image.url}
                    />
                    <Input
                      onChange={(event) => setImage(image.id, { alt: event.target.value })}
                      placeholder="Alt text"
                      value={image.alt}
                    />
                    <Input
                      className="sm:col-span-2"
                      onChange={(event) =>
                        setImage(image.id, { publicId: event.target.value })
                      }
                      placeholder="Cloudinary public ID (optional)"
                      value={image.publicId ?? ""}
                    />
                    <div className="sm:col-span-2 flex justify-end">
                      <Button
                        onClick={() =>
                          updateValues({
                            ...values,
                            images: values.images.filter(
                              (currentImage) => currentImage.id !== image.id,
                            ),
                          })
                        }
                        type="button"
                        variant="danger"
                      >
                        Remove image
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="space-y-5 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Specifications
                </p>
                <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                  Product facts
                </h2>
              </div>
              <Button
                onClick={() =>
                  updateValues({
                    ...values,
                    specifications: [
                      ...values.specifications,
                      { group: "", id: `spec-${Date.now()}`, label: "", value: "" },
                    ],
                  })
                }
                type="button"
                variant="outline"
              >
                Add specification
              </Button>
            </div>

            <div className="space-y-4">
              {values.specifications.map((specification) => (
                <div
                  key={specification.id}
                  className="grid gap-3 rounded-[1.4rem] border border-white/80 bg-white/72 p-4 sm:grid-cols-3"
                >
                  <Input
                    onChange={(event) =>
                      setSpecification(specification.id, { label: event.target.value })
                    }
                    placeholder="Label"
                    value={specification.label}
                  />
                  <Input
                    onChange={(event) =>
                      setSpecification(specification.id, { value: event.target.value })
                    }
                    placeholder="Value"
                    value={specification.value}
                  />
                  <div className="flex gap-3">
                    <Input
                      onChange={(event) =>
                        setSpecification(specification.id, { group: event.target.value })
                      }
                      placeholder="Group"
                      value={specification.group ?? ""}
                    />
                    <Button
                      onClick={() =>
                        updateValues({
                          ...values,
                          specifications: values.specifications.filter(
                            (currentSpecification) =>
                              currentSpecification.id !== specification.id,
                          ),
                        })
                      }
                      type="button"
                      variant="danger"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4 p-6">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Save
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-[-0.05em]">
              Publish this product
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              Draft products stay hidden from the storefront. Active products become
              available to the public catalog.
            </p>

            <Button
              disabled={isSaving || isUploading}
              onClick={async () => {
                const nextErrors = validateAdminProductForm(values);
                setErrors(nextErrors);
                setSubmitError(null);
                setSubmitSuccess(null);

                if (Object.keys(nextErrors).length > 0) {
                  return;
                }

                setIsSaving(true);

                try {
                  const response = await fetch(
                    mode === "create"
                      ? "/api/admin/products"
                      : `/api/admin/products/${productId}`,
                    {
                      body: JSON.stringify(values),
                      headers: { "Content-Type": "application/json" },
                      method: mode === "create" ? "POST" : "PATCH",
                    },
                  );

                  const payload = (await response.json()) as {
                    message?: string;
                    product?: { id: string };
                  };

                  if (!response.ok || !payload.product) {
                    throw new Error(payload.message ?? "Failed to save product.");
                  }

                  setSubmitSuccess(
                    mode === "create"
                      ? "Product created successfully."
                      : "Product updated successfully.",
                  );
                  router.push(`${ROUTES.admin.products}/${payload.product.id}`);
                  router.refresh();
                } catch (error) {
                  setSubmitError(
                    error instanceof Error ? error.message : "Failed to save product.",
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
                  ? "Create product"
                  : "Save changes"}
            </Button>

            {submitError ? <p className="text-sm text-danger">{submitError}</p> : null}
            {submitSuccess ? <p className="text-sm text-success">{submitSuccess}</p> : null}
          </Card>
        </div>
      </div>
    </div>
  );
}
