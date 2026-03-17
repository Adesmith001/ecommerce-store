import { notFound } from "next/navigation";
import { AdminCategoryForm } from "@/components/admin";
import {
  getAdminCategoryById,
  getAdminCategoryFormContext,
} from "@/lib/admin/admin-merchandising-service";

type AdminEditCategoryPageProps = {
  params: Promise<{ categoryId: string }>;
};

export default async function AdminEditCategoryPage({
  params,
}: AdminEditCategoryPageProps) {
  const { categoryId } = await params;
  const category = await getAdminCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  const context = await getAdminCategoryFormContext("edit", categoryId);

  return <AdminCategoryForm {...context} />;
}
