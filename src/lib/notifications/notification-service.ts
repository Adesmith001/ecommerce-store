import "server-only";

import { ID, Query } from "appwrite";
import { PRODUCT_LOW_STOCK_THRESHOLD } from "@/constants/admin";
import { buildAppwriteApiUrl, getAppwriteErrorMessage } from "@/lib/appwrite/server-api";
import { appwriteConfig } from "@/lib/appwrite/config";
import type {
  NotificationEntityType,
  NotificationRecipientScope,
  NotificationRecord,
  NotificationSummary,
  NotificationType,
} from "@/types/notification";
import type { OrderStatus } from "@/types/order";

type AppwriteDocumentListResponse<T> = {
  documents: Array<T & { $id: string }>;
};

type AppwriteNotificationDocument = {
  $createdAt: string;
  $id: string;
  message?: string;
  readByClerkIds?: string;
  recipientClerkId?: string;
  recipientScope?: NotificationRecipientScope;
  relatedEntityId?: string;
  relatedEntityType?: NotificationEntityType;
  title?: string;
  type?: NotificationType;
};

function isNotificationConfigured() {
  return Boolean(
    appwriteConfig.apiKey &&
      appwriteConfig.databaseId &&
      appwriteConfig.endpoint &&
      appwriteConfig.projectId &&
      appwriteConfig.notificationsCollectionId,
  );
}

function getNotificationCollectionUrl() {
  return buildAppwriteApiUrl(
    `databases/${appwriteConfig.databaseId}/collections/${appwriteConfig.notificationsCollectionId}/documents`,
  );
}

function getNotificationDocumentUrl(notificationId: string) {
  return buildAppwriteApiUrl(
    `databases/${appwriteConfig.databaseId}/collections/${appwriteConfig.notificationsCollectionId}/documents/${notificationId}`,
  );
}

function getAppwriteHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Appwrite-Key": appwriteConfig.apiKey,
    "X-Appwrite-Project": appwriteConfig.projectId,
  };
}

function parseStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : [];
    } catch {
      return [];
    }
  }

  return [];
}

function toNotificationRecord(
  document: AppwriteNotificationDocument,
): NotificationRecord {
  return {
    createdAt: document.$createdAt,
    id: document.$id,
    message: document.message ?? "",
    readByClerkIds: parseStringArray(document.readByClerkIds),
    recipientClerkId: document.recipientClerkId ?? null,
    recipientScope: document.recipientScope ?? "user",
    relatedEntityId: document.relatedEntityId ?? null,
    relatedEntityType: document.relatedEntityType ?? null,
    title: document.title ?? "",
    type: document.type ?? "order_placed",
  };
}

