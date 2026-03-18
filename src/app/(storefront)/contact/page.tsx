import { StorePageHero } from "@/components/storefront";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/constants/routes";
import { getStoreSettings } from "@/lib/settings/store-settings-service";

export default async function ContactPage() {
  const settings = await getStoreSettings();

  return (
    <>
      <StorePageHero
        breadcrumbs={[
          { label: "Home", href: ROUTES.storefront.home },
          { label: "Contact" },
        ]}
        description={settings.supportText}
        eyebrow="Contact"
        title="We're here to help"
      />
      <Container className="grid gap-6 py-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="space-y-4">
          <h3 className="text-xl font-semibold">Customer service</h3>
          <p className="text-body">{settings.supportText}</p>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Email: {settings.contactEmail}</p>
            <p>Phone: {settings.phoneNumber}</p>
            <p>Currency: {settings.currencyCode}</p>
          </div>
        </Card>
        <Card className="space-y-4">
          <h3 className="text-xl font-semibold">Send us a message</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input placeholder="Full name" />
            <Input placeholder="Email address" type="email" />
          </div>
          <Input placeholder="Subject" />
          <Textarea placeholder="Tell us how we can help..." />
          <div>
            <Button size="lg">Submit placeholder</Button>
          </div>
        </Card>
      </Container>
    </>
  );
}
