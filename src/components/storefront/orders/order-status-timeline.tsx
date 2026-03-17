import { Card } from "@/components/ui/card";
import { cn } from "@/helpers/cn";
import { getOrderTimelineState } from "@/lib/orders/order-presentation";
import type { OrderRecord } from "@/types/order";

type OrderStatusTimelineProps = {
  order: OrderRecord;
};

export function OrderStatusTimeline({ order }: OrderStatusTimelineProps) {
  const steps = getOrderTimelineState(order);

  return (
    <Card className="space-y-6 p-6">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Tracking
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Order status timeline
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {steps.map((step) => (
          <div
            key={step.value}
            className={cn(
              "rounded-3xl border p-4",
              step.isActive
                ? "border-primary bg-primary/5"
                : step.isCompleted
                  ? "border-accent/20 bg-accent/5"
                  : "border-border bg-white",
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
                  step.isActive
                    ? "bg-primary text-primary-foreground"
                    : step.isCompleted
                      ? "bg-accent text-accent-foreground"
                      : "bg-surface text-muted-foreground",
                )}
              >
                {step.isCompleted ? "✓" : "•"}
              </span>
              <p className="font-medium">{step.title}</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
