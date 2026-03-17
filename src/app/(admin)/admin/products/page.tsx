import { AdminProductsList } from "@/components/admin";
import { listAdminProducts } from "@/lib/admin/admin-product-service";

export default async function AdminProductsPage() {
  const products = await listAdminProducts();

  return <AdminProductsList products={products} />;
}
