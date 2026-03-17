import { AdminProductForm } from "@/components/admin";
import { getAdminProductFormContext } from "@/lib/admin/admin-product-service";

export default async function AdminNewProductPage() {
  const context = await getAdminProductFormContext("create");

  return <AdminProductForm {...context} />;
}
