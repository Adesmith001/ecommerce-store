import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/helpers/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-[color-mix(in_srgb,var(--primary)_88%,black)]",
  secondary:
    "bg-accent text-accent-foreground hover:bg-[color-mix(in_srgb,var(--accent)_88%,black)]",
  outline: "border border-border bg-white text-foreground hover:bg-surface",
  danger:
    "bg-danger text-danger-foreground hover:bg-[color-mix(in_srgb,var(--danger)_88%,black)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function buttonVariants({
  className,
  size = "md",
  variant = "primary",
}: {
  className?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
}) {
  return cn(
    "ui-focus inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap shadow-sm disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );
}

export function Button({
  className,
  type = "button",
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonVariants({ className, size, variant })}
      type={type}
      {...props}
    />
  );
}
