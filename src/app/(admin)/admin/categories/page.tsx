import { AdminCategoriesList } from "@/components/admin";
import { listAdminCategories } from "@/lib/admin/admin-merchandising-service";

export default async function AdminCategoriesPage() {
  const categories = await listAdminCategories();

  return <AdminCategoriesList categories={categories} />;
}
