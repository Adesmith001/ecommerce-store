import type { ProductStatus } from "@/types/catalog";

export const PRODUCT_STATUS_OPTIONS: {
  label: string;
  value: ProductStatus;
}[] = [
  { label: "Draft", value: "draft" },
  { label: "Active", value: "active" },
  { label: "Archived", value: "archived" },
];

export const PRODUCT_LOW_STOCK_THRESHOLD = 5;
