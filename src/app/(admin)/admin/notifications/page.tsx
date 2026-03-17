import { NotificationsListClient } from "@/components/notifications/notifications-list-client";
import { requireAdminUser } from "@/lib/auth/guards";
import { listAdminNotifications } from "@/lib/notifications/notification-service";

export default async function AdminNotificationsPage() {
  const session = await requireAdminUser();
  const summary = await listAdminNotifications(session.userId);

  return <NotificationsListClient scope="admin" summary={summary} viewerClerkId={session.userId} />;
}
