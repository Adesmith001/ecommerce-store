import { AdminInventoryList } from "@/components/admin";
import { listAdminInventoryProducts } from "@/lib/admin/admin-inventory-service";

export default async function AdminInventoryPage() {
  const products = await listAdminInventoryProducts();

  return <AdminInventoryList products={products} />;
}
