import { StorePageHero } from "@/components/storefront";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { ROUTES } from "@/constants/routes";

export default function PrivacyPolicyPage() {
  return (
    <>
      <StorePageHero
        breadcrumbs={[
          { label: "Home", href: ROUTES.storefront.home },
          { label: "Policies", href: ROUTES.storefront.policies },
          { label: "Privacy Policy" },
        ]}
        description="Use this page for data handling, cookies, and customer privacy commitments."
        eyebrow="Policy"
        title="Privacy policy"
      />
      <Container className="py-12">
        <Card className="space-y-4">
          <p className="text-body">
            Placeholder content for privacy disclosures and data handling practices.
            You can replace this with reviewed legal copy later.
          </p>
        </Card>
      </Container>
    </>
  );
}
