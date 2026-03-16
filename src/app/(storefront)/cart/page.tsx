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
        description="Review your selected products, update quantities, and prepare the data that checkout will consume next."
        eyebrow="Cart"
        title="Your shopping cart"
      />
      <SectionWrapper>
        <CartPageClient />
      </SectionWrapper>
    </>
  );
}
