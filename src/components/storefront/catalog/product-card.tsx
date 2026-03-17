import Link from "next/link";
import { WishlistToggleButton } from "@/components/storefront/wishlist";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import type { Product } from "@/types/catalog";

type ProductCardProps = {
  product: Product;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(value);
}

function getDiscountPercentage(price: number, salePrice: number) {
  return Math.round(((price - salePrice) / price) * 100);
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images[0];
  const hasDiscount =
    product.salePrice !== null && product.salePrice < product.price;
  const productHref = ROUTES.storefront.product(product.slug);

  return (
    <Card className="group overflow-hidden p-0">
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[1.75rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.74),transparent_28%),linear-gradient(180deg,#f8f4ee,#ece4db)] p-4">
        {primaryImage?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={primaryImage.alt}
            className="h-full w-full rounded-[1.6rem] object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            src={primaryImage.url}
          />
        ) : (
          <div className="h-full w-full rounded-[1.6rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_30%),linear-gradient(180deg,#d7e9f6,#f5ede2)]" />
        )}

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {hasDiscount ? (
            <Badge variant="danger">
              -{getDiscountPercentage(product.price, product.salePrice!)}%
            </Badge>
          ) : null}
          {product.featured ? <Badge>Featured</Badge> : null}
        </div>

        <div className="absolute right-4 top-4">
          <WishlistToggleButton product={product} variant="ghost" />
        </div>

        <div className="absolute inset-x-4 bottom-4">
          <div className="rounded-[1.5rem] border border-white/80 bg-white/82 p-4 backdrop-blur-md shadow-[0_16px_36px_rgba(20,21,26,0.08)]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                {product.category?.name ?? "Catalog"}
              </p>
              <span className="rounded-full border border-white/80 bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {product.stock > 0 ? "In stock" : "Out of stock"}
              </span>
            </div>
            <Link href={productHref}>
              <h3 className="font-display mt-3 text-2xl font-semibold tracking-[-0.05em] hover:text-primary">
                {product.name}
              </h3>
            </Link>
          </div>
        </div>
      </div>

      <CardContent className="space-y-4 p-5">
        <div className="flex items-end justify-between gap-3">
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
          <div className="text-right text-sm">
            <p className="font-medium text-foreground">
              {product.ratingSummary.average.toFixed(1)} / 5
            </p>
            <p className="text-muted-foreground">
              {product.reviewCount} review{product.reviewCount === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          {product.shortDescription || "Premium silhouettes for modern everyday carry."}
        </p>

        <Link
          className={buttonVariants({ className: "w-full", variant: "outline" })}
          href={productHref}
        >
          View details
        </Link>
      </CardContent>
    </Card>
  );
}
