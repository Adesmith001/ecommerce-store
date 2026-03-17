import type { OrderPaymentStatus, OrderRecord, OrderStatus } from "@/types/order";

export type AdminOrderListItem = Pick<
  OrderRecord,
  | "id"
  | "orderNumber"
  | "paymentStatus"
  | "orderStatus"
  | "createdAt"
  | "currency"
> & {
  customerEmail: string;
  customerName: string;
  totalAmount: number;
};

export type AdminOrderStatusTransition = {
  label: string;
  value: OrderStatus;
};

export type AdminOrderFilterValue = {
  orderStatus: OrderStatus | "all";
  paymentStatus: OrderPaymentStatus | "all";
  recency: "all" | "7d" | "30d";
  query: string;
};
