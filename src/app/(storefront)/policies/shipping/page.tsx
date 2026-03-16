import { StorePageHero } from "@/components/storefront";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { ROUTES } from "@/constants/routes";

export default function ShippingPolicyPage() {
  return (
    <>
      <StorePageHero
        breadcrumbs={[
          { label: "Home", href: ROUTES.storefront.home },
          { label: "Policies", href: ROUTES.storefront.policies },
          { label: "Shipping Policy" },
        ]}
        description="Use this page for processing times, delivery windows, and destination coverage."
        eyebrow="Policy"
        title="Shipping policy"
      />
      <Container className="py-12">
        <Card className="space-y-4">
          <p className="text-body">
            Placeholder content for shipping rules, delivery timelines, and handling
            expectations. The layout is ready for production policy copy later.
          </p>
        </Card>
      </Container>
    </>
  );
}
