import "server-only";

import { Query } from "appwrite";
import { buildAppwriteApiUrl, getAppwriteErrorMessage } from "@/lib/appwrite/server-api";
import { appwriteConfig } from "@/lib/appwrite/config";
import type {
  CreateOrderInput,
  KoraVerificationSnapshot,
  OrderPaymentStatus,
  OrderRecord,
  OrderStatus,
} from "@/types/order";

type AppwriteDocumentListResponse<T> = {
  documents: Array<T & { $id: string }>;
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

function toOrderRecord(document: AppwriteOrderDocument): OrderRecord {
  const customer = {
    fullName: document.fullName,
    email: document.email,
    phoneNumber: document.phoneNumber,
    country: document.country,
    state: document.state,
    city: document.city,
    addressLine: document.addressLine,
    landmark: document.landmark,
    postalCode: document.postalCode,
  };

  return {
    id: document.$id,
    orderNumber: document.orderNumber || document.$id,
    clerkId: document.clerkId,
    customer,
    deliveryMethod: document.deliveryMethod,
    items: parseJsonSafely(document.items, []),
    pricing: {
      couponCode: document.couponCode || null,
      estimatedTotal: document.estimatedTotal,
      shippingFee: document.shippingFee,
      subtotal: document.subtotal,
      totalItemCount: document.totalItemCount,
      totalQuantity: document.totalQuantity,
    },
    currency: document.currency,
    paymentProvider: document.paymentProvider,
    paymentReference: document.paymentReference,
    paymentStatus: document.paymentStatus,
    orderStatus: document.orderStatus,
    inventoryAdjusted: Boolean(document.inventoryAdjusted),
    paymentUrl: document.paymentUrl || null,
    paymentMethod: document.paymentMethod || null,
    paymentMessage: document.paymentMessage || null,
    paymentMeta: document.paymentMeta
      ? parseJsonSafely<Record<string, unknown> | null>(document.paymentMeta, null)
      : null,
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
}

async function findOrderDocumentByPaymentReference(reference: string) {
  const url = getOrderCollectionUrl();

  url.searchParams.append("queries[]", Query.equal("paymentReference", reference));
  url.searchParams.append("queries[]", Query.limit(1));

  const response = await fetch(url, {
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to query Appwrite orders."),
    );
  }

  const result =
    (await response.json()) as AppwriteDocumentListResponse<AppwriteOrderDocument>;

  return result.documents[0] ?? null;
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

function buildOrderNumber() {
  const timestamp = new Date()
    .toISOString()
    .slice(0, 10)
    .replaceAll("-", "");
  const suffix = crypto.randomUUID().replaceAll("-", "").slice(0, 8).toUpperCase();

  return `ORD-${timestamp}-${suffix}`;
}

async function patchOrderDocument(
  documentId: string,
  data: Record<string, boolean | number | string>,
) {
  const response = await fetch(getOrderDocumentUrl(documentId), {
    body: JSON.stringify({ data }),
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to update Appwrite order."),
    );
  }

  const nextDocument = (await response.json()) as AppwriteOrderDocument;

  return toOrderRecord(nextDocument);
}

export async function createPendingOrder(input: CreateOrderInput) {
  if (!isOrderServiceConfigured()) {
    throw new Error("Appwrite order storage is not configured.");
  }

  const now = new Date().toISOString();
  const orderNumber = buildOrderNumber();
  const response = await fetch(getOrderCollectionUrl(), {
    body: JSON.stringify({
      data: {
        orderNumber,
        clerkId: input.clerkId,
        fullName: input.draft.customer.fullName,
        email: input.draft.customer.email,
        phoneNumber: input.draft.customer.phoneNumber,
        country: input.draft.customer.country,
        state: input.draft.customer.state,
        city: input.draft.customer.city,
        addressLine: input.draft.customer.addressLine,
        landmark: input.draft.customer.landmark,
        postalCode: input.draft.customer.postalCode,
        deliveryMethod: input.draft.deliveryMethod,
        subtotal: input.draft.pricing.subtotal,
        shippingFee: input.draft.pricing.shippingFee,
        estimatedTotal: input.draft.pricing.estimatedTotal,
        totalItemCount: input.draft.pricing.totalItemCount,
        totalQuantity: input.draft.pricing.totalQuantity,
        couponCode: input.draft.pricing.couponCode ?? "",
        currency: input.currency,
        items: JSON.stringify(input.draft.items),
        pricingSnapshot: JSON.stringify(input.draft.pricing),
        paymentProvider: input.paymentProvider,
        paymentReference: input.paymentReference,
        paymentStatus: "pending",
        orderStatus: "pending",
        inventoryAdjusted: false,
        paymentUrl: "",
        paymentMethod: "",
        paymentMessage: "",
        paymentMeta: "",
        createdAt: now,
        updatedAt: now,
      },
      documentId: crypto.randomUUID(),
    }),
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to create Appwrite order."),
    );
  }

  const document = (await response.json()) as AppwriteOrderDocument;

  return toOrderRecord(document);
}

export async function getOrderByPaymentReference(reference: string) {
  if (!isOrderServiceConfigured()) {
    throw new Error("Appwrite order storage is not configured.");
  }

  const document = await findOrderDocumentByPaymentReference(reference);

  return document ? toOrderRecord(document) : null;
}

export async function listOrdersForClerkUser(clerkId: string) {
  if (!isOrderServiceConfigured()) {
    throw new Error("Appwrite order storage is not configured.");
  }

  const url = getOrderCollectionUrl();

  url.searchParams.append("queries[]", Query.equal("clerkId", clerkId));
  url.searchParams.append("queries[]", Query.orderDesc("$createdAt"));

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

  return result.documents.map(toOrderRecord);
}

export async function hasPaidOrderForProduct(input: {
  clerkId: string;
  productId: string;
}) {
  const orders = await listOrdersForClerkUser(input.clerkId);

  return orders.some(
    (order) =>
      order.paymentStatus === "paid" &&
      order.items.some((item) => item.productId === input.productId),
  );
}

export async function getLatestPaidOrderIdForProduct(input: {
  clerkId: string;
  productId: string;
}) {
  const orders = await listOrdersForClerkUser(input.clerkId);
  const matchingOrder = orders.find(
    (order) =>
      order.paymentStatus === "paid" &&
      order.items.some((item) => item.productId === input.productId),
  );

  return matchingOrder?.id ?? null;
}

export async function getOrderForClerkUser(input: {
  clerkId: string;
  orderId: string;
}) {
  if (!isOrderServiceConfigured()) {
    throw new Error("Appwrite order storage is not configured.");
  }

  const document = await getOrderDocumentById(input.orderId);

  if (!document || document.clerkId !== input.clerkId) {
    return null;
  }

  return toOrderRecord(document);
}

export async function updateOrderPaymentInitialization(input: {
  checkoutUrl: string;
  paymentReference: string;
}) {
  const existingOrder = await findOrderDocumentByPaymentReference(
    input.paymentReference,
  );

  if (!existingOrder) {
    throw new Error("Order not found for payment initialization.");
  }

  return patchOrderDocument(existingOrder.$id, {
    paymentUrl: input.checkoutUrl,
    paymentMeta: JSON.stringify({
      checkoutUrl: input.checkoutUrl,
      initializedAt: new Date().toISOString(),
    }),
    updatedAt: new Date().toISOString(),
  });
}

export async function markOrderInitializationFailed(input: {
  message: string;
  paymentReference: string;
}) {
  const existingOrder = await findOrderDocumentByPaymentReference(
    input.paymentReference,
  );

  if (!existingOrder) {
    throw new Error("Order not found for failed payment initialization.");
  }

  return patchOrderDocument(existingOrder.$id, {
    orderStatus: "failed",
    paymentMessage: input.message,
    paymentMeta: JSON.stringify({
      failedAt: new Date().toISOString(),
      phase: "initialization",
    }),
    paymentStatus: "failed",
    updatedAt: new Date().toISOString(),
  });
}

export async function markOrderInventoryAdjusted(paymentReference: string) {
  const existingOrder = await findOrderDocumentByPaymentReference(paymentReference);

  if (!existingOrder) {
    throw new Error("Order not found for inventory adjustment.");
  }

  return patchOrderDocument(existingOrder.$id, {
    inventoryAdjusted: true,
    updatedAt: new Date().toISOString(),
  });
}

export async function updateOrderVerificationState(input: {
  orderStatus: OrderStatus;
  paymentMessage?: string | null;
  paymentMethod?: string | null;
  paymentReference: string;
  paymentStatus: OrderPaymentStatus;
  verification: KoraVerificationSnapshot;
}) {
  const existingOrder = await findOrderDocumentByPaymentReference(
    input.paymentReference,
  );

  if (!existingOrder) {
    throw new Error("Order not found for payment verification.");
  }

  return patchOrderDocument(existingOrder.$id, {
    orderStatus: input.orderStatus,
    paymentMessage: input.paymentMessage ?? "",
    paymentMethod: input.paymentMethod ?? "",
    paymentMeta: JSON.stringify({
      ...input.verification,
      verifiedAt: new Date().toISOString(),
    }),
    paymentStatus: input.paymentStatus,
    updatedAt: new Date().toISOString(),
  });
}
