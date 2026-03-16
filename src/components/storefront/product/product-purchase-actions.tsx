"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/store/features/cart/cart-slice";
import { useAppDispatch } from "@/hooks/use-redux";
import { QuantitySelector } from "@/components/storefront/product/quantity-selector";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import type { Product } from "@/types/catalog";

type ProductPurchaseActionsProps = {
  product: Product;
};

export function ProductPurchaseActions({
  product,
}: ProductPurchaseActionsProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const maxQuantity = useMemo(() => Math.max(product.stock, 1), [product.stock]);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        product,
        quantity,
      }),
    );
  };

  const handleBuyNow = () => {
    dispatch(
      addToCart({
        product,
        quantity,
      }),
    );
    router.push(ROUTES.storefront.cart);
  };

  return (
    <div className="space-y-6">
      <QuantitySelector
        max={maxQuantity}
        onChange={setQuantity}
        value={quantity}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Button disabled={isOutOfStock} onClick={handleAddToCart} size="lg">
          Add to Cart
        </Button>
        <Button
          disabled={isOutOfStock}
          onClick={handleBuyNow}
          size="lg"
          variant="secondary"
        >
          Buy Now
        </Button>
        <Button size="lg" variant="outline">
          Add to Wishlist
        </Button>
      </div>
    </div>
  );
}
