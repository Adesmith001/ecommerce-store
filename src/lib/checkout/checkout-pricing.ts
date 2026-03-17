import { evaluateCoupon } from "@/lib/coupons/coupon-pricing";
import type { CartItem } from "@/types/cart";
import type { AppliedCoupon } from "@/types/coupon";
import type { CheckoutPricing, DeliveryMethod } from "@/types/checkout";
import type { ShippingMethod } from "@/types/shipping";

export const DEFAULT_DELIVERY_METHODS: ShippingMethod[] = [
  {
    code: "standard",
    createdAt: "",
    description: "Reliable delivery for everyday orders.",
    estimatedDelivery: "3-5 business days",
    fee: 8,
    active: true,
    id: "standard",
    name: "Standard delivery",
    updatedAt: "",
  },
  {
    code: "express",
    createdAt: "",
    description: "Priority handling for faster delivery.",
    estimatedDelivery: "1-2 business days",
    fee: 18,
    active: true,
    id: "express",
    name: "Express delivery",
    updatedAt: "",
  },
  {
    code: "pickup",
    createdAt: "",
    description: "Collect your order from the pickup point.",
    estimatedDelivery: "Ready for pickup today",
    fee: 0,
    active: true,
    id: "pickup",
    name: "Pickup",
    updatedAt: "",
  },
] as const;

export function getCartSubtotal(items: CartItem[]) {
  return items.reduce(
    (total, item) => total + (item.salePrice ?? item.price) * item.quantity,
    0,
  );
}

export function getCartLineItemCount(items: CartItem[]) {
  return items.length;
}

export function getCartTotalQuantity(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}

export function getDeliveryMethodFee(
  deliveryMethod: DeliveryMethod,
  shippingMethods: ShippingMethod[] = DEFAULT_DELIVERY_METHODS,
) {
  return shippingMethods.find((option) => option.code === deliveryMethod)?.fee ?? 0;
}

export function buildCheckoutPricing(input: {
  appliedCoupon?: AppliedCoupon | null;
  couponCode?: string;
  deliveryMethod: DeliveryMethod;
  items: CartItem[];
  shippingMethods?: ShippingMethod[];
}): CheckoutPricing {
  const subtotal = getCartSubtotal(input.items);
  const shippingFee = getDeliveryMethodFee(
    input.deliveryMethod,
    input.shippingMethods ?? DEFAULT_DELIVERY_METHODS,
  );
  const couponEvaluation = input.appliedCoupon
    ? evaluateCoupon({
        code: input.appliedCoupon.code,
        coupon: input.appliedCoupon,
        items: input.items,
        subtotal,
      })
    : null;
  const discountAmount = couponEvaluation?.discountAmount ?? 0;
  const appliedCoupon =
    couponEvaluation?.isValid && couponEvaluation.appliedCoupon
      ? couponEvaluation.appliedCoupon
      : null;

  return {
    appliedCoupon,
    discountAmount,
    subtotal,
    shippingFee,
    estimatedTotal: Math.max(0, subtotal - discountAmount + shippingFee),
    totalItemCount: getCartLineItemCount(input.items),
    totalQuantity: getCartTotalQuantity(input.items),
    couponCode: appliedCoupon?.code ?? input.couponCode?.trim() ?? null,
  };
}

export function buildCartPricing(input: {
  appliedCoupon?: AppliedCoupon | null;
  items: CartItem[];
}) {
  return buildCheckoutPricing({
    appliedCoupon: input.appliedCoupon,
    deliveryMethod: "pickup",
    items: input.items,
    shippingMethods: DEFAULT_DELIVERY_METHODS,
  });
}
