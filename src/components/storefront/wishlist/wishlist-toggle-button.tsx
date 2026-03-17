"use client";

import { cn } from "@/helpers/cn";
import { useWishlist } from "@/components/providers/wishlist-provider";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/catalog";

type WishlistToggleButtonProps = {
  className?: string;
  product: Product;
  showLabel?: boolean;
  variant?: "ghost" | "outline";
};

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill={filled ? "currentColor" : "none"}
      viewBox="0 0 24 24"
    >
      <path
        d="M12 20s-6.5-3.9-9-8.3C1 8.4 2.8 5 6.5 5c2.1 0 3.6 1.1 4.5 2.5C11.9 6.1 13.4 5 15.5 5 19.2 5 21 8.4 21 11.7 18.5 16.1 12 20 12 20Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WishlistToggleButton({
  className,
  product,
  showLabel = false,
  variant = "outline",
}: WishlistToggleButtonProps) {
  const { isLoading, isMutating, isWishlisted, toggleItem } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  if (variant === "ghost") {
    return (
      <button
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/88 text-foreground shadow-[0_12px_24px_rgba(20,21,26,0.08)] transition hover:scale-[1.02]",
          wishlisted ? "text-danger" : "text-foreground",
          className,
        )}
        disabled={isLoading || isMutating}
        onClick={() => void toggleItem(product)}
        type="button"
      >
        <HeartIcon filled={wishlisted} />
      </button>
    );
  }

  return (
    <Button
      className={cn(wishlisted ? "border-danger/30 text-danger hover:bg-danger/5" : "", className)}
      disabled={isLoading || isMutating}
      onClick={() => void toggleItem(product)}
      size="lg"
      variant="outline"
    >
      <HeartIcon filled={wishlisted} />
      {showLabel ? (wishlisted ? "Saved to Wishlist" : "Add to Wishlist") : null}
    </Button>
  );
}
