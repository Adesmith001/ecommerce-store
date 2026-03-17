import { AdminBannerForm } from "@/components/admin";
import { getAdminBannerFormContext } from "@/lib/admin/admin-merchandising-service";

export default async function AdminNewBannerPage() {
  const context = await getAdminBannerFormContext("create");

  return <AdminBannerForm {...context} />;
}
