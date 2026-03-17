import "server-only";

import { Query } from "appwrite";
import { buildAppwriteApiUrl, getAppwriteErrorMessage } from "@/lib/appwrite/server-api";
import { appwriteConfig } from "@/lib/appwrite/config";
import type {
  AdminOrderListItem,
  AdminOrderStatusTransition,
} from "@/types/admin-order";
import type {
  OrderPaymentStatus,
  OrderRecord,
  OrderStatus,
} from "@/types/order";

type AppwriteDocumentListResponse<T> = {
  documents: Array<T & { $id: string }>;
  total: number;
};

type AppwriteOrderDocument = {
  $id: string;
  addressLine: string;
  city: string;
  clerkId: string;
  country: string;
  couponCode: string;
  createdAt: string;
  deliveryMethod: OrderRecord["deliveryMethod"];
  email: string;
  estimatedTotal: number;
  fullName: string;
  inventoryAdjusted: boolean;
  items: string;
  landmark: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentMessage: string;
  paymentMeta: string;
  paymentMethod: string;
  paymentProvider: OrderRecord["paymentProvider"];
  paymentReference: string;
  paymentStatus: OrderPaymentStatus;
  paymentUrl: string;
  phoneNumber: string;
  postalCode: string;
  pricingSnapshot: string;
  shippingFee: number;
  state: string;
  subtotal: number;
  totalItemCount: number;
  totalQuantity: number;
  currency: string;
  updatedAt: string;
};

const SAFE_ORDER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  cancelled: [],
  confirmed: ["processing", "cancelled"],
  delivered: [],
  failed: [],
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
};
const PAGE_SIZE = 100;

function isOrderServiceConfigured() {
  return Boolean(
    appwriteConfig.apiKey &&
      appwriteConfig.databaseId &&
      appwriteConfig.endpoint &&
      appwriteConfig.projectId &&
      appwriteConfig.ordersCollectionId,
  );
}

function getOrderCollectionUrl() {
  return buildAppwriteApiUrl(
    `databases/${appwriteConfig.databaseId}/collections/${appwriteConfig.ordersCollectionId}/documents`,
  );
}

function getOrderDocumentUrl(documentId: string) {
  return buildAppwriteApiUrl(
    `databases/${appwriteConfig.databaseId}/collections/${appwriteConfig.ordersCollectionId}/documents/${documentId}`,
  );
}

function getAppwriteHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Appwrite-Key": appwriteConfig.apiKey,
    "X-Appwrite-Project": appwriteConfig.projectId,
  };
}

function parseJsonSafely<T>(value: string, fallback: T) {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function toOrderRecord(document: AppwriteOrderDocument): OrderRecord {
  return {
    clerkId: document.clerkId,
    createdAt: document.createdAt,
    currency: document.currency,
    customer: {
      addressLine: document.addressLine,
      city: document.city,
      country: document.country,
      email: document.email,
      fullName: document.fullName,
      landmark: document.landmark,
      phoneNumber: document.phoneNumber,
      postalCode: document.postalCode,
      state: document.state,
    },
    deliveryMethod: document.deliveryMethod,
    id: document.$id,
    inventoryAdjusted: Boolean(document.inventoryAdjusted),
    items: parseJsonSafely(document.items, []),
    orderNumber: document.orderNumber || document.$id,
    orderStatus: document.orderStatus,
    paymentMessage: document.paymentMessage || null,
    paymentMeta: document.paymentMeta
      ? parseJsonSafely<Record<string, unknown> | null>(document.paymentMeta, null)
      : null,
    paymentMethod: document.paymentMethod || null,
    paymentProvider: document.paymentProvider,
    paymentReference: document.paymentReference,
    paymentStatus: document.paymentStatus,
    paymentUrl: document.paymentUrl || null,
    pricing: {
      couponCode: document.couponCode || null,
      estimatedTotal: toNumber(document.estimatedTotal),
      shippingFee: toNumber(document.shippingFee),
      subtotal: toNumber(document.subtotal),
      totalItemCount: toNumber(document.totalItemCount),
      totalQuantity: toNumber(document.totalQuantity),
    },
    updatedAt: document.updatedAt,
  };
}

function toAdminOrderListItem(order: OrderRecord): AdminOrderListItem {
  return {
    createdAt: order.createdAt,
    currency: order.currency,
    customerEmail: order.customer.email,
    customerName: order.customer.fullName,
    id: order.id,
    orderNumber: order.orderNumber,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    totalAmount: order.pricing.estimatedTotal,
  };
}

export function getAllowedAdminOrderTransitions(
  currentStatus: OrderStatus,
): AdminOrderStatusTransition[] {
  return SAFE_ORDER_TRANSITIONS[currentStatus].map((value) => ({
    label: value.charAt(0).toUpperCase() + value.slice(1),
    value,
  }));
}

async function getOrderDocumentById(documentId: string) {
  const response = await fetch(getOrderDocumentUrl(documentId), {
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "GET",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to read Appwrite order."),
    );
  }

  return (await response.json()) as AppwriteOrderDocument;
}

export async function listAdminOrders() {
  if (!isOrderServiceConfigured()) {
    throw new Error("Appwrite order storage is not configured.");
  }

  const documents: AppwriteOrderDocument[] = [];
  let offset = 0;
  let total = 0;

  while (true) {
    const url = getOrderCollectionUrl();
    url.searchParams.append("queries[]", Query.orderDesc("$createdAt"));
    url.searchParams.append("queries[]", Query.limit(PAGE_SIZE));
    url.searchParams.append("queries[]", Query.offset(offset));

    const response = await fetch(url, {
      cache: "no-store",
      headers: getAppwriteHeaders(),
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        await getAppwriteErrorMessage(response, "Failed to list Appwrite orders."),
      );
    }

    const result =
      (await response.json()) as AppwriteDocumentListResponse<AppwriteOrderDocument>;

    total = result.total;
    documents.push(...result.documents);

    if (documents.length >= total || result.documents.length === 0) {
      break;
    }

    offset += result.documents.length;
  }

  return documents.map((document) =>
    toAdminOrderListItem(toOrderRecord(document)),
  );
}

export async function getAdminOrderById(orderId: string) {
  if (!isOrderServiceConfigured()) {
    throw new Error("Appwrite order storage is not configured.");
  }

  const document = await getOrderDocumentById(orderId);

  return document ? toOrderRecord(document) : null;
}

export async function updateAdminOrderStatus(input: {
  nextStatus: OrderStatus;
  orderId: string;
}) {
  if (!isOrderServiceConfigured()) {
    throw new Error("Appwrite order storage is not configured.");
  }

  const existingOrder = await getOrderDocumentById(input.orderId);

  if (!existingOrder) {
    throw new Error("Order not found.");
  }

  const currentStatus = existingOrder.orderStatus;
  const allowedTransitions = SAFE_ORDER_TRANSITIONS[currentStatus] ?? [];

  if (!allowedTransitions.includes(input.nextStatus)) {
    throw new Error(
      `You cannot move an order from ${currentStatus} to ${input.nextStatus}.`,
    );
  }

  const response = await fetch(getOrderDocumentUrl(input.orderId), {
    body: JSON.stringify({
      data: {
        orderStatus: input.nextStatus,
        updatedAt: new Date().toISOString(),
      },
    }),
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to update order status."),
    );
  }

  const document = (await response.json()) as AppwriteOrderDocument;

  return toOrderRecord(document);
}
