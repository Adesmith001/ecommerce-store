import { AdminCouponsList } from "@/components/admin";
import { listAdminCoupons } from "@/lib/coupons/coupon-service";

export default async function AdminCouponsPage() {
  const coupons = await listAdminCoupons();

  return <AdminCouponsList coupons={coupons} />;
}
