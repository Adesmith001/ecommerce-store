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
      <Card className="group h-full overflow-hidden p-0">
        <div className="flex h-full flex-col justify-between gap-8 p-5 sm:p-6">
          <div className="storefront-panel-dark relative overflow-hidden rounded-[1.1rem] p-5 text-left">
            <div className="flex items-start justify-between gap-4">
              <span className="storefront-tag">
                {itemCountLabel ?? "Collection"}
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-current bg-transparent text-lg transition-transform group-hover:translate-x-1">
                &rarr;
              </span>
            </div>
            {imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt={name}
                className="mt-6 aspect-[4/3] w-full rounded-[0.8rem] border-2 border-accent object-cover"
                src={imageUrl}
              />
            ) : (
              <div className="headline-marquee mt-8 text-accent/20">Category</div>
            )}
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
