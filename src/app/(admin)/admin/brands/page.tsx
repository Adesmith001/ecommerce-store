import { AdminBrandsList } from "@/components/admin";
import { listAdminBrands } from "@/lib/admin/admin-merchandising-service";

export default async function AdminBrandsPage() {
  const brands = await listAdminBrands();

  return <AdminBrandsList brands={brands} />;
}
