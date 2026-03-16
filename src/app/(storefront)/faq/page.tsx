import { StorePageHero } from "@/components/storefront";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { ROUTES } from "@/constants/routes";

const faqItems = [
  {
    question: "When will real product data be connected?",
    answer:
      "The storefront is intentionally static right now. This phase focuses on layout, visual hierarchy, and reusable UI structure.",
  },
  {
    question: "Will this support filters and sorting later?",
    answer:
      "Yes. The shop and category layouts were designed with space for filters, sorting controls, and merchandised product grids.",
  },
  {
    question: "Can the same design system work in admin screens?",
    answer:
      "Yes. The shared UI components were built to be reused across both the customer storefront and the admin dashboard.",
  },
] as const;

export default function FaqPage() {
  return (
    <>
      <StorePageHero
        breadcrumbs={[
          { label: "Home", href: ROUTES.storefront.home },
          { label: "FAQ" },
        ]}
        description="Helpful pre-sale and support content can live here, improving trust while reducing repetitive support requests."
        eyebrow="FAQ"
        title="Frequently asked questions"
      />
      <Container className="grid gap-6 py-12">
        {faqItems.map((item) => (
          <Card key={item.question} className="space-y-3">
            <h3 className="text-xl font-semibold tracking-tight">{item.question}</h3>
            <p className="text-body">{item.answer}</p>
          </Card>
        ))}
      </Container>
    </>
  );
}
