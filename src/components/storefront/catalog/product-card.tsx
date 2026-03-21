import Link from "next/link";
import { WishlistToggleButton } from "@/components/storefront/wishlist";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/helpers/format-currency";
import type { Product } from "@/types/catalog";

type ProductCardProps = {
  product: Product;
};

function getDiscountPercentage(price: number, salePrice: number) {
  return Math.round(((price - salePrice) / price) * 100);
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images[0];
  const hasDiscount =
    product.salePrice !== null && product.salePrice < product.price;
  const productHref = ROUTES.storefront.product(product.slug);

  return (
    <article className="group space-y-3">
      <div className="relative overflow-hidden rounded-[1.8rem] border border-border bg-[#ece8e1]">
        <Link href={productHref}>
          {primaryImage?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={primaryImage.alt}
              className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              src={primaryImage.url}
            />
          ) : (
            <div className="aspect-[4/5] bg-[linear-gradient(180deg,#ebe6de,#dcd5ca)]" />
          )}
        </Link>

        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {product.featured ? <Badge variant="secondary">Featured</Badge> : null}
          {hasDiscount ? (
            <Badge variant="danger">
              -{getDiscountPercentage(product.price, product.salePrice!)}%
            </Badge>
          ) : null}
        </div>

        <div className="absolute right-3 top-3">
          <WishlistToggleButton product={product} variant="ghost" />
        </div>
      </div>

      <div className="space-y-1 px-1">
        <p className="text-sm text-muted-foreground">
          {product.category?.name ?? "Catalog"}
        </p>
        <Link href={productHref}>
          <h3 className="font-display text-[1.45rem] font-bold tracking-[-0.06em] text-foreground">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-end justify-between gap-3">
          <div className="flex items-end gap-2">
            <span className="text-lg font-semibold text-foreground">
              {formatCurrency(product.salePrice ?? product.price)}
            </span>
            {hasDiscount ? (
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(product.price)}
              </span>
            ) : null}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.stock > 0 ? "In stock" : "Out of stock"}
          </span>
        </div>
      </div>
    </article>
  );
}
