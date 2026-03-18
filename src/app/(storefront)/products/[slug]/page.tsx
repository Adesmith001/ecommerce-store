import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/storefront/catalog";
import { ProductGallery } from "@/components/storefront/product/product-gallery";
import { ProductPurchaseActions } from "@/components/storefront/product/product-purchase-actions";
import { ProductReviewsSection } from "@/components/storefront/reviews";
import { SectionWrapper, StorePageHero } from "@/components/storefront";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/helpers/format-currency";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import {
  getReviewDataForProduct,
  getReviewEligibility,
} from "@/lib/reviews/review-service";
import type { ReviewEligibility, ReviewSummary } from "@/types/review";

type ProductDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

function getDiscountPercentage(price: number, salePrice: number) {
  return Math.round(((price - salePrice) / price) * 100);
}

export default async function ProductDetailsPage({
  params,
}: ProductDetailsPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.slug, 4);
  const hasDiscount =
    product.salePrice !== null && product.salePrice < product.price;
  const { userId } = await auth();
  let reviewLoadError: string | null = null;
  let reviewSummary: ReviewSummary = {
    averageRating: product.ratingSummary.average,
    totalReviews: product.reviewCount,
    breakdown: [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: 0,
      percentage: 0,
    })),
  };
  let reviewEligibility: ReviewEligibility = {
    alreadyReviewed: false,
    canSubmit: false,
    reason: userId ? "not-purchased" : "not-authenticated",
  };
  let reviews = [] as Awaited<ReturnType<typeof getReviewDataForProduct>>["reviews"];

  try {
    const [reviewData, eligibility] = await Promise.all([
      getReviewDataForProduct(product.id),
      getReviewEligibility({
        clerkId: userId ?? null,
        productId: product.id,
      }),
    ]);

    reviews = reviewData.reviews;
    reviewSummary = reviewData.summary;
    reviewEligibility = eligibility;
  } catch (error) {
    reviewLoadError =
      error instanceof Error ? error.message : "Failed to load product reviews.";
  }

  return (
    <>
      <StorePageHero
        breadcrumbs={[
          { label: "Home", href: ROUTES.storefront.home },
          { label: "Shop", href: ROUTES.storefront.shop },
          { label: product.name },
        ]}
        description={product.shortDescription}
        eyebrow="Product details"
        title={product.name}
      />

      <SectionWrapper className="pb-12">
        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <ProductGallery images={product.images} productName={product.name} />

          <div className="space-y-6">
            <div className="editorial-panel p-6 sm:p-8">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {product.featured ? <Badge>Featured</Badge> : null}
                  {hasDiscount ? (
                    <Badge variant="danger">
                      Save {getDiscountPercentage(product.price, product.salePrice!)}%
                    </Badge>
                  ) : null}
                  <Badge variant="outline">
                    {product.stock > 0 ? "In stock" : "Out of stock"}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <h1 className="font-display text-4xl font-semibold tracking-[-0.06em] sm:text-5xl">
                    {product.name}
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-muted-foreground">
                    {product.shortDescription}
                  </p>
                </div>

                <div className="flex flex-wrap items-end gap-3">
                  <span className="font-display text-4xl font-semibold tracking-[-0.06em] text-foreground">
                    {formatCurrency(product.salePrice ?? product.price)}
                  </span>
                  {hasDiscount ? (
                    <span className="pb-1 text-lg text-muted-foreground line-through">
                      {formatCurrency(product.price)}
                    </span>
                  ) : null}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.6rem] border border-white/80 bg-white/72 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      Rating
                    </p>
                    <p className="font-display mt-3 text-2xl font-semibold tracking-[-0.05em]">
                      {reviewSummary.averageRating.toFixed(1)} /{" "}
                      {product.ratingSummary.max.toFixed(0)}
                    </p>
                  </div>
                  <div className="rounded-[1.6rem] border border-white/80 bg-white/72 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      Reviews
                    </p>
                    <p className="font-display mt-3 text-2xl font-semibold tracking-[-0.05em]">
                      {reviewSummary.totalReviews}
                    </p>
                  </div>
                  <div className="rounded-[1.6rem] border border-white/80 bg-white/72 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                      Availability
                    </p>
                    <p className="mt-3 text-sm font-semibold">
                      {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                    </p>
                  </div>
                </div>

                <ProductPurchaseActions product={product} />
              </div>
            </div>

            <Card className="space-y-5">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Product narrative
                </p>
                <h2 className="font-display text-2xl font-semibold tracking-[-0.05em]">
                  Details and construction
                </h2>
              </div>
              <p className="text-body">{product.fullDescription}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-white/80 bg-white/72 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Brand
                  </p>
                  <p className="mt-3 text-sm font-semibold">
                    {product.brand?.name ?? "Unbranded"}
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-white/80 bg-white/72 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Category
                  </p>
                  <p className="mt-3 text-sm font-semibold">
                    {product.category?.name ?? "Catalog"}
                  </p>
                </div>
              </div>
              {product.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : null}
            </Card>

            <div className="grid gap-4 sm:grid-cols-3">
              <Card className="space-y-3 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Delivery
                </p>
                <h3 className="font-display text-xl font-semibold tracking-[-0.05em]">
                  Signature shipping
                </h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  Delivery timing and carrier details can slot in here without
                  redesigning the product page later.
                </p>
              </Card>
              <Card className="space-y-3 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Returns
                </p>
                <h3 className="font-display text-xl font-semibold tracking-[-0.05em]">
                  Easy exchanges
                </h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  Return-policy messaging stays close to the buy action for calmer
                  customer reassurance.
                </p>
              </Card>
              <Card className="space-y-3 p-5">
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                  Payment
                </p>
                <h3 className="font-display text-xl font-semibold tracking-[-0.05em]">
                  Secure checkout
                </h3>
                <p className="text-sm leading-7 text-muted-foreground">
                  Payment trust remains visible but understated, matching the rest of
                  the premium flow.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper
        className="pt-0"
        description="Specifications are rendered from the catalog data layer so they can grow without changing the layout."
        eyebrow="Specifications"
        title="Everything shoppers may want to know"
      >
        <Card className="overflow-hidden p-0">
          <div className="divide-y divide-border/70">
            {product.specifications.length > 0 ? (
              product.specifications.map((specification) => (
                <div
                  key={specification.id}
                  className="grid gap-2 px-5 py-4 sm:grid-cols-[220px_minmax(0,1fr)] sm:px-6"
                >
                  <p className="text-sm font-medium text-muted-foreground">
                    {specification.label}
                  </p>
                  <p className="text-sm text-foreground">{specification.value}</p>
                </div>
              ))
            ) : (
              <div className="px-5 py-4 text-sm text-muted-foreground">
                Specifications will appear here once they are added to the catalog.
              </div>
            )}
          </div>
        </Card>
      </SectionWrapper>

      <SectionWrapper
        className="pt-0"
        description="Reviews are tied to verified purchases so the feedback stays useful and credible."
        eyebrow="Reviews"
        title="What customers are saying"
      >
        <ProductReviewsSection
          initialEligibility={reviewEligibility}
          initialLoadError={reviewLoadError}
          initialReviews={reviews}
          initialSummary={reviewSummary}
          productId={product.id}
        />
      </SectionWrapper>

      <SectionWrapper
        className="pb-20 pt-0"
        description="Related products prioritize the same category, then the same brand, then shared tags."
        eyebrow="Related products"
        title="Continue the collection"
      >
        {relatedProducts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        ) : (
          <Card className="p-8 text-sm text-muted-foreground">
            Related products will appear here as the catalog grows.
          </Card>
        )}
      </SectionWrapper>
    </>
  );
}
