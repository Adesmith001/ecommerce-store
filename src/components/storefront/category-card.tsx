import Link from "next/link";
import { Card } from "@/components/ui/card";

type CategoryCardProps = {
  description: string;
  href: string;
  imageUrl?: string | null;
  itemCount?: number;
  name: string;
};

export function CategoryCard({
  description,
  href,
  imageUrl,
  itemCount,
  name,
}: CategoryCardProps) {
  const itemCountLabel =
    typeof itemCount === "number"
      ? `${itemCount} item${itemCount === 1 ? "" : "s"}`
      : null;

  return (
    <Link href={href}>
      <Card className="group h-full overflow-hidden rounded-[1.8rem] bg-white/55 p-0">
        <div className="space-y-5 p-5 sm:p-6">
          <div className="relative overflow-hidden rounded-[1.5rem] border border-border bg-[#ece8e1]">
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={name}
                className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                src={imageUrl}
              />
            ) : (
              <div className="aspect-[4/3] bg-[linear-gradient(180deg,#ebe6de,#dcd5ca)]" />
            )}

            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
              <span className="rounded-full border border-border bg-white/82 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">
                {itemCountLabel ?? "Collection"}
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground bg-white text-lg transition group-hover:translate-x-1">
                →
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-3xl font-bold uppercase tracking-[-0.07em]">
              {name}
            </h3>
            <p className="text-sm leading-7 text-muted-foreground">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}
