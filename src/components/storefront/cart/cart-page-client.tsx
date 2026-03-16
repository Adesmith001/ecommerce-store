"use client";

import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import {
  clearCart,
  removeFromCart,
  selectCartEstimatedTotal,
  selectCartHydrated,
  selectCartItems,
  selectCartLineItemCount,
  selectCartSubtotal,
  selectCartTotalQuantity,
  updateCartItemQuantity,
} from "@/store/features/cart/cart-slice";
import { CartSummary } from "@/components/storefront/cart/cart-summary";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(value);
}

export function CartPageClient() {
  const dispatch = useAppDispatch();
  const hydrated = useAppSelector(selectCartHydrated);
  const items = useAppSelector(selectCartItems);
  const lineItemCount = useAppSelector(selectCartLineItemCount);
  const totalQuantity = useAppSelector(selectCartTotalQuantity);
  const subtotal = useAppSelector(selectCartSubtotal);
  const estimatedTotal = useAppSelector(selectCartEstimatedTotal);

  if (!hydrated) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-[2rem]" />
          <Skeleton className="h-32 w-full rounded-[2rem]" />
        </div>
        <Skeleton className="h-80 w-full rounded-[2rem]" />
      </div>
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
        description="Your cart is empty right now. Add products from a product page and they will appear here automatically."
        title="Your cart is empty"
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {lineItemCount} item{lineItemCount === 1 ? "" : "s"} in cart
          </p>
          <Button onClick={() => dispatch(clearCart())} variant="outline">
            Clear cart
          </Button>
        </div>

        {items.map((item) => {
          const unitPrice = item.salePrice ?? item.price;
          const lineSubtotal = unitPrice * item.quantity;

          return (
            <Card
              key={item.productId}
              className="grid gap-4 p-4 sm:grid-cols-[120px_minmax(0,1fr)] sm:p-5"
            >
              <div className="overflow-hidden rounded-[1.5rem] border border-border bg-[linear-gradient(180deg,#eff6ff,#f9fafb)]">
                {item.image?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={item.image.alt}
                    className="aspect-square w-full object-cover"
                    src={item.image.url}
                  />
                ) : (
                  <div className="aspect-square bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.16),transparent_28%),linear-gradient(180deg,#dbeafe,#f9fafb)]" />
                )}
              </div>

              <div className="flex flex-col justify-between gap-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <Link href={ROUTES.storefront.product(item.slug)}>
                      <h2 className="text-lg font-semibold tracking-tight hover:text-primary">
                        {item.name}
                      </h2>
                    </Link>
                    <div className="text-sm text-muted-foreground">
                      <p>SKU: {item.sku}</p>
                      <p>{item.category?.name ?? "Catalog"}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-semibold">{formatPrice(unitPrice)}</p>
                    {item.salePrice !== null ? (
                      <p className="text-sm text-muted-foreground line-through">
                        {formatPrice(item.price)}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="inline-flex items-center gap-3 rounded-full border border-border bg-white px-3 py-2">
                    <Button
                      className="h-9 w-9 rounded-full px-0"
                      disabled={item.quantity <= 1}
                      onClick={() =>
                        dispatch(
                          updateCartItemQuantity({
                            productId: item.productId,
                            quantity: item.quantity - 1,
                          }),
                        )
                      }
                      size="sm"
                      variant="outline"
                    >
                      -
                    </Button>
                    <span className="min-w-8 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <Button
                      className="h-9 w-9 rounded-full px-0"
                      disabled={item.quantity >= item.stock}
                      onClick={() =>
                        dispatch(
                          updateCartItemQuantity({
                            productId: item.productId,
                            quantity: Math.min(item.stock, item.quantity + 1),
                          }),
                        )
                      }
                      size="sm"
                      variant="outline"
                    >
                      +
                    </Button>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                      Subtotal:{" "}
                      <span className="font-semibold text-foreground">
                        {formatPrice(lineSubtotal)}
                      </span>
                    </p>
                    <Button
                      onClick={() => dispatch(removeFromCart(item.productId))}
                      size="sm"
                      variant="outline"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div>
        <CartSummary
          estimatedTotal={estimatedTotal}
          lineItemCount={lineItemCount}
          subtotal={subtotal}
          totalQuantity={totalQuantity}
        />
      </div>
    </div>
  );
}
