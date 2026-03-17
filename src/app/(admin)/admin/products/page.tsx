import { Card } from "@/components/ui/card";

export default function AdminProductsPage() {
  return (
    <Card className="space-y-4 p-6">
      <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
        Products
      </p>
      <h2 className="font-display text-3xl font-semibold tracking-[-0.05em]">
        Catalog workspace placeholder
      </h2>
      <p className="text-sm leading-7 text-muted-foreground">
        This route is ready for product CRUD, inventory controls, and media management
        in the next admin chunk.
      </p>
    </Card>
  );
}
