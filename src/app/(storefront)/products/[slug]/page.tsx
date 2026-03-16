import { notFound } from "next/navigation";
import { ProductCardPlaceholder, SectionWrapper, StorePageHero } from "@/components/storefront";
import { BEST_SELLERS, NEW_ARRIVALS } from "@/constants/storefront";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailsPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = [...BEST_SELLERS, ...NEW_ARRIVALS].find((item) =>
    item.href.endsWith(slug),
  );

  if (!product) {
    notFound();
  }

  const relatedProducts = [...BEST_SELLERS, ...NEW_ARRIVALS]
    .filter((item) => item.href !== product.href)
    .slice(0, 4);

  return (
    <>
      <StorePageHero
        breadcrumbs={[
          { label: "Home", href: ROUTES.storefront.home },
          { label: "Shop", href: ROUTES.storefront.shop },
          { label: product.name },
        ]}
        description="A polished PDP shell ready for future galleries, variant selectors, shipping details, and related merchandising."
        eyebrow="Product Details"
        title={product.name}
      />
      <SectionWrapper>
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
          <Card className="overflow-hidden p-0">
            <div className="aspect-square rounded-[1.5rem] bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.18),transparent_30%),linear-gradient(180deg,#dbeafe,#f9fafb)]" />
          </Card>
          <Card className="space-y-6">
            <div className="space-y-3">
              <Badge variant="secondary">{product.badge}</Badge>
              <div>
                <p className="text-sm text-muted-foreground">{product.category}</p>
                <h2 className="text-3xl font-semibold tracking-tight">{product.name}</h2>
              </div>
              <p className="text-2xl font-semibold text-primary">{product.price}</p>
              <p className="text-body">
                This detail page is intentionally static for now, but the layout is ready
                for real images, rich descriptions, stock signals, reviews, and add-to-cart
                behavior.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button className={buttonVariants({ size: "lg" })} type="button">
                Add to cart shell
              </button>
              <button
                className={buttonVariants({ size: "lg", variant: "outline" })}
                type="button"
              >
                Save item
              </button>
            </div>
            <div className="grid gap-3 rounded-[1.5rem] bg-surface p-5 text-sm text-muted-foreground">
              <p>Placeholder stock state: In stock</p>
              <p>Placeholder shipping note: Ships in 2-4 business days</p>
              <p>Placeholder SKU: SKU-{slug.toUpperCase()}</p>
            </div>
          </Card>
        </div>
      </SectionWrapper>
      <SectionWrapper
        description="Related items can later be powered by category, purchase patterns, or editorial curation."
        eyebrow="You may also like"
        title="Related products"
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {relatedProducts.map((item) => (
            <ProductCardPlaceholder key={item.href} {...item} />
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}
