import type { HTMLAttributes } from "react";
import { cn } from "@/helpers/cn";

type BadgeVariant = "primary" | "secondary" | "outline" | "danger";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const badgeVariants: Record<BadgeVariant, string> = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-accent/10 text-accent",
  outline: "border border-border bg-white text-foreground",
  danger: "bg-danger/10 text-danger",
};

export function Badge({
  className,
  variant = "primary",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}
