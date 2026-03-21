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
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Skeleton className="h-[24rem] w-full rounded-[2rem]" />
          <Skeleton className="h-[24rem] w-full rounded-[2rem]" />
        </div>
        <Skeleton className="h-[28rem] w-full rounded-[2rem]" />
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
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-lg font-semibold uppercase tracking-[0.12em] text-foreground">
              Shopping bag
            </p>
            <Link
              className="rounded-[0.9rem] border border-border bg-white/65 px-4 py-2 text-sm uppercase tracking-[0.14em] text-muted-foreground"
              href={ROUTES.storefront.accountWishlist}
            >
              Favourites
            </Link>
          </div>
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
              className="grid gap-6 rounded-[1.8rem] bg-white/55 p-5 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]"
            >
              <div className="overflow-hidden rounded-[1.6rem] border border-border bg-[#ece8e1]">
                {item.image?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    alt={item.image.alt}
                    className="aspect-[4/5] w-full object-cover"
                    src={item.image.url}
                  />
                ) : (
                  <div className="aspect-[4/5] bg-[linear-gradient(180deg,#ebe6de,#dcd5ca)]" />
                )}
              </div>

              <div className="flex flex-col justify-between gap-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {item.category?.name ?? "Catalog"}
                    </p>
                    <Link href={ROUTES.storefront.product(item.slug)}>
                      <h2 className="font-display text-3xl font-bold tracking-[-0.07em] hover:text-primary">
                        {item.name}
                      </h2>
                    </Link>
                    <p className="text-sm uppercase tracking-[0.16em] text-muted-foreground">
                      Quantity {item.quantity}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-display text-3xl font-bold tracking-[-0.07em]">
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
                  <div className="inline-flex items-center gap-2 rounded-[1rem] border border-border bg-muted/60 p-2">
                    <Button
                      className="h-10 w-10 rounded-[0.85rem] px-0"
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
                    <span className="min-w-10 text-center text-sm font-semibold">
                      {item.quantity}
                    </span>
                    <Button
                      className="h-10 w-10 rounded-[0.85rem] px-0"
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
                      Subtotal{" "}
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
