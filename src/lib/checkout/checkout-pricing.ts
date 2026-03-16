import type { CartItem } from "@/types/cart";
import type { CheckoutPricing, DeliveryMethod } from "@/types/checkout";

export const DELIVERY_METHODS: Array<{
  description: string;
  fee: number;
  label: string;
  value: DeliveryMethod;
}> = [
  {
    value: "standard",
    label: "Standard delivery",
    description: "3-5 business days",
    fee: 8,
  },
  {
    value: "express",
    label: "Express delivery",
    description: "1-2 business days",
    fee: 18,
  },
  {
    value: "pickup",
    label: "Pickup",
    description: "Pickup placeholder",
    fee: 0,
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

export function getDeliveryMethodFee(deliveryMethod: DeliveryMethod) {
  return DELIVERY_METHODS.find((option) => option.value === deliveryMethod)?.fee ?? 0;
}

export function buildCheckoutPricing(input: {
  couponCode?: string;
  deliveryMethod: DeliveryMethod;
  items: CartItem[];
}): CheckoutPricing {
  const subtotal = getCartSubtotal(input.items);
  const shippingFee = getDeliveryMethodFee(input.deliveryMethod);

  return {
    subtotal,
    shippingFee,
    estimatedTotal: subtotal + shippingFee,
    totalItemCount: getCartLineItemCount(input.items),
    totalQuantity: getCartTotalQuantity(input.items),
    couponCode: input.couponCode?.trim() ? input.couponCode.trim() : null,
  };
}
