import type { DeliveryMethod } from "@/types/checkout";

export type ShippingMethod = {
  id: string;
  code: DeliveryMethod;
  name: string;
  description: string;
  estimatedDelivery: string;
  fee: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ShippingMethodFormValues = {
  active: boolean;
  code: DeliveryMethod;
  description: string;
  estimatedDelivery: string;
  fee: string;
  name: string;
};

export type ShippingMethodFormErrors = Partial<
  Record<"code" | "description" | "estimatedDelivery" | "fee" | "name", string>
>;
