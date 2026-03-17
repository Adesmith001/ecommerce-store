"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import type { AdminOrderStatusTransition } from "@/types/admin-order";
import type { OrderRecord, OrderStatus } from "@/types/order";

type AdminOrderStatusManagerProps = {
  order: OrderRecord;
  transitions: AdminOrderStatusTransition[];
};

export function AdminOrderStatusManager({
  order,
  transitions,
}: AdminOrderStatusManagerProps) {
  const router = useRouter();
  const [nextStatus, setNextStatus] = useState<OrderStatus | "">("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  return (
    <Card className="space-y-4 p-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Fulfillment controls
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
          Update order status
        </h2>
      </div>

      {transitions.length === 0 ? (
        <p className="text-sm leading-7 text-muted-foreground">
          This order has no further safe status transitions from its current state.
        </p>
      ) : (
        <>
          <Select
            onChange={(event) => {
              setNextStatus(event.target.value as OrderStatus);
              setError(null);
              setSuccess(null);
            }}
            value={nextStatus}
          >
            <option value="">Select next status</option>
            {transitions.map((transition) => (
              <option key={transition.value} value={transition.value}>
                {transition.label}
              </option>
            ))}
          </Select>

          <Button
            disabled={!nextStatus || isSaving}
            onClick={async () => {
              if (!nextStatus) {
                return;
              }

              setIsSaving(true);
              setError(null);
              setSuccess(null);

              try {
                const response = await fetch(`/api/admin/orders/${order.id}/status`, {
                  body: JSON.stringify({ orderStatus: nextStatus }),
                  headers: { "Content-Type": "application/json" },
                  method: "PATCH",
                });

                const payload = (await response.json()) as { message?: string };

                if (!response.ok) {
                  throw new Error(payload.message ?? "Failed to update order status.");
                }

                setSuccess("Order status updated.");
                setNextStatus("");
                router.refresh();
              } catch (nextError) {
                setError(
                  nextError instanceof Error
                    ? nextError.message
                    : "Failed to update order status.",
                );
              } finally {
                setIsSaving(false);
              }
            }}
          >
            {isSaving ? "Saving..." : "Save status"}
          </Button>
        </>
      )}

      {error ? <p className="text-sm text-danger">{error}</p> : null}
      {success ? <p className="text-sm text-success">{success}</p> : null}
    </Card>
  );
}
