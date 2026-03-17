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
        "overflow-hidden rounded-[2.5rem] border border-foreground/10 bg-[linear-gradient(135deg,#17181d,#2d3139_58%,#2563eb_110%)] p-8 text-white shadow-[0_34px_90px_rgba(20,21,26,0.24)] sm:p-10 lg:p-12",
        className,
      )}
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-end">
        <div className="space-y-5">
          <Badge className="border-white/10 bg-white/10 text-white" variant="outline">
            {eyebrow}
          </Badge>
          <h2 className="font-display max-w-3xl text-3xl font-semibold tracking-[-0.06em] sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="max-w-2xl text-base leading-7 text-white/72">{description}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              className={buttonVariants({
                className:
                  "border-white bg-white text-foreground hover:bg-white/90",
                size: "lg",
              })}
              href={ctaHref}
            >
              {ctaLabel}
            </Link>
            {secondaryLabel && secondaryHref ? (
              <Link
                className={buttonVariants({
                  className:
                    "border border-white/25 bg-white/10 text-white hover:bg-white/15",
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

        <div className="grid gap-3">
          <div className="rounded-[1.8rem] border border-white/10 bg-white/8 p-5 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.24em] text-white/55">
              Campaign code
            </p>
            <p className="font-display mt-2 text-3xl font-semibold tracking-[-0.06em]">
              BAG20
            </p>
          </div>
          <div className="rounded-[1.8rem] border border-white/10 bg-white/8 p-5 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.24em] text-white/55">
              Included
            </p>
            <p className="mt-2 text-sm leading-6 text-white/75">
              Signature wrapping, delivery updates, and thoughtful support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
