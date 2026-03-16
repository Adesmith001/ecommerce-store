import { StorePageHero } from "@/components/storefront";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/constants/routes";

export default function ContactPage() {
  return (
    <>
      <StorePageHero
        breadcrumbs={[
          { label: "Home", href: ROUTES.storefront.home },
          { label: "Contact" },
        ]}
        description="A simple support and brand-contact shell that can later connect to forms, live chat, or customer service workflows."
        eyebrow="Contact"
        title="We’re here to help"
      />
      <Container className="grid gap-6 py-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="space-y-4">
          <h3 className="text-xl font-semibold">Customer service</h3>
          <p className="text-body">
            Reach out for order questions, product guidance, or wholesale interest.
          </p>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Email: hello@asterstore.example</p>
            <p>Phone: +1 (555) 240-1984</p>
            <p>Hours: Monday to Saturday, 9:00 AM - 6:00 PM</p>
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
