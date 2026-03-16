import { buildCheckoutPricing } from "@/lib/checkout/checkout-pricing";
import type { CartItem } from "@/types/cart";
import type {
  CheckoutFormValues,
  CheckoutOrderDraft,
  DeliveryMethod,
} from "@/types/checkout";

export function buildCheckoutOrderDraft(input: {
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
      couponCode: input.couponCode,
      deliveryMethod: input.deliveryMethod,
      items: input.items,
    }),
  };
}
