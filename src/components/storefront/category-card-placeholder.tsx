import Link from "next/link";
import { Card } from "@/components/ui/card";

type CategoryCardPlaceholderProps = {
  name: string;
  description: string;
  itemCount: string;
  href: string;
};

export function CategoryCardPlaceholder({
  name,
  description,
  itemCount,
  href,
}: CategoryCardPlaceholderProps) {
  return (
    <Link href={href}>
      <Card className="group h-full overflow-hidden p-0">
        <div className="flex h-full flex-col justify-between gap-8 p-5 sm:p-6">
          <div className="relative overflow-hidden rounded-[1.75rem] bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.12),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.12),transparent_42%),linear-gradient(180deg,#fcfaf7,#efe8df)] p-5">
            <div className="flex items-start justify-between gap-4">
              <span className="rounded-full border border-white/80 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {itemCount}
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white/75 text-lg transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
            <div className="headline-marquee mt-8">Edit</div>
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-2xl font-semibold tracking-[-0.05em]">
              {name}
            </h3>
            <p className="text-sm leading-7 text-muted-foreground">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
