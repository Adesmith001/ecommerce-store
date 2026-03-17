import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ProductCardPlaceholderProps = {
  name: string;
  category: string;
  price: string;
  badge?: string;
  href: string;
};

export function ProductCardPlaceholder({
  name,
  category,
  price,
  badge,
  href,
}: ProductCardPlaceholderProps) {
  return (
    <Card className="group overflow-hidden p-0">
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[1.75rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.74),transparent_28%),linear-gradient(180deg,#f8f4ee,#ece4db)] p-5">
        {badge ? (
          <div className="absolute left-4 top-4">
            <Badge variant="secondary">{badge}</Badge>
          </div>
        ) : null}

        <div className="headline-marquee absolute -bottom-2 left-4">Bag</div>

        <div className="relative flex h-full items-end">
          <div className="w-full rounded-[1.8rem] border border-white/80 bg-white/70 p-5 shadow-[0_18px_40px_rgba(20,21,26,0.08)] transition-transform duration-300 group-hover:-translate-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              {category}
            </p>
            <h3 className="font-display mt-3 text-2xl font-semibold tracking-[-0.05em]">
              {name}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Structured silhouettes and elevated everyday function.
            </p>
          </div>
        </div>
      </div>

      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{category}</p>
            <p className="font-display text-xl font-semibold tracking-[-0.04em]">
              {price}
            </p>
          </div>
          <span className="rounded-full border border-success/15 bg-success/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-success">
            In stock
          </span>
        </div>
        <Link
          className={buttonVariants({ className: "w-full", variant: "outline" })}
          href={href}
        >
          View details
        </Link>
      </CardContent>
    </Card>
  );
}
