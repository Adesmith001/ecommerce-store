import { NotificationsListClient } from "@/components/notifications/notifications-list-client";
import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { listCustomerNotifications } from "@/lib/notifications/notification-service";
import { ROUTES } from "@/constants/routes";

export default async function AccountNotificationsPage() {
  const session = await requireAuthenticatedUser(ROUTES.storefront.accountNotifications);
  const summary = await listCustomerNotifications(session.userId);

  return <NotificationsListClient scope="user" summary={summary} viewerClerkId={session.userId} />;
}
