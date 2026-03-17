import { AdminCouponForm } from "@/components/admin";
import { getAdminCouponFormContext } from "@/lib/coupons/coupon-service";

export default async function AdminNewCouponPage() {
  const context = await getAdminCouponFormContext("create");

  return <AdminCouponForm {...context} />;
}
