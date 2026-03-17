import type { ProductStatus } from "@/types/catalog";

export type AdminInventoryProduct = {
  id: string;
  name: string;
  sku: string;
  stock: number;
  status: ProductStatus;
  categoryName: string;
  updatedAt: string;
  isLowStock: boolean;
  isOutOfStock: boolean;
};

export type AdminInventoryFilter = "all" | "low-stock" | "out-of-stock" | "active";
