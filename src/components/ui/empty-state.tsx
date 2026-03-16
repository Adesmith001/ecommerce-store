import type { ReactNode } from "react";
import { cn } from "@/helpers/cn";
import { Card } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn("flex flex-col items-start gap-4", className)}>
      {icon ? (
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>
      ) : null}
      <div className="space-y-2">
        <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </Card>
  );
}
