import { StoreContentBody, StorePageHero } from "@/components/storefront";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { ROUTES } from "@/constants/routes";
import { getStoreContentPage } from "@/lib/settings/store-settings-service";

export default async function TermsPolicyPage() {
  const page = await getStoreContentPage("terms-and-conditions");

  return (
    <>
      <StorePageHero
        breadcrumbs={[
          { label: "Home", href: ROUTES.storefront.home },
          { label: "Policies", href: ROUTES.storefront.policies },
          { label: page?.title || "Terms and conditions" },
        ]}
        description={page?.description || ""}
        eyebrow={page?.eyebrow || "Policy"}
        title={page?.title || "Terms and conditions"}
      />
      <Container className="py-12">
        <Card className="space-y-4">
          <StoreContentBody body={page?.body || ""} />
        </Card>
      </Container>
    </>
  );
}
