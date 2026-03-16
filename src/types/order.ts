import type { CartItem } from "@/types/cart";
import type { CheckoutFormValues, CheckoutPricing, DeliveryMethod } from "@/types/checkout";

export type OrderPaymentStatus = "pending" | "paid" | "failed" | "cancelled";
export type OrderStatus = "pending" | "confirmed" | "failed" | "cancelled";
export type PaymentProvider = "kora";

export type OrderRecord = {
  id: string;
  clerkId: string;
  customer: CheckoutFormValues;
  deliveryMethod: DeliveryMethod;
  items: CartItem[];
  pricing: CheckoutPricing;
  currency: string;
  paymentProvider: PaymentProvider;
  paymentReference: string;
  paymentStatus: OrderPaymentStatus;
  orderStatus: OrderStatus;
  inventoryAdjusted: boolean;
  paymentUrl: string | null;
  paymentMethod: string | null;
  paymentMessage: string | null;
  paymentMeta: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderInput = {
  clerkId: string;
  currency: string;
  draft: {
    customer: CheckoutFormValues;
    deliveryMethod: DeliveryMethod;
    items: CartItem[];
    pricing: CheckoutPricing;
  };
  paymentProvider: PaymentProvider;
  paymentReference: string;
};

export type KoraVerificationSnapshot = {
  amount: number | null;
  currency: string | null;
  message: string | null;
  paymentMethod: string | null;
  rawStatus: string;
  reference: string;
  successful: boolean;
};
