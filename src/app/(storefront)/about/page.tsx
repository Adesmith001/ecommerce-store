import { StoreContentBody, StorePageHero } from "@/components/storefront";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { ROUTES } from "@/constants/routes";
import { getStoreContentPage } from "@/lib/settings/store-settings-service";

export default async function AboutPage() {
  const page = await getStoreContentPage("about");

  return (
    <>
      <StorePageHero
        breadcrumbs={[
          { label: "Home", href: ROUTES.storefront.home },
          { label: page?.title || "About us" },
        ]}
        description={page?.description || ""}
        eyebrow={page?.eyebrow || "About"}
        title={page?.title || "About us"}
      />
      <Container className="py-12">
        <Card className="space-y-4">
          <StoreContentBody body={page?.body || ""} />
        </Card>
      </Container>
    </>
  );
}
