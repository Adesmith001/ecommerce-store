import { notFound } from "next/navigation";
import { AdminBrandForm } from "@/components/admin";
import {
  getAdminBrandById,
  getAdminBrandFormContext,
} from "@/lib/admin/admin-merchandising-service";

type AdminEditBrandPageProps = {
  params: Promise<{ brandId: string }>;
};

export default async function AdminEditBrandPage({
  params,
}: AdminEditBrandPageProps) {
  const { brandId } = await params;
  const brand = await getAdminBrandById(brandId);

  if (!brand) {
    notFound();
  }

  const context = await getAdminBrandFormContext("edit", brandId);

  return <AdminBrandForm {...context} />;
}
