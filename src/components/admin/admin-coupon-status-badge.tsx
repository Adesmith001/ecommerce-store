import type { CouponRecord } from "@/types/coupon";

export function AdminCouponStatusBadge({
  coupon,
}: {
  coupon: Pick<CouponRecord, "active" | "endDate" | "startDate">;
}) {
  const now = new Date();
  const startDate = new Date(coupon.startDate);
  const endDate = new Date(coupon.endDate);
  const isExpired = endDate.getTime() < now.getTime();
  const isScheduled = startDate.getTime() > now.getTime();

  const tone = !coupon.active || isExpired
    ? "border-border bg-white/75 text-muted-foreground"
    : isScheduled
      ? "border-accent/20 bg-accent/10 text-accent"
      : "border-success/20 bg-success/10 text-success";
  const label = !coupon.active
    ? "Disabled"
    : isExpired
      ? "Expired"
      : isScheduled
        ? "Scheduled"
        : "Active";

  return (
    <span
      className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${tone}`}
    >
      {label}
    </span>
  );
}
