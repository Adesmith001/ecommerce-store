import { ProductCardPlaceholder, SectionWrapper, StorePageHero } from "@/components/storefront";
import { BEST_SELLERS, NEW_ARRIVALS } from "@/constants/storefront";
import { ROUTES } from "@/constants/routes";

export default function ShopPage() {
  const products = [...BEST_SELLERS, ...NEW_ARRIVALS];

  return (
    <>
      <StorePageHero
        breadcrumbs={[
          { label: "Home", href: ROUTES.storefront.home },
          { label: "Shop" },
        ]}
        description="A scalable product listing shell with room for filters, sorting, merchandising controls, and search results later."
        eyebrow="Shop"
        title="Browse the storefront"
      />
      <SectionWrapper>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCardPlaceholder key={`${product.name}-${product.badge}`} {...product} />
          ))}
        </div>
      </SectionWrapper>
    </>
  );
}
