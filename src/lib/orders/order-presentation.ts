import type {
  OrderPaymentStatus,
  OrderRecord,
  OrderStatus,
  OrderTimelineStatus,
} from "@/types/order";

export const ORDER_TIMELINE_STEPS: Array<{
  description: string;
  title: string;
  value: OrderTimelineStatus;
}> = [
  {
    value: "pending",
    title: "Pending",
    description: "Your order has been created and is waiting for confirmation.",
  },
  {
    value: "processing",
    title: "Processing",
    description: "Payment has been confirmed and the order is being prepared.",
  },
  {
    value: "shipped",
    title: "Shipped",
    description: "Your package is on the way.",
  },
  {
    value: "delivered",
    title: "Delivered",
    description: "The order has been delivered successfully.",
  },
  {
    value: "cancelled",
    title: "Cancelled",
    description: "The order was cancelled or could not be completed.",
  },
] as const;

export function formatOrderCurrency(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    currency,
    style: "currency",
  }).format(value);
}

export function formatOrderDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function getNormalizedOrderStatus(status: OrderStatus): OrderTimelineStatus {
  switch (status) {
    case "confirmed":
      return "processing";
    case "failed":
      return "cancelled";
    case "pending":
    case "processing":
    case "shipped":
    case "delivered":
    case "cancelled":
      return status;
    default:
      return "pending";
  }
}

export function getOrderStatusLabel(status: OrderStatus) {
  const normalized = getNormalizedOrderStatus(status);

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function getPaymentStatusLabel(status: OrderPaymentStatus) {
  switch (status) {
    case "paid":
      return "Paid";
    case "failed":
      return "Failed";
    case "cancelled":
      return "Cancelled";
    default:
      return "Pending";
  }
}

export function getOrderStatusVariant(status: OrderStatus) {
  const normalized = getNormalizedOrderStatus(status);

  if (normalized === "cancelled") {
    return "danger" as const;
  }

  if (normalized === "delivered") {
    return "secondary" as const;
  }

  if (normalized === "processing" || normalized === "shipped") {
    return "primary" as const;
  }

  return "outline" as const;
}

export function getPaymentStatusVariant(status: OrderPaymentStatus) {
  switch (status) {
    case "paid":
      return "secondary" as const;
    case "failed":
    case "cancelled":
      return "danger" as const;
    default:
      return "outline" as const;
  }
}

export function getOrderTimelineState(order: OrderRecord) {
  const normalizedStatus = getNormalizedOrderStatus(order.orderStatus);

  if (normalizedStatus === "cancelled") {
    return ORDER_TIMELINE_STEPS.map((step) => ({
      ...step,
      isActive: step.value === "cancelled",
      isCompleted: false,
    }));
  }

  const currentIndex = ORDER_TIMELINE_STEPS.findIndex(
    (step) => step.value === normalizedStatus,
  );

  return ORDER_TIMELINE_STEPS.filter((step) => step.value !== "cancelled").map(
    (step, index) => ({
      ...step,
      isActive: index === currentIndex,
      isCompleted: index < currentIndex,
    }),
  );
}
