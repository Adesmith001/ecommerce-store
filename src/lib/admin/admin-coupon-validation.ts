import { normalizeCouponCode } from "@/lib/coupons/coupon-pricing";
import type {
  AdminCouponFormErrors,
  AdminCouponFormValues,
} from "@/types/admin-coupon";

function isPositiveNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0;
}

export function validateAdminCouponForm(values: AdminCouponFormValues) {
  const errors: AdminCouponFormErrors = {};
  const discountValue = Number(values.discountValue);
  const minimumSpend = Number(values.minimumSpend);
  const usageLimit = Number(values.usageLimit || "0");

  if (!normalizeCouponCode(values.code)) {
    errors.code = "Coupon code is required.";
  }

  if (!isPositiveNumber(values.discountValue) || discountValue <= 0) {
    errors.discountValue = "Enter a valid discount value.";
  }

  if (
    values.discountType === "percentage" &&
    (discountValue <= 0 || discountValue > 100)
  ) {
    errors.discountValue = "Percentage discounts must be between 1 and 100.";
  }

  if (!isPositiveNumber(values.minimumSpend)) {
    errors.minimumSpend = "Minimum spend must be zero or more.";
  }

  if (!values.startDate) {
    errors.startDate = "Start date is required.";
  }

  if (!values.endDate) {
    errors.endDate = "End date is required.";
  }

  if (
    values.startDate &&
    values.endDate &&
    new Date(values.endDate).getTime() < new Date(values.startDate).getTime()
  ) {
    errors.endDate = "End date must be after the start date.";
  }

  if (values.usageLimit && (!Number.isInteger(usageLimit) || usageLimit < 0)) {
    errors.usageLimit = "Usage limit must be a whole number zero or greater.";
  }

  if (Number.isFinite(minimumSpend) && minimumSpend < 0) {
    errors.minimumSpend = "Minimum spend must be zero or more.";
  }

  return errors;
}
