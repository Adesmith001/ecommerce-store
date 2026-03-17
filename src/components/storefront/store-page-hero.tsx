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
    <section className="section-space pb-6 pt-2">
      <Container>
        <div className="editorial-panel overflow-hidden px-6 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
            <div className="space-y-6">
              <Breadcrumbs items={breadcrumbs} />
              <SectionHeading
                actions={actions}
                description={description}
                eyebrow={eyebrow}
                title={title}
              />
            </div>

            <div className="hidden justify-self-end lg:block">
              <div className="rounded-[2rem] border border-white/80 bg-white/70 px-6 py-5 text-right shadow-[0_14px_34px_rgba(20,21,26,0.05)]">
                <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                  Curated edit
                </p>
                <p className="font-display mt-3 text-3xl font-semibold tracking-[-0.06em]">
                  24/7
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Discovery, account, and checkout under one design language.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
