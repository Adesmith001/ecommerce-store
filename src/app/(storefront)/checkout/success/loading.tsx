import { SectionWrapper, StorePageHero } from "@/components/storefront";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutSuccessLoading() {
  return (
    <>
      <StorePageHero
        breadcrumbs={[{ label: "Checkout" }, { label: "Verifying payment" }]}
        description="We are verifying your payment with the provider."
        eyebrow="Payment"
        title="Confirming your order"
      />
      <SectionWrapper>
        <div className="mx-auto max-w-3xl space-y-4">
          <Skeleton className="h-70 w-full rounded-4xl" />
        </div>
      </SectionWrapper>
    </>
  );
}
