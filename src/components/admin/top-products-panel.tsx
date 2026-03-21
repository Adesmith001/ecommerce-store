import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { AdminTopProduct } from "@/types/admin";

type TopProductsPanelProps = {
  products: AdminTopProduct[];
};

export function TopProductsPanel({ products }: TopProductsPanelProps) {
  return (
    <Card className="space-y-5 rounded-[1.8rem] bg-white/60 p-6">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
          Top products
        </p>
        <h2 className="font-display mt-3 text-3xl font-bold uppercase tracking-[-0.08em]">
          Product leaders
        </h2>
      </div>

      {products.length === 0 ? (
        <div className="admin-subpanel border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
          No product data yet.
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="admin-subpanel flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="break-words font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {product.reviewCount} review{product.reviewCount === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {product.featured ? <Badge>Featured</Badge> : null}
                <Badge variant="outline">{product.stock} in stock</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
