"use client";

import Link from "next/link";
import { CartSummary } from "@/components/storefront/cart/cart-summary";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/helpers/format-currency";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import {
  clearCart,
  removeFromCart,
  selectCartHydrated,
  selectCartItems,
  selectCartLineItemCount,
  selectCartPricing,
  selectCartTotalQuantity,
  updateCartItemQuantity,
} from "@/store/features/cart/cart-slice";

export function CartPageClient() {
  const dispatch = useAppDispatch();
  const hydrated = useAppSelector(selectCartHydrated);
  const items = useAppSelector(selectCartItems);
  const lineItemCount = useAppSelector(selectCartLineItemCount);
  const totalQuantity = useAppSelector(selectCartTotalQuantity);
  const pricing = useAppSelector(selectCartPricing);

  if (!hydrated) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Skeleton className="h-36 w-full rounded-[2.2rem]" />
          <Skeleton className="h-36 w-full rounded-[2.2rem]" />
        </div>
        <Skeleton className="h-96 w-full rounded-[2.2rem]" />
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
              className="grid gap-4 p-4 sm:grid-cols-[140px_minmax(0,1fr)] sm:p-5"
            >
              <div className="overflow-hidden rounded-[1.6rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.76),transparent_28%),linear-gradient(180deg,#f8f4ee,#ece4db)] p-3">
                {item.image?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={item.image.alt}
                    className="aspect-square w-full rounded-[1.2rem] object-cover"
                    src={item.image.url}
                  />
                ) : (
                  <div className="aspect-square rounded-[1.2rem] bg-[linear-gradient(180deg,#dbeafe,#f9fafb)]" />
                )}
              </div>

              <div className="flex flex-col justify-between gap-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <Link href={ROUTES.storefront.product(item.slug)}>
                      <h2 className="font-display text-2xl font-semibold tracking-[-0.05em] hover:text-primary">
                        {item.name}
                      </h2>
                    </Link>
                    <div className="text-sm text-muted-foreground">
                      <p>{item.category?.name ?? "Catalog"}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-display text-2xl font-semibold tracking-[-0.05em]">
                      {formatCurrency(unitPrice)}
                    </p>
                    {item.salePrice !== null ? (
                      <p className="text-sm text-muted-foreground line-through">
                        {formatCurrency(item.price)}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/80 px-3 py-2 shadow-[0_10px_24px_rgba(20,21,26,0.05)]">
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
                        {formatCurrency(lineSubtotal)}
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
          lineItemCount={lineItemCount}
          pricing={pricing}
          totalQuantity={totalQuantity}
        />
      </div>
    </div>
  );
}
