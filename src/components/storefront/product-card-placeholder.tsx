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
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[1.5rem] bg-[linear-gradient(180deg,#eff6ff,#e5e7eb)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.22),transparent_35%)]" />
        {badge ? (
          <div className="absolute left-4 top-4">
            <Badge variant="secondary">{badge}</Badge>
          </div>
        ) : null}
        <div className="absolute inset-x-6 bottom-6 rounded-3xl border border-white/60 bg-white/75 p-4 backdrop-blur">
          <p className="text-sm font-medium text-muted-foreground">{category}</p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight">{name}</h3>
        </div>
      </div>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{category}</p>
            <p className="text-base font-semibold">{price}</p>
          </div>
          <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            In Stock
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
