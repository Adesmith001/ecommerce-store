import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/storefront/catalog";
import { ProductPurchaseActions } from "@/components/storefront/product/product-purchase-actions";
import { ProductReviewsSection } from "@/components/storefront/reviews";
import { SectionWrapper, StorePageHero } from "@/components/storefront";
import { ProductGallery } from "@/components/storefront/product/product-gallery";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { getReviewDataForProduct, getReviewEligibility } from "@/lib/reviews/review-service";
import type { ReviewEligibility, ReviewSummary } from "@/types/review";

type ProductDetailsPageProps = {
  params: Promise<{ slug: string }>;
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
        eyebrow="Product Details"
        title={product.name}
      />

      <SectionWrapper className="pb-12">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <ProductGallery images={product.images} productName={product.name} />

          <div className="space-y-6">
            <div className="space-y-4">
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

              <div className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight">
                  {product.name}
                </h1>
                <p className="text-base leading-7 text-muted-foreground">
                  {product.shortDescription}
                </p>
              </div>

              <div className="flex flex-wrap items-end gap-3">
                <span className="text-3xl font-semibold text-foreground">
                  {formatPrice(product.salePrice ?? product.price)}
                </span>
                {hasDiscount ? (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.price)}
                  </span>
                ) : null}
              </div>

              <div className="grid gap-3 rounded-3xl bg-surface p-5 text-sm sm:grid-cols-2">
                <div>
                  <p className="text-muted-foreground">Rating</p>
                  <p className="mt-1 font-semibold">
                    {reviewSummary.averageRating.toFixed(1)} /{" "}
                    {product.ratingSummary.max.toFixed(0)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Reviews</p>
                  <p className="mt-1 font-semibold">{reviewSummary.totalReviews}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">SKU</p>
                  <p className="mt-1 font-semibold">{product.sku}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Brand</p>
                  <p className="mt-1 font-semibold">
                    {product.brand?.name ?? "Unbranded"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Category</p>
                  <p className="mt-1 font-semibold">
                    {product.category?.name ?? "Catalog"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Availability</p>
                  <p className="mt-1 font-semibold">
                    {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
                  </p>
                </div>
              </div>
            </div>

            <ProductPurchaseActions product={product} />

            <Card className="space-y-4">
              <h2 className="text-xl font-semibold">Product details</h2>
              <p className="text-body">{product.fullDescription}</p>
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
              <Card className="space-y-2">
                <p className="text-sm font-medium">Delivery</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Shipping details and delivery estimates will plug in here later.
                </p>
              </Card>
              <Card className="space-y-2">
                <p className="text-sm font-medium">Returns</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Easy return policy placeholder ready for final support content.
                </p>
              </Card>
              <Card className="space-y-2">
                <p className="text-sm font-medium">Secure payment</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Secure checkout reassurance placeholder for future payment flow.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper
        className="pt-0"
        description="Specifications are rendered from the catalog data layer so they can later map directly from Appwrite."
        eyebrow="Specifications"
        title="What to know before you buy"
      >
        <Card className="overflow-hidden p-0">
          <div className="divide-y divide-border">
            {product.specifications.length > 0 ? (
              product.specifications.map((specification) => (
                <div
                  key={specification.id}
                  className="grid gap-2 px-5 py-4 sm:grid-cols-[220px_minmax(0,1fr)]"
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
        description="Reviews are tied to verified purchased products so the storefront feedback stays useful and credible."
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
        className="pt-0 pb-20"
        description="Related products currently prioritize the same category, then the same brand, then shared tags."
        eyebrow="Related Products"
        title="You may also like"
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
