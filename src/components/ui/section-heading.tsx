import type { ReactNode } from "react";
import { cn } from "@/helpers/cn";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  actions,
  align = "left",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div className={cn("space-y-5", centered && "text-center", className)}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <div className={cn("space-y-3", centered && "mx-auto max-w-3xl")}>
        <h2 className="text-heading max-w-4xl">{title}</h2>
        {description ? <p className="text-body">{description}</p> : null}
      </div>
      {actions ? (
        <div className={cn("flex flex-wrap gap-3", centered && "justify-center")}>
          {actions}
        </div>
      ) : null}
    </div>
  );
}
