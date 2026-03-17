import { Badge } from "@/components/ui/badge";
import type { MerchandisingStatus } from "@/types/catalog";

type AdminMerchandisingStatusBadgeProps = {
  status: MerchandisingStatus;
};

export function AdminMerchandisingStatusBadge({
  status,
}: AdminMerchandisingStatusBadgeProps) {
  if (status === "archived") {
    return <Badge variant="outline">Archived</Badge>;
  }

  return (
    <span className="rounded-full border border-success/15 bg-success/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-success">
      Active
    </span>
  );
}
