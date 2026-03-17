import { AdminCategoryForm } from "@/components/admin";
import { getAdminCategoryFormContext } from "@/lib/admin/admin-merchandising-service";

export default async function AdminNewCategoryPage() {
  const context = await getAdminCategoryFormContext("create");

  return <AdminCategoryForm {...context} />;
}
