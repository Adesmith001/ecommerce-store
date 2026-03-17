import { Badge } from "@/components/ui/badge";
import type { ProductStatus } from "@/types/catalog";

type AdminProductStatusBadgeProps = {
  status: ProductStatus;
};

export function AdminProductStatusBadge({
  status,
}: AdminProductStatusBadgeProps) {
  if (status === "active") {
    return <Badge variant="primary">Active</Badge>;
  }

  if (status === "archived") {
    return <Badge variant="danger">Archived</Badge>;
  }

  return <Badge variant="outline">Draft</Badge>;
}
