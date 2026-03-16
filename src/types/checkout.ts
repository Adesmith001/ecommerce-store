import type { CartItem } from "@/types/cart";

export type DeliveryMethod = "standard" | "express" | "pickup";

export type CheckoutFormValues = {
  addressLine: string;
  city: string;
  country: string;
  email: string;
  fullName: string;
  landmark: string;
  phoneNumber: string;
  postalCode: string;
  state: string;
};

export type CheckoutFormErrors = Partial<Record<keyof CheckoutFormValues, string>>;

export type CheckoutPricing = {
  couponCode: string | null;
  estimatedTotal: number;
  shippingFee: number;
  subtotal: number;
  totalItemCount: number;
  totalQuantity: number;
};

export type CheckoutOrderDraft = {
  customer: CheckoutFormValues;
  deliveryMethod: DeliveryMethod;
  items: CartItem[];
  pricing: CheckoutPricing;
};
