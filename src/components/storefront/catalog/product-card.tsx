import Link from "next/link";
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
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[1.5rem] bg-[linear-gradient(180deg,#eff6ff,#f9fafb)]">
        {primaryImage?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={primaryImage.alt}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            src={primaryImage.url}
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.16),transparent_28%),linear-gradient(180deg,#dbeafe,#f9fafb)]" />
        )}

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {hasDiscount ? (
            <Badge variant="danger">
              -{getDiscountPercentage(product.price, product.salePrice!)}%
            </Badge>
          ) : null}
          {product.featured ? <Badge>Featured</Badge> : null}
        </div>
      </div>

      <CardContent className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-muted-foreground">
                {product.category?.name ?? "Catalog"}
              </p>
              <Link href={productHref}>
                <h3 className="mt-1 text-lg font-semibold tracking-tight hover:text-primary">
                  {product.name}
                </h3>
              </Link>
            </div>
            <span className="shrink-0 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-muted-foreground">
              {product.stock > 0 ? "In stock" : "Out of stock"}
            </span>
          </div>

          <div className="flex items-end gap-2">
            <span className="text-lg font-semibold text-foreground">
              {formatPrice(product.salePrice ?? product.price)}
            </span>
            {hasDiscount ? (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.price)}
              </span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="font-medium text-foreground">
            ★ {product.ratingSummary.average.toFixed(1)}
          </span>
          <span className="text-muted-foreground">
            {product.reviewCount} review{product.reviewCount === 1 ? "" : "s"}
          </span>
        </div>

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
