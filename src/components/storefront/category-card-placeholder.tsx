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
      <Card className="group h-full overflow-hidden bg-[linear-gradient(180deg,white,rgba(243,244,246,0.9))]">
        <div className="flex h-full flex-col justify-between gap-8">
          <div className="flex h-32 items-start justify-between rounded-[1.5rem] bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.18),transparent_38%),#eff6ff] p-5">
            <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-primary">
              {itemCount}
            </span>
            <span className="text-2xl text-primary transition-transform group-hover:translate-x-1">
              →
            </span>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight">{name}</h3>
            <p className="text-sm leading-6 text-muted-foreground">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
