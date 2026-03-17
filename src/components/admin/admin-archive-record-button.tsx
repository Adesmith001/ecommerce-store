"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type AdminArchiveRecordButtonProps = {
  endpoint: string;
  label: string;
  actionLabel?: string;
  confirmMessage?: string;
  redirectTo?: string;
};

export function AdminArchiveRecordButton({
  actionLabel,
  confirmMessage,
  endpoint,
  label,
  redirectTo,
}: AdminArchiveRecordButtonProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <Button
      disabled={isSubmitting}
      onClick={async () => {
        const shouldContinue = window.confirm(
          confirmMessage ??
            `Archive this ${label.toLowerCase()}? You can still keep it in the admin history.`,
        );

        if (!shouldContinue) {
          return;
        }

        setIsSubmitting(true);

        try {
          const response = await fetch(endpoint, { method: "DELETE" });
          const payload = (await response.json()) as { message?: string };

          if (!response.ok) {
            throw new Error(payload.message ?? `Failed to archive ${label.toLowerCase()}.`);
          }

          if (redirectTo) {
            router.push(redirectTo);
          }

          router.refresh();
        } catch (error) {
          window.alert(
            error instanceof Error
              ? error.message
              : `Failed to archive ${label.toLowerCase()}.`,
          );
        } finally {
          setIsSubmitting(false);
        }
      }}
      variant="danger"
    >
      {isSubmitting ? "Saving..." : actionLabel ?? `Archive ${label}`}
    </Button>
  );
}
