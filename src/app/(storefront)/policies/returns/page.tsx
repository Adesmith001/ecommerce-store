import { StorePageHero } from "@/components/storefront";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { ROUTES } from "@/constants/routes";

export default function ReturnsPolicyPage() {
  return (
    <>
      <StorePageHero
        breadcrumbs={[
          { label: "Home", href: ROUTES.storefront.home },
          { label: "Policies", href: ROUTES.storefront.policies },
          { label: "Returns Policy" },
        ]}
        description="Use this page for return windows, condition requirements, and refund expectations."
        eyebrow="Policy"
        title="Returns policy"
      />
      <Container className="py-12">
        <Card className="space-y-4">
          <p className="text-body">
            Placeholder content for returns and exchanges. This structure is ready for
            customer-friendly policy details once final copy is available.
          </p>
        </Card>
      </Container>
    </>
  );
}
