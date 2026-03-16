import Link from "next/link";
import { StorePageHero } from "@/components/storefront";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { ROUTES } from "@/constants/routes";

const policyLinks = [
  { label: "Shipping Policy", href: ROUTES.storefront.shippingPolicy },
  { label: "Returns Policy", href: ROUTES.storefront.returnsPolicy },
  { label: "Privacy Policy", href: ROUTES.storefront.privacyPolicy },
] as const;

export default function PoliciesPage() {
  return (
    <>
      <StorePageHero
        breadcrumbs={[
          { label: "Home", href: ROUTES.storefront.home },
          { label: "Policies" },
        ]}
        description="Policy pages build customer trust and provide important pre-purchase clarity."
        eyebrow="Policies"
        title="Store policies"
      />
      <Container className="grid gap-6 py-12 md:grid-cols-2 xl:grid-cols-3">
        {policyLinks.map((policy) => (
          <Link key={policy.href} href={policy.href}>
            <Card className="h-full space-y-3">
              <h3 className="text-xl font-semibold">{policy.label}</h3>
              <p className="text-body">
                Placeholder policy page ready for legal and support content.
              </p>
            </Card>
          </Link>
        ))}
      </Container>
    </>
  );
}
