import { CartPageClient } from "@/components/storefront/cart/cart-page-client";
import { SectionWrapper, StorePageHero } from "@/components/storefront";
import { ROUTES } from "@/constants/routes";

export default function CartPage() {
  return (
    <>
      <StorePageHero
        breadcrumbs={[
          { label: "Home", href: ROUTES.storefront.home },
          { label: "Cart" },
        ]}
        description="Review your selected pieces, adjust quantities, and move into checkout through the same calm editorial flow."
        eyebrow="Cart"
        title="Your shopping bag"
      />
      <SectionWrapper>
        <CartPageClient />
      </SectionWrapper>
    </>
  );
}
