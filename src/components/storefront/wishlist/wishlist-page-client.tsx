"use client";

import Link from "next/link";
import { useWishlist } from "@/components/providers/wishlist-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import { addToCart } from "@/store/features/cart/cart-slice";
import { useAppDispatch } from "@/hooks/use-redux";

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
        <Skeleton className="h-[470px] w-full rounded-[2.2rem]" />
        <Skeleton className="h-[470px] w-full rounded-[2.2rem]" />
        <Skeleton className="h-[470px] w-full rounded-[2.2rem]" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="space-y-4 p-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-danger">
            Wishlist unavailable
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
            We could not load your wishlist.
          </h2>
        </div>
        <p className="text-sm leading-7 text-muted-foreground">{error}</p>
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
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-[1.75rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.74),transparent_28%),linear-gradient(180deg,#f8f4ee,#ece4db)] p-4">
              {product.images[0]?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={product.images[0]?.alt ?? product.name}
                  className="h-full w-full rounded-[1.6rem] object-cover"
                  src={product.images[0].url}
                />
              ) : (
                <div className="h-full w-full rounded-[1.6rem] bg-[linear-gradient(180deg,#eff6ff,#f9fafb)]" />
              )}

              <div className="absolute inset-x-4 bottom-4">
                <div className="rounded-[1.5rem] border border-white/80 bg-white/82 p-4 backdrop-blur-md shadow-[0_16px_36px_rgba(20,21,26,0.08)]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    {product.category?.name ?? "Catalog"}
                  </p>
                  <Link href={ROUTES.storefront.product(product.slug)}>
                    <h2 className="font-display mt-3 text-2xl font-semibold tracking-[-0.05em] hover:text-primary">
                      {product.name}
                    </h2>
                  </Link>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {product.stock > 0 ? "In stock" : "Out of stock"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <div className="flex items-end gap-2">
                <span className="font-display text-2xl font-semibold tracking-[-0.05em]">
                  {formatPrice(product.salePrice ?? product.price)}
                </span>
                {hasDiscount ? (
                  <span className="pb-1 text-sm text-muted-foreground line-through">
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
