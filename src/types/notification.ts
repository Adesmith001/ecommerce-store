export type NotificationType =
  | "order_placed"
  | "payment_confirmed"
  | "order_status_updated"
  | "low_stock_alert"
  | "review_submitted";

export type NotificationRecipientScope = "admin" | "user";
export type NotificationEntityType = "order" | "product" | "review" | "system";

export type NotificationRecord = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  recipientScope: NotificationRecipientScope;
  recipientClerkId: string | null;
  relatedEntityId: string | null;
  relatedEntityType: NotificationEntityType | null;
  readByClerkIds: string[];
  createdAt: string;
};

export type NotificationSummary = {
  notifications: NotificationRecord[];
  unreadCount: number;
};
