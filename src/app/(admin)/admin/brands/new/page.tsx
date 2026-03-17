import { AdminBrandForm } from "@/components/admin";
import { getAdminBrandFormContext } from "@/lib/admin/admin-merchandising-service";

export default async function AdminNewBrandPage() {
  const context = await getAdminBrandFormContext("create");

  return <AdminBrandForm {...context} />;
}
