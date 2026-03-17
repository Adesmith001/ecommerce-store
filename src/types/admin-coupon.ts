import type { CouponDiscountType, CouponRecord } from "@/types/coupon";

export type AdminCouponFormValues = {
  active: boolean;
  code: string;
  discountType: CouponDiscountType;
  discountValue: string;
  endDate: string;
  minimumSpend: string;
  restrictedCategorySlugs: string;
  restrictedProductIds: string;
  startDate: string;
  usageLimit: string;
};

export type AdminCouponFormErrors = Partial<
  Record<
    | "code"
    | "discountType"
    | "discountValue"
    | "endDate"
    | "minimumSpend"
    | "startDate"
    | "usageLimit",
    string
  >
>;

export type AdminCouponFormContext = {
  couponId?: string;
  initialValues: AdminCouponFormValues;
  mode: "create" | "edit";
};

export type AdminCouponRecord = CouponRecord;
