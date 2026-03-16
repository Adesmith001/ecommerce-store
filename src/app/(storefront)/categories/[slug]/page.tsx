import { notFound } from "next/navigation";
import {
  Breadcrumbs,
  ProductCardPlaceholder,
  SectionWrapper,
  StorePageHero,
} from "@/components/storefront";
import { BEST_SELLERS, FEATURED_CATEGORIES, NEW_ARRIVALS } from "@/constants/storefront";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { ROUTES } from "@/constants/routes";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = FEATURED_CATEGORIES.find((item) => item.href.endsWith(slug));

  if (!category) {
    notFound();
  }

  const products = [...BEST_SELLERS, ...NEW_ARRIVALS].slice(0, 4);

  return (
    <>
      <StorePageHero
        breadcrumbs={[
          { label: "Home", href: ROUTES.storefront.home },
          { label: "Categories", href: ROUTES.storefront.categories },
          { label: category.name },
        ]}
        description={category.description}
        eyebrow="Category"
        title={category.name}
      />
      <SectionWrapper>
        <div className="grid gap-6 lg:grid-cols-[0.28fr_0.72fr]">
          <Card className="h-fit space-y-4">
            <h3 className="text-lg font-semibold">Browsing shell</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              This sidebar area can later host category filters, merchandising copy,
              or collection-specific promotions.
            </p>
            <Breadcrumbs
              items={[
                { label: "Shop", href: ROUTES.storefront.shop },
                { label: category.name },
              ]}
            />
          </Card>
          <div className="grid gap-6 md:grid-cols-2">
            {products.map((product) => (
              <ProductCardPlaceholder key={product.href} {...product} />
            ))}
          </div>
        </div>
      </SectionWrapper>
      <Container className="pb-20">
        <Card className="p-8">
          <p className="text-sm text-muted-foreground">
            Category slug: <span className="font-medium text-foreground">{slug}</span>
          </p>
        </Card>
      </Container>
    </>
  );
}
