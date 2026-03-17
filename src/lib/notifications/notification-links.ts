import { ROUTES } from "@/constants/routes";
import type { NotificationRecord } from "@/types/notification";

export function getNotificationActionHref(notification: NotificationRecord) {
  if (notification.relatedEntityType === "order" && notification.relatedEntityId) {
    return notification.recipientScope === "admin"
      ? `${ROUTES.admin.orders}/${notification.relatedEntityId}`
      : ROUTES.storefront.accountOrder(notification.relatedEntityId);
  }

  if (notification.relatedEntityType === "product" && notification.relatedEntityId) {
    return notification.recipientScope === "admin"
      ? `${ROUTES.admin.products}/${notification.relatedEntityId}`
      : null;
  }

  return null;
}
