import { notFound } from "next/navigation";
import { AdminCouponForm } from "@/components/admin";
import {
  getAdminCouponById,
  getAdminCouponFormContext,
} from "@/lib/coupons/coupon-service";

type AdminEditCouponPageProps = {
  params: Promise<{ couponId: string }>;
};

export default async function AdminEditCouponPage({
  params,
}: AdminEditCouponPageProps) {
  const { couponId } = await params;
  const coupon = await getAdminCouponById(couponId);

  if (!coupon) {
    notFound();
  }

  const context = await getAdminCouponFormContext("edit", couponId);

  return <AdminCouponForm {...context} />;
}
