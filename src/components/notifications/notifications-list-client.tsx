"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { getNotificationActionHref } from "@/lib/notifications/notification-links";
import type { NotificationSummary } from "@/types/notification";

function formatDate(value: string) {
  return new Date(value).toLocaleString("en-US", {
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    month: "short",
  });
}

type NotificationsListClientProps = {
  scope: "admin" | "user";
  summary: NotificationSummary;
  viewerClerkId: string;
};

export function NotificationsListClient({
  scope,
  summary: initialSummary,
  viewerClerkId,
}: NotificationsListClientProps) {
  const [summary, setSummary] = useState(initialSummary);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (summary.notifications.length === 0) {
    return (
      <EmptyState
        description="New activity will appear here as orders, payments, reviews, and stock changes happen."
        title="No notifications yet"
      />
    );
  }

  return (
    <div className="space-y-5">
      <Card className="space-y-4 p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Inbox
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
              Notifications
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {summary.unreadCount} unread notification
              {summary.unreadCount === 1 ? "" : "s"}
            </p>
          </div>
          <Button
            disabled={isSubmitting || summary.unreadCount === 0}
            onClick={async () => {
              setError(null);
              setIsSubmitting(true);

              try {
                const response = await fetch(`/api/notifications?scope=${scope}`, {
                  method: "PATCH",
                });
                const payload = (await response.json()) as NotificationSummary & {
                  message?: string;
                };

                if (!response.ok) {
                  throw new Error(payload.message ?? "Failed to update notifications.");
                }

                setSummary({
                  notifications: payload.notifications ?? [],
                  unreadCount: payload.unreadCount ?? 0,
                });
              } catch (nextError) {
                setError(
                  nextError instanceof Error
                    ? nextError.message
                    : "Failed to update notifications.",
                );
              } finally {
                setIsSubmitting(false);
              }
            }}
            variant="outline"
          >
            {isSubmitting ? "Updating..." : "Mark all as read"}
          </Button>
        </div>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
      </Card>

      <div className="space-y-4">
        {summary.notifications.map((notification) => {
          const isRead = notification.readByClerkIds.includes(viewerClerkId);
          const actionHref = getNotificationActionHref(notification);

          return (
            <Card
              key={notification.id}
              className={`space-y-4 p-5 ${isRead ? "opacity-85" : ""}`}
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={
                        isRead
                          ? "rounded-full border border-white/80 bg-white/72 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                          : "rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary"
                      }
                    >
                      {isRead ? "Read" : "Unread"}
                    </span>
                    <span className="rounded-full border border-white/80 bg-white/72 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {notification.type.replaceAll("_", " ")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-[-0.05em]">
                      {notification.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {notification.message}
                    </p>
                  </div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {!isRead ? (
                    <Button
                      disabled={isSubmitting}
                      onClick={async () => {
                        setError(null);
                        setIsSubmitting(true);

                        try {
                          const response = await fetch(
                            `/api/notifications/${notification.id}/read?scope=${scope}`,
                            {
                              method: "PATCH",
                            },
                          );
                          const payload = (await response.json()) as {
                            message?: string;
                            notification?: NotificationSummary["notifications"][number];
                          };

                          if (!response.ok || !payload.notification) {
                            throw new Error(
                              payload.message ?? "Failed to update notification.",
                            );
                          }

                          setSummary((current) => ({
                            notifications: current.notifications.map((entry) =>
                              entry.id === payload.notification!.id
                                ? payload.notification!
                                : entry,
                            ),
                            unreadCount: Math.max(0, current.unreadCount - 1),
                          }));
                        } catch (nextError) {
                          setError(
                            nextError instanceof Error
                              ? nextError.message
                              : "Failed to update notification.",
                          );
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}
                      variant="outline"
                    >
                      Mark as read
                    </Button>
                  ) : null}
                  {actionHref ? (
                    <Link href={actionHref}>
                      <Button variant="outline">Open related item</Button>
                    </Link>
                  ) : null}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
