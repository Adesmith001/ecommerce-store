import type { HTMLAttributes } from "react";
import { cn } from "@/helpers/cn";

type BadgeVariant = "primary" | "secondary" | "outline" | "danger";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const badgeVariants: Record<BadgeVariant, string> = {
  primary: "border border-foreground bg-foreground text-primary-foreground",
  secondary: "border border-border bg-[#e6e2da] text-foreground",
  outline: "border border-border bg-white/75 text-foreground",
  danger: "border border-danger bg-danger/8 text-danger",
};

export function Badge({
  className,
  variant = "primary",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}
