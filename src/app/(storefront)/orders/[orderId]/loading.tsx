import { SectionWrapper, StorePageHero } from "@/components/storefront";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetailLoading() {
  return (
    <>
      <StorePageHero
        breadcrumbs={[{ label: "Orders" }, { label: "Loading" }]}
        description="Loading your order details."
        eyebrow="Order details"
        title="Loading order"
      />
      <SectionWrapper>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <Skeleton className="h-60 w-full rounded-4xl" />
            <Skeleton className="h-60 w-full rounded-4xl" />
            <Skeleton className="h-96 w-full rounded-4xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 w-full rounded-4xl" />
            <Skeleton className="h-64 w-full rounded-4xl" />
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
