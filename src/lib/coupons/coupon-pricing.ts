import type { AppliedCoupon, CouponEvaluationResult, CouponRecord, CouponValidationInput } from "@/types/coupon";

type CouponLike = Pick<
  CouponRecord,
  | "code"
  | "discountType"
  | "discountValue"
  | "minimumSpend"
  | "startDate"
  | "endDate"
  | "restrictedCategorySlugs"
  | "restrictedProductIds"
> & {
  id?: string;
  couponId?: string;
};

export function normalizeCouponCode(value: string) {
  return value.trim().toUpperCase();
}

function isWithinDateRange(coupon: CouponLike, now = new Date()) {
  const start = new Date(coupon.startDate);
  const end = new Date(coupon.endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return false;
  }

  return now >= start && now <= end;
}

function getEligibleSubtotal(input: CouponValidationInput & { coupon: CouponLike }) {
  const restrictedProducts = new Set(input.coupon.restrictedProductIds);
  const restrictedCategories = new Set(input.coupon.restrictedCategorySlugs);

  return input.items.reduce((total, item) => {
    const matchesProduct =
      restrictedProducts.size === 0 || restrictedProducts.has(item.productId);
    const matchesCategory =
      restrictedCategories.size === 0 ||
      (item.category?.slug ? restrictedCategories.has(item.category.slug) : false);

    const isEligible =
      restrictedProducts.size > 0 || restrictedCategories.size > 0
        ? matchesProduct && matchesCategory
        : true;

    if (!isEligible) {
      return total;
    }

    return total + (item.salePrice ?? item.price) * item.quantity;
  }, 0);
}

export function createAppliedCouponSnapshot(coupon: CouponRecord): AppliedCoupon {
  return {
    code: coupon.code,
    couponId: coupon.id,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    endDate: coupon.endDate,
    minimumSpend: coupon.minimumSpend,
    restrictedCategorySlugs: coupon.restrictedCategorySlugs,
    restrictedProductIds: coupon.restrictedProductIds,
    startDate: coupon.startDate,
  };
}

export function evaluateCoupon(input: CouponValidationInput & { coupon: CouponLike }): CouponEvaluationResult {
  const subtotal =
    input.subtotal ||
    input.items.reduce(
      (total, item) => total + (item.salePrice ?? item.price) * item.quantity,
      0,
    );
  const eligibleSubtotal = getEligibleSubtotal(input);
  const normalizedCode = normalizeCouponCode(input.code);

  if (!normalizedCode || normalizedCode !== normalizeCouponCode(input.coupon.code)) {
    return {
      appliedCoupon: null,
      code: null,
      discountAmount: 0,
      eligibleSubtotal,
      isValid: false,
    };
  }

  if (!isWithinDateRange(input.coupon) || subtotal < input.coupon.minimumSpend || eligibleSubtotal <= 0) {
    return {
      appliedCoupon: null,
      code: null,
      discountAmount: 0,
      eligibleSubtotal,
      isValid: false,
    };
  }

  const rawDiscount =
    input.coupon.discountType === "percentage"
      ? eligibleSubtotal * (input.coupon.discountValue / 100)
      : input.coupon.discountValue;

  const discountAmount = Math.min(eligibleSubtotal, Math.max(0, rawDiscount));
  const couponId = input.coupon.id ?? input.coupon.couponId ?? "";

  return {
    appliedCoupon: couponId
      ? {
          code: normalizedCode,
          couponId,
          discountType: input.coupon.discountType,
          discountValue: input.coupon.discountValue,
          endDate: input.coupon.endDate,
          minimumSpend: input.coupon.minimumSpend,
          restrictedCategorySlugs: input.coupon.restrictedCategorySlugs,
          restrictedProductIds: input.coupon.restrictedProductIds,
          startDate: input.coupon.startDate,
        }
      : null,
    code: normalizedCode,
    discountAmount,
    eligibleSubtotal,
    isValid: discountAmount > 0,
  };
}
