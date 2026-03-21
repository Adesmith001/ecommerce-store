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
  imageUrl?: string;
  imageAlt?: string;
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
  imageUrl,
  imageAlt,
  secondaryLabel,
  secondaryHref,
  className,
}: PromoBannerProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[2rem] border border-border bg-[linear-gradient(135deg,#f0ebe2,#fbf7f1_48%,#e5e1d9)] p-8 text-foreground shadow-[0_24px_70px_rgba(17,17,17,0.07)] sm:p-10 lg:p-12",
        className,
      )}
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-end">
        <div className="space-y-5">
          <Badge variant="outline">
            {eyebrow}
          </Badge>
          <h2 className="font-display max-w-3xl text-3xl font-bold uppercase tracking-[-0.08em] sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">{description}</p>
          <div className="flex flex-wrap gap-3">
            <Link
              className={buttonVariants({
                size: "lg",
              })}
              href={ctaHref}
            >
              {ctaLabel}
            </Link>
            {secondaryLabel && secondaryHref ? (
              <Link
                className={buttonVariants({
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

        {imageUrl ? (
          <div className="overflow-hidden rounded-[1.6rem] border border-border bg-white/70 p-3 backdrop-blur-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt={imageAlt ?? title}
              className="aspect-[4/5] w-full rounded-[1.3rem] object-cover"
              src={imageUrl}
            />
          </div>
        ) : (
          <div className="rounded-[1.6rem] border border-border bg-white/70 p-6 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
              {eyebrow}
            </p>
            <p className="font-display mt-4 text-3xl font-bold uppercase tracking-[-0.08em]">
              {title}
            </p>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
