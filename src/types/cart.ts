import type { Product } from "@/types/catalog";

export type CartItem = {
  category: Product["category"];
  image: Product["images"][number] | null;
  name: string;
  price: number;
  productId: string;
  quantity: number;
  salePrice: number | null;
  sku: string;
  slug: string;
  stock: number;
};

export type AddToCartPayload = {
  product: Product;
  quantity: number;
};
