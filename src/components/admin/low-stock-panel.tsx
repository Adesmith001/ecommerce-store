import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { AdminLowStockProduct } from "@/types/admin";

type LowStockPanelProps = {
  products: AdminLowStockProduct[];
};

export function LowStockPanel({ products }: LowStockPanelProps) {
  return (
    <Card className="space-y-5 p-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Low stock alerts
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
          Inventory watchlist
        </h2>
      </div>

      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          No low stock alerts right now.
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col gap-3 rounded-[1.4rem] border border-white/80 bg-white/72 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="break-words font-medium">{product.name}</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="danger">{product.stock} left</Badge>
                <Badge variant="outline">{product.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
