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
        description="Explore the live catalog through an editorial product grid, with search, filters, and sorting tuned for modern fashion browsing."
        eyebrow="Shop"
        title="Browse the collection"
      />
      <SectionWrapper>
        <CatalogListingView />
      </SectionWrapper>
    </>
  );
}
