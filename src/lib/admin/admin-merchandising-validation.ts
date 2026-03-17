import type {
  BannerFormErrors,
  BannerFormValues,
  BrandFormErrors,
  BrandFormValues,
  CategoryFormErrors,
  CategoryFormValues,
} from "@/types/admin-merchandising";

export function slugifyMerchandisingName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validateCategoryForm(values: CategoryFormValues): CategoryFormErrors {
  const errors: CategoryFormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Category name is required.";
  }

  if (!values.slug.trim()) {
    errors.slug = "Category slug is required.";
  }

  if (!values.description.trim()) {
    errors.description = "Category description is required.";
  }

  return errors;
}

export function validateBrandForm(values: BrandFormValues): BrandFormErrors {
  const errors: BrandFormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Brand name is required.";
  }

  if (!values.slug.trim()) {
    errors.slug = "Brand slug is required.";
  }

  return errors;
}

export function validateBannerForm(values: BannerFormValues): BannerFormErrors {
  const errors: BannerFormErrors = {};
  const sortOrder = Number(values.sortOrder);

  if (!values.title.trim()) {
    errors.title = "Banner title is required.";
  }

  if (!values.subtitle.trim()) {
    errors.subtitle = "Banner subtitle is required.";
  }

  if (!values.ctaText.trim()) {
    errors.ctaText = "CTA text is required.";
  }

  if (!values.ctaLink.trim()) {
    errors.ctaLink = "CTA link is required.";
  }

  if (!values.image?.url?.trim()) {
    errors.image = "Banner image is required.";
  }

  if (!values.sortOrder.trim() || !Number.isFinite(sortOrder)) {
    errors.sortOrder = "Enter a valid sort order.";
  }

  return errors;
}
