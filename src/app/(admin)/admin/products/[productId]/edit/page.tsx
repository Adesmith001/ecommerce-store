import { notFound } from "next/navigation";
import { AdminProductForm } from "@/components/admin";
import { getAdminProductById, getAdminProductFormContext } from "@/lib/admin/admin-product-service";

type AdminEditProductPageProps = {
  params: Promise<{ productId: string }>;
};

export default async function AdminEditProductPage({
  params,
}: AdminEditProductPageProps) {
  const { productId } = await params;
  const product = await getAdminProductById(productId);

  if (!product) {
    notFound();
  }

  const context = await getAdminProductFormContext("edit", productId);

  return <AdminProductForm {...context} />;
}
