import { Card } from "@/components/ui/card";

export default function AdminCustomersPage() {
  return (
    <Card className="space-y-4 p-6">
      <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
        Customers
      </p>
      <h2 className="font-display text-3xl font-semibold tracking-[-0.05em]">
        Customer workspace placeholder
      </h2>
      <p className="text-sm leading-7 text-muted-foreground">
        This route is ready for customer lookup, profile support tools, and future
        segmentation views.
      </p>
    </Card>
  );
}
