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
    <section className="section-space pb-4 pt-8">
      <Container>
        <div className="grid gap-6 border-b border-border/70 pb-8 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-end">
          <div className="space-y-5">
            <Breadcrumbs items={breadcrumbs} />
            <SectionHeading
              actions={actions}
              description={description}
              eyebrow={eyebrow}
              title={title}
            />
          </div>

          <div className="hidden justify-self-end lg:block">
            <div className="rounded-[1.5rem] border border-border bg-white/60 px-6 py-5 text-right">
              <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                Curated edit
              </p>
              <p className="font-display mt-2 text-4xl font-bold tracking-[-0.08em]">
                XIV
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Quiet luxury layouts for discovery, detail, and checkout.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
