import { StorePageHero, SectionWrapper } from "@/components/storefront";
import { WishlistPageClient } from "@/components/storefront/wishlist";
import { ROUTES } from "@/constants/routes";
import { requireAuthenticatedUser } from "@/lib/auth/guards";

export default async function WishlistPage() {
  await requireAuthenticatedUser(ROUTES.storefront.wishlist);

  return (
    <>
      <StorePageHero
        breadcrumbs={[
          { label: "Home", href: ROUTES.storefront.home },
          { label: "Account", href: ROUTES.storefront.account },
          { label: "Wishlist" },
        ]}
        description="Keep track of saved products, revisit them later, or move them straight into your cart."
        eyebrow="Account"
        title="Your wishlist"
      />
      <SectionWrapper>
        <WishlistPageClient />
      </SectionWrapper>
    </>
  );
}
