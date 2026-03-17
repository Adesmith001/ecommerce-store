import { buildCheckoutPricing } from "@/lib/checkout/checkout-pricing";
import type { CartItem } from "@/types/cart";
import type { AppliedCoupon } from "@/types/coupon";
import type {
  CheckoutFormValues,
  CheckoutOrderDraft,
  DeliveryMethod,
} from "@/types/checkout";

export function buildCheckoutOrderDraft(input: {
  appliedCoupon?: AppliedCoupon | null;
  couponCode?: string;
  deliveryMethod: DeliveryMethod;
  items: CartItem[];
  values: CheckoutFormValues;
}): CheckoutOrderDraft {
  return {
    customer: input.values,
    deliveryMethod: input.deliveryMethod,
    items: input.items,
    pricing: buildCheckoutPricing({
      appliedCoupon: input.appliedCoupon,
      couponCode: input.couponCode,
      deliveryMethod: input.deliveryMethod,
      items: input.items,
    }),
  };
}
