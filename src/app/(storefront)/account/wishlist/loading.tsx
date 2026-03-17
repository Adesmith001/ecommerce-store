import { SectionWrapper, StorePageHero } from "@/components/storefront";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";

export default function WishlistLoading() {
  return (
    <>
      <StorePageHero
        breadcrumbs={[
          { label: "Home", href: ROUTES.storefront.home },
          { label: "Account", href: ROUTES.storefront.account },
          { label: "Wishlist" },
        ]}
        description="Loading your saved products."
        eyebrow="Account"
        title="Your wishlist"
      />
      <SectionWrapper>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-96 w-full rounded-4xl" />
          <Skeleton className="h-96 w-full rounded-4xl" />
          <Skeleton className="h-96 w-full rounded-4xl" />
        </div>
      </SectionWrapper>
    </>
  );
}
