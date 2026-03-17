"use client";

import { useEffect, useState } from "react";
import type { NotificationSummary } from "@/types/notification";

export function useNotificationSummary(
  scope: "admin" | "user",
  enabled = true,
) {
  const [summary, setSummary] = useState<NotificationSummary>({
    notifications: [],
    unreadCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setSummary({ notifications: [], unreadCount: 0 });
      setError(null);
      setIsLoading(false);
      return;
    }

    let active = true;

    async function loadSummary() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/notifications?scope=${scope}`, {
          cache: "no-store",
        });

        const payload = (await response.json()) as NotificationSummary & {
          message?: string;
        };

        if (!response.ok) {
          throw new Error(payload.message ?? "Failed to load notifications.");
        }

        if (active) {
          setSummary({
            notifications: payload.notifications ?? [],
            unreadCount: payload.unreadCount ?? 0,
          });
        }
      } catch (nextError) {
        if (active) {
          setError(
            nextError instanceof Error
              ? nextError.message
              : "Failed to load notifications.",
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    void loadSummary();

    return () => {
      active = false;
    };
  }, [enabled, scope]);

  return {
    error,
    isLoading,
    setSummary,
    summary,
  };
}
