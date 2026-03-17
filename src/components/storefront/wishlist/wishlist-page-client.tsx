"use client";

import Link from "next/link";
import { addToCart } from "@/store/features/cart/cart-slice";
import { useAppDispatch } from "@/hooks/use-redux";
import { useWishlist } from "@/components/providers/wishlist-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(value);
}

export function WishlistPageClient() {
  const dispatch = useAppDispatch();
  const { error, isLoading, isMutating, items, removeItem } = useWishlist();

  if (isLoading) {
    return (
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-96 w-full rounded-4xl" />
        <Skeleton className="h-96 w-full rounded-4xl" />
        <Skeleton className="h-96 w-full rounded-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="space-y-4 p-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-danger">
            Wishlist unavailable
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            We could not load your wishlist.
          </h2>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{error}</p>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        action={
          <Link href={ROUTES.storefront.shop}>
            <Button>Browse products</Button>
          </Link>
        }
        description="Save products you love and come back to them later from this page."
        title="Your wishlist is empty"
      />
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const product = item.product;
        const hasDiscount =
          product.salePrice !== null && product.salePrice < product.price;

        return (
          <Card key={item.id} className="overflow-hidden p-0">
            <div className="aspect-4/5 overflow-hidden bg-surface">
              {product.images[0]?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={product.images[0]?.alt ?? product.name}
                  className="h-full w-full object-cover"
                  src={product.images[0].url}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  No image
                </div>
              )}
            </div>

            <div className="space-y-4 p-5">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {product.category?.name ?? "Catalog"}
                </p>
                <Link href={ROUTES.storefront.product(product.slug)}>
                  <h2 className="text-xl font-semibold tracking-tight hover:text-primary">
                    {product.name}
                  </h2>
                </Link>
                <p className="text-sm text-muted-foreground">
                  {product.stock > 0 ? "In stock" : "Out of stock"}
                </p>
              </div>

              <div className="flex items-end gap-2">
                <span className="text-lg font-semibold">
                  {formatPrice(product.salePrice ?? product.price)}
                </span>
                {hasDiscount ? (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                ) : null}
              </div>

              <div className="grid gap-3">
                <Link href={ROUTES.storefront.product(product.slug)}>
                  <Button className="w-full" variant="outline">
                    View product
                  </Button>
                </Link>
                <Button
                  className="w-full"
                  disabled={product.stock <= 0 || isMutating}
                  onClick={() => {
                    dispatch(
                      addToCart({
                        product,
                        quantity: 1,
                      }),
                    );
                    void removeItem(product.id);
                  }}
                >
                  Move to cart
                </Button>
                <Button
                  className="w-full"
                  disabled={isMutating}
                  onClick={() => void removeItem(product.id)}
                  variant="danger"
                >
                  Remove item
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
