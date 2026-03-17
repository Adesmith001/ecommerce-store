import type { CartItem } from "@/types/cart";

export type CouponDiscountType = "percentage" | "fixed";

export type CouponRecord = {
  id: string;
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minimumSpend: number;
  startDate: string;
  endDate: string;
  active: boolean;
  usageLimit: number | null;
  usageCount: number;
  restrictedCategorySlugs: string[];
  restrictedProductIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type AppliedCoupon = Pick<
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
  couponId: string;
};

export type CouponEvaluationResult = {
  appliedCoupon: AppliedCoupon | null;
  code: string | null;
  discountAmount: number;
  eligibleSubtotal: number;
  isValid: boolean;
};

export type CouponValidationInput = {
  code: string;
  items: CartItem[];
  subtotal: number;
};
