import { SectionWrapper, StorePageHero } from "@/components/storefront";
import { Skeleton } from "@/components/ui/skeleton";
import { ROUTES } from "@/constants/routes";

export default function OrdersLoading() {
  return (
    <>
      <StorePageHero
        breadcrumbs={[
          { label: "Home", href: ROUTES.storefront.home },
          { label: "Orders" },
        ]}
        description="Loading your order history."
        eyebrow="My orders"
        title="Order history"
      />
      <SectionWrapper>
        <div className="space-y-5">
          <Skeleton className="h-56 w-full rounded-4xl" />
          <Skeleton className="h-56 w-full rounded-4xl" />
        </div>
      </SectionWrapper>
    </>
  );
}
