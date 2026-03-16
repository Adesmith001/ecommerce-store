import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/helpers/cn";

type PromoBannerProps = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
};

export function PromoBanner({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  secondaryLabel,
  secondaryHref,
  className,
}: PromoBannerProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[2rem] border border-border bg-[linear-gradient(135deg,rgba(37,99,235,0.96),rgba(30,64,175,0.92),rgba(249,115,22,0.88))] p-8 text-white shadow-xl sm:p-10 lg:p-12",
        className,
      )}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <Badge className="bg-white/15 text-white" variant="outline">
            {eyebrow}
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h2>
          <p className="max-w-xl text-base leading-7 text-white/80">{description}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            className={buttonVariants({
              className: "bg-white text-primary hover:bg-white/90",
              size: "lg",
            })}
            href={ctaHref}
          >
            {ctaLabel}
          </Link>
          {secondaryLabel && secondaryHref ? (
            <Link
              className={buttonVariants({
                className: "border border-white/30 bg-white/10 text-white hover:bg-white/15",
                size: "lg",
                variant: "outline",
              })}
              href={secondaryHref}
            >
              {secondaryLabel}
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}
