import { AdminBannersList } from "@/components/admin";
import { listAdminBanners } from "@/lib/admin/admin-merchandising-service";

export default async function AdminBannersPage() {
  const banners = await listAdminBanners();

  return <AdminBannersList banners={banners} />;
}
