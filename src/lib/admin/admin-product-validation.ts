import type { AdminProductFormErrors, AdminProductFormValues } from "@/types/admin-product";

export function slugifyProductName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function validateAdminProductForm(
  values: AdminProductFormValues,
): AdminProductFormErrors {
  const errors: AdminProductFormErrors = {};
  const price = Number(values.price);
  const salePrice = values.salePrice.trim() ? Number(values.salePrice) : null;
  const stock = Number(values.stock);

  if (!values.name.trim()) {
    errors.name = "Product name is required.";
  }

  if (!values.categoryId) {
    errors.categoryId = "Category is required.";
  }

  if (!values.price.trim() || !Number.isFinite(price) || price < 0) {
    errors.price = "Enter a valid price.";
  }

  if (salePrice !== null && (!Number.isFinite(salePrice) || salePrice < 0)) {
    errors.salePrice = "Enter a valid sale price.";
  }

  if (salePrice !== null && Number.isFinite(price) && salePrice > price) {
    errors.salePrice = "Sale price cannot exceed the base price.";
  }

  if (!values.stock.trim() || !Number.isFinite(stock) || stock < 0) {
    errors.stock = "Enter a valid stock quantity.";
  }

  if (!values.shortDescription.trim()) {
    errors.shortDescription = "Short description is required.";
  }

  if (!values.fullDescription.trim()) {
    errors.fullDescription = "Full description is required.";
  }

  const usableImages = values.images.filter((image) => image.url.trim());

  if (usableImages.length === 0) {
    errors.images = "Add at least one product image.";
  }

  return errors;
}
