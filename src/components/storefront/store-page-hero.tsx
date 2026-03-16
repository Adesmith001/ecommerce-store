import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/storefront/breadcrumbs";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";

type StorePageHeroProps = {
  breadcrumbs: { label: string; href?: string }[];
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function StorePageHero({
  breadcrumbs,
  eyebrow,
  title,
  description,
  actions,
}: StorePageHeroProps) {
  return (
    <section className="border-b border-border bg-[linear-gradient(180deg,rgba(37,99,235,0.05),transparent)] py-10 sm:py-14">
      <Container className="space-y-6">
        <Breadcrumbs items={breadcrumbs} />
        <SectionHeading
          actions={actions}
          description={description}
          eyebrow={eyebrow}
          title={title}
        />
      </Container>
    </section>
  );
}