function sortNotifications(notifications: NotificationRecord[]) {
  return [...notifications].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

function toSummary(
  notifications: NotificationRecord[],
  viewerClerkId: string | null,
): NotificationSummary {
  const sorted = sortNotifications(notifications);
  const unreadCount = sorted.filter(
    (notification) =>
      !viewerClerkId || !notification.readByClerkIds.includes(viewerClerkId),
  ).length;

  return {
    notifications: sorted,
    unreadCount,
  };
}

async function createNotification(input: {
  message: string;
  recipientClerkId?: string | null;
  recipientScope: NotificationRecipientScope;
  relatedEntityId?: string | null;
  relatedEntityType?: NotificationEntityType | null;
  title: string;
  type: NotificationType;
}) {
  if (!isNotificationConfigured()) {
    return null;
  }

  const response = await fetch(getNotificationCollectionUrl(), {
    body: JSON.stringify({
      data: {
        message: input.message,
        readByClerkIds: JSON.stringify([]),
        recipientClerkId: input.recipientClerkId ?? "",
        recipientScope: input.recipientScope,
        relatedEntityId: input.relatedEntityId ?? "",
        relatedEntityType: input.relatedEntityType ?? "",
        title: input.title,
        type: input.type,
      },
      documentId: ID.unique(),
    }),
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to create notification."),
    );
  }

  return toNotificationRecord(
    (await response.json()) as AppwriteNotificationDocument,
  );
}

async function listNotificationDocuments(queries: string[]) {
  const url = getNotificationCollectionUrl();

  for (const query of queries) {
    url.searchParams.append("queries[]", query);
  }

  const response = await fetch(url, {
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to load notifications."),
    );
  }

  const payload =
    (await response.json()) as AppwriteDocumentListResponse<AppwriteNotificationDocument>;

  return payload.documents.map(toNotificationRecord);
}

async function getNotificationById(notificationId: string) {
  const response = await fetch(getNotificationDocumentUrl(notificationId), {
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "GET",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to load notification."),
    );
  }

  return toNotificationRecord(
    (await response.json()) as AppwriteNotificationDocument,
  );
}

export async function listCustomerNotifications(clerkId: string) {
  if (!isNotificationConfigured()) {
    return { notifications: [], unreadCount: 0 };
  }

  const notifications = await listNotificationDocuments([
    Query.equal("recipientScope", "user"),
    Query.equal("recipientClerkId", clerkId),
    Query.orderDesc("$createdAt"),
    Query.limit(50),
  ]);

  return toSummary(notifications, clerkId);
}

export async function listAdminNotifications(clerkId: string) {
  if (!isNotificationConfigured()) {
    return { notifications: [], unreadCount: 0 };
  }

  const notifications = await listNotificationDocuments([
    Query.equal("recipientScope", "admin"),
    Query.orderDesc("$createdAt"),
    Query.limit(50),
  ]);

  return toSummary(notifications, clerkId);
}

export async function markNotificationAsRead(input: {
  clerkId: string;
  notificationId: string;
}) {
  if (!isNotificationConfigured()) {
    throw new Error("Appwrite notifications are not configured.");
  }

  const notification = await getNotificationById(input.notificationId);

  if (!notification) {
    throw new Error("Notification not found.");
  }

  if (
    notification.recipientScope === "user" &&
    notification.recipientClerkId !== input.clerkId
  ) {
    throw new Error("You cannot update this notification.");
  }

  const nextReadBy = notification.readByClerkIds.includes(input.clerkId)
    ? notification.readByClerkIds
    : [...notification.readByClerkIds, input.clerkId];

  const response = await fetch(getNotificationDocumentUrl(input.notificationId), {
    body: JSON.stringify({
      data: {
        readByClerkIds: JSON.stringify(nextReadBy),
      },
    }),
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to update notification."),
    );
  }

  return toNotificationRecord(
    (await response.json()) as AppwriteNotificationDocument,
  );
}

export async function markAllNotificationsAsRead(input: {
  clerkId: string;
  scope: NotificationRecipientScope;
}) {
  const summary =
    input.scope === "admin"
      ? await listAdminNotifications(input.clerkId)
      : await listCustomerNotifications(input.clerkId);

  for (const notification of summary.notifications) {
    if (!notification.readByClerkIds.includes(input.clerkId)) {
      await markNotificationAsRead({
        clerkId: input.clerkId,
        notificationId: notification.id,
      });
    }
  }
}

export async function createCustomerOrderPlacedNotification(input: {
  clerkId: string;
  orderId: string;
  orderNumber: string;
}) {
  return createNotification({
    message: `Your order ${input.orderNumber} has been placed successfully and is awaiting payment confirmation.`,
    recipientClerkId: input.clerkId,
    recipientScope: "user",
    relatedEntityId: input.orderId,
    relatedEntityType: "order",
    title: "Order placed",
    type: "order_placed",
  });
}

export async function createAdminOrderPlacedNotification(input: {
  customerName: string;
  orderId: string;
  orderNumber: string;
}) {
  return createNotification({
    message: `${input.customerName} placed ${input.orderNumber}.`,
    recipientScope: "admin",
    relatedEntityId: input.orderId,
    relatedEntityType: "order",
    title: "New order placed",
    type: "order_placed",
  });
}

export async function createPaymentConfirmedNotifications(input: {
  clerkId: string;
  orderId: string;
  orderNumber: string;
}) {
  await Promise.all([
    createNotification({
      message: `Payment has been confirmed for ${input.orderNumber}. We are preparing your order now.`,
      recipientClerkId: input.clerkId,
      recipientScope: "user",
      relatedEntityId: input.orderId,
      relatedEntityType: "order",
      title: "Payment confirmed",
      type: "payment_confirmed",
    }),
    createNotification({
      message: `Payment was confirmed for ${input.orderNumber}.`,
      recipientScope: "admin",
      relatedEntityId: input.orderId,
      relatedEntityType: "order",
      title: "Payment confirmed",
      type: "payment_confirmed",
    }),
  ]);
}

export async function createOrderStatusUpdatedNotification(input: {
  clerkId: string;
  nextStatus: OrderStatus;
  orderId: string;
  orderNumber: string;
}) {
  const label = input.nextStatus.charAt(0).toUpperCase() + input.nextStatus.slice(1);

  return createNotification({
    message: `Your order ${input.orderNumber} is now ${label.toLowerCase()}.`,
    recipientClerkId: input.clerkId,
    recipientScope: "user",
    relatedEntityId: input.orderId,
    relatedEntityType: "order",
    title: "Order status updated",
    type: "order_status_updated",
  });
}

export async function createReviewSubmittedNotification(input: {
  productId: string;
  productName: string;
  reviewerName: string;
}) {
  return createNotification({
    message: `${input.reviewerName} submitted a review for ${input.productName}.`,
    recipientScope: "admin",
    relatedEntityId: input.productId,
    relatedEntityType: "product",
    title: "New review submitted",
    type: "review_submitted",
  });
}

export async function createLowStockAlert(input: {
  productId: string;
  productName: string;
  stock: number;
}) {
  if (input.stock > PRODUCT_LOW_STOCK_THRESHOLD) {
    return null;
  }

  const existing = isNotificationConfigured()
    ? await listNotificationDocuments([
        Query.equal("recipientScope", "admin"),
        Query.equal("type", "low_stock_alert"),
        Query.equal("relatedEntityId", input.productId),
        Query.orderDesc("$createdAt"),
        Query.limit(1),
      ])
    : [];

  const latest = existing[0];
  const latestAgeMs = latest
    ? Date.now() - new Date(latest.createdAt).getTime()
    : Number.POSITIVE_INFINITY;

  if (latest && latestAgeMs < 1000 * 60 * 60 * 6) {
    return latest;
  }

  const message =
    input.stock <= 0
      ? `${input.productName} is now out of stock.`
      : `${input.productName} is running low with ${input.stock} units left.`;

  return createNotification({
    message,
    recipientScope: "admin",
    relatedEntityId: input.productId,
    relatedEntityType: "product",
    title: input.stock <= 0 ? "Out of stock alert" : "Low stock alert",
    type: "low_stock_alert",
  });
}
