import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { AdminTopProduct } from "@/types/admin";

type TopProductsPanelProps = {
  products: AdminTopProduct[];
};

export function TopProductsPanel({ products }: TopProductsPanelProps) {
  return (
    <Card className="space-y-5 p-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Top products
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
          Placeholder leaders
        </h2>
      </div>

      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          No product data yet.
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between gap-4 rounded-[1.4rem] border border-white/80 bg-white/72 px-4 py-4"
            >
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {product.reviewCount} review{product.reviewCount === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex items-center gap-2">
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
