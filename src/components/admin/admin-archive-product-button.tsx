"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type AdminArchiveProductButtonProps = {
  productId: string;
  redirectTo?: string;
};

export function AdminArchiveProductButton({
  productId,
  redirectTo,
}: AdminArchiveProductButtonProps) {
  const router = useRouter();
  const [isArchiving, setIsArchiving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <Button
        disabled={isArchiving}
        onClick={async () => {
          setError(null);
          setIsArchiving(true);

          try {
            const response = await fetch(`/api/admin/products/${productId}`, {
              method: "DELETE",
            });
            const payload = (await response.json()) as { message?: string };

            if (!response.ok) {
              throw new Error(payload.message ?? "Failed to archive product.");
            }

            if (redirectTo) {
              router.push(redirectTo);
              router.refresh();
              return;
            }

            router.refresh();
          } catch (archiveError) {
            setError(
              archiveError instanceof Error
                ? archiveError.message
                : "Failed to archive product.",
            );
          } finally {
            setIsArchiving(false);
          }
        }}
        variant="danger"
      >
        {isArchiving ? "Archiving..." : "Archive product"}
      </Button>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
    </div>
  );
}
