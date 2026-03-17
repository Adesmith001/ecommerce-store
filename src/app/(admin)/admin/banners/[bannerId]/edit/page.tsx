import { notFound } from "next/navigation";
import { AdminBannerForm } from "@/components/admin";
import {
  getAdminBannerById,
  getAdminBannerFormContext,
} from "@/lib/admin/admin-merchandising-service";

type AdminEditBannerPageProps = {
  params: Promise<{ bannerId: string }>;
};

export default async function AdminEditBannerPage({
  params,
}: AdminEditBannerPageProps) {
  const { bannerId } = await params;
  const banner = await getAdminBannerById(bannerId);

  if (!banner) {
    notFound();
  }

  const context = await getAdminBannerFormContext("edit", bannerId);

  return <AdminBannerForm {...context} />;
}
