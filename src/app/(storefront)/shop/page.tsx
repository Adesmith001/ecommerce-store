import { CatalogListingView } from "@/components/storefront/catalog";
import { SectionWrapper, StorePageHero } from "@/components/storefront";
import { ROUTES } from "@/constants/routes";

export default function ShopPage() {
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
        <CatalogListingView />
      </SectionWrapper>
    </>
  );
}
