import { StoreContentBody, StorePageHero } from "@/components/storefront";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { ROUTES } from "@/constants/routes";
import { getStoreContentPage } from "@/lib/settings/store-settings-service";

export default async function PrivacyPolicyPage() {
  const page = await getStoreContentPage("privacy-policy");

  return (
    <>
      <StorePageHero
        breadcrumbs={[
          { label: "Home", href: ROUTES.storefront.home },
          { label: "Policies", href: ROUTES.storefront.policies },
          { label: page?.title || "Privacy policy" },
        ]}
        description={page?.description || ""}
        eyebrow={page?.eyebrow || "Policy"}
        title={page?.title || "Privacy policy"}
      />
      <Container className="py-12">
        <Card className="space-y-4">
          <StoreContentBody body={page?.body || ""} />
        </Card>
      </Container>
    </>
  );
}
