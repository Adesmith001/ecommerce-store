import type { ReactNode } from "react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/helpers/cn";

type SectionWrapperProps = {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function SectionWrapper({
  children,
  eyebrow,
  title,
  description,
  actions,
  className,
  contentClassName,
}: SectionWrapperProps) {
  return (
    <section className={cn("section-space", className)}>
      <Container className={cn("space-y-8", contentClassName)}>
        {title ? (
          <SectionHeading
            actions={actions}
            description={description}
            eyebrow={eyebrow}
            title={title}
          />
        ) : null}
        {children}
      </Container>
    </section>
  );
}
