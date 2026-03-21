import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/storefront/catalog";
import { Breadcrumbs } from "@/components/storefront/breadcrumbs";
import { SectionWrapper } from "@/components/storefront/section-wrapper";
import { ProductGallery } from "@/components/storefront/product/product-gallery";
import { ProductPurchaseActions } from "@/components/storefront/product/product-purchase-actions";
import { ProductReviewsSection } from "@/components/storefront/reviews";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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

  const highlightSpecs = product.specifications.slice(0, 3);

  return (
    <>
      <SectionWrapper className="pb-10 pt-8">
        <div className="space-y-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/shop" },
              { label: product.name },
            ]}
          />

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_420px]">
            <ProductGallery images={product.images} productName={product.name} />

            <div className="space-y-6">
              <Card className="space-y-6 rounded-[2rem] bg-white/55 p-6 sm:p-7">
                <div className="flex flex-wrap gap-2">
                  {product.featured ? <Badge variant="secondary">Featured</Badge> : null}
                  {hasDiscount ? (
                    <Badge variant="danger">
                      Save {getDiscountPercentage(product.price, product.salePrice!)}%
                    </Badge>
                  ) : null}
                  <Badge variant="outline">
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {product.category?.name ?? "Catalog"}
                    </p>
                    <h1 className="font-display mt-3 text-4xl font-bold uppercase tracking-[-0.08em] sm:text-5xl">
                      {product.name}
                    </h1>
                  </div>
                  <p className="text-base leading-7 text-muted-foreground">
                    {product.shortDescription}
                  </p>
                </div>

                <div className="flex flex-wrap items-end gap-3">
                  <span className="font-display text-4xl font-bold tracking-[-0.08em] text-foreground">
                    {formatCurrency(product.salePrice ?? product.price)}
                  </span>
                  {hasDiscount ? (
                    <span className="pb-1 text-lg text-muted-foreground line-through">
                      {formatCurrency(product.price)}
                    </span>
                  ) : null}
                  <span className="pb-1 text-sm uppercase tracking-[0.16em] text-muted-foreground">
                    MRP incl. of all taxes
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.2rem] border border-border bg-muted/55 p-4">
                    <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
                      Rating
                    </p>
                    <p className="mt-3 text-lg font-semibold">
                      {reviewSummary.averageRating.toFixed(1)} / 5
                    </p>
                  </div>
                  <div className="rounded-[1.2rem] border border-border bg-muted/55 p-4">
                    <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
                      Reviews
                    </p>
                    <p className="mt-3 text-lg font-semibold">
                      {reviewSummary.totalReviews}
                    </p>
                  </div>
                  <div className="rounded-[1.2rem] border border-border bg-muted/55 p-4">
                    <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
                      Brand
                    </p>
                    <p className="mt-3 text-lg font-semibold">
                      {product.brand?.name ?? "Studio line"}
                    </p>
                  </div>
                </div>

                {product.tags.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                      Highlights
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}

                <ProductPurchaseActions product={product} />
              </Card>

              <div className="grid gap-4">
                <Card className="rounded-[1.6rem] bg-white/45">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                    Description
                  </p>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">
                    {product.fullDescription}
                  </p>
                </Card>

                <div className="grid gap-4 sm:grid-cols-3">
                  {highlightSpecs.length > 0
                    ? highlightSpecs.map((specification) => (
                        <Card
                          key={specification.id}
                          className="rounded-[1.4rem] bg-white/45 p-5"
                        >
                          <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
                            {specification.label}
                          </p>
                          <p className="mt-3 text-sm font-semibold text-foreground">
                            {specification.value}
                          </p>
                        </Card>
                      ))
                    : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper
        className="pt-0"
        description="Technical details remain connected to the product record so you can expand catalog depth without revisiting the layout."
        eyebrow="Specifications"
        title="Everything worth knowing"
      >
        <Card className="overflow-hidden rounded-[1.8rem] bg-white/55 p-0">
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
