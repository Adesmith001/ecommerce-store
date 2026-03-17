import type { Product } from "@/types/catalog";

export type WishlistEntry = {
  id: string;
  clerkId: string;
  productId: string;
  productSlug: string;
  entryKey: string;
  createdAt: string;
};

export type WishlistItem = {
  id: string;
  createdAt: string;
  product: Product;
};
