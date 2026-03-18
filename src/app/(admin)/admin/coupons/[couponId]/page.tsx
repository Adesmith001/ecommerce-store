import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AdminArchiveRecordButton,
  AdminCouponStatusBadge,
} from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/helpers/format-currency";
import { getAdminCouponById } from "@/lib/coupons/coupon-service";

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminCouponDetailPage({
  params,
}: {
  params: Promise<{ couponId: string }>;
}) {
  const { couponId } = await params;
  const coupon = await getAdminCouponById(couponId);

  if (!coupon) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-5 p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <AdminCouponStatusBadge coupon={coupon} />
              <span className="rounded-full border border-white/80 bg-white/72 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {coupon.discountType === "percentage"
                  ? `${coupon.discountValue}% off`
                  : `${formatCurrency(coupon.discountValue)} off`}
              </span>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Coupon details
              </p>
              <h1 className="font-display mt-3 text-4xl font-semibold tracking-[-0.06em]">
                {coupon.code}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Updated {formatDate(coupon.updatedAt)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href={ROUTES.admin.coupons}>
              <Button variant="outline">Back to list</Button>
            </Link>
            <Link href={`${ROUTES.admin.coupons}/${coupon.id}/edit`}>
              <Button variant="outline">Edit coupon</Button>
            </Link>
            {coupon.active ? (
              <AdminArchiveRecordButton
                actionLabel="Disable coupon"
                confirmMessage="Disable this coupon? Existing orders will keep their historical totals."
                endpoint={`/api/admin/coupons/${coupon.id}`}
                label="Coupon"
              />
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 text-sm sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[1.3rem] border border-white/80 bg-white/72 p-4">
            <p className="text-muted-foreground">Minimum spend</p>
            <p className="mt-1 font-medium">{formatCurrency(coupon.minimumSpend)}</p>
          </div>
          <div className="rounded-[1.3rem] border border-white/80 bg-white/72 p-4">
            <p className="text-muted-foreground">Usage count</p>
            <p className="mt-1 font-medium">{coupon.usageCount}</p>
          </div>
          <div className="rounded-[1.3rem] border border-white/80 bg-white/72 p-4">
            <p className="text-muted-foreground">Usage limit</p>
            <p className="mt-1 font-medium">
              {coupon.usageLimit === null ? "Unlimited" : coupon.usageLimit}
            </p>
          </div>
          <div className="rounded-[1.3rem] border border-white/80 bg-white/72 p-4">
            <p className="text-muted-foreground">Created</p>
            <p className="mt-1 font-medium">{formatDate(coupon.createdAt)}</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card className="space-y-4 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Validity
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Schedule
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.3rem] border border-white/80 bg-white/72 p-4">
                <p className="text-muted-foreground">Starts</p>
                <p className="mt-1 font-medium">{formatDate(coupon.startDate)}</p>
              </div>
              <div className="rounded-[1.3rem] border border-white/80 bg-white/72 p-4">
                <p className="text-muted-foreground">Ends</p>
                <p className="mt-1 font-medium">{formatDate(coupon.endDate)}</p>
              </div>
            </div>
          </Card>

          <Card className="space-y-4 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Restrictions
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Applicability
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.3rem] border border-white/80 bg-white/72 p-4">
                <p className="text-muted-foreground">Category slugs</p>
                <p className="mt-1 text-sm font-medium">
                  {coupon.restrictedCategorySlugs.join(", ") || "All categories"}
                </p>
              </div>
              <div className="rounded-[1.3rem] border border-white/80 bg-white/72 p-4">
                <p className="text-muted-foreground">Product IDs</p>
                <p className="mt-1 text-sm font-medium">
                  {coupon.restrictedProductIds.join(", ") || "All products"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="space-y-4 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                Rule summary
              </p>
              <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
                Promotion logic
              </h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Discount type</span>
                <span className="font-medium">{coupon.discountType}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Discount value</span>
                <span className="font-medium">
                  {coupon.discountType === "percentage"
                    ? `${coupon.discountValue}%`
                    : formatCurrency(coupon.discountValue)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Current status</span>
                <span className="font-medium">{coupon.active ? "Enabled" : "Disabled"}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
