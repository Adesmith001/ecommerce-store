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
    "border border-primary/80 bg-primary text-primary-foreground shadow-[0_20px_38px_rgba(37,99,235,0.22)] hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--primary)_90%,black)]",
  secondary:
    "border border-accent/80 bg-accent text-accent-foreground shadow-[0_16px_32px_rgba(249,115,22,0.18)] hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--accent)_92%,black)]",
  outline:
    "border border-border/90 bg-white/75 text-foreground shadow-[0_10px_24px_rgba(20,21,26,0.04)] hover:-translate-y-0.5 hover:bg-white",
  danger:
    "border border-danger/80 bg-danger text-danger-foreground shadow-[0_16px_32px_rgba(220,38,38,0.16)] hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--danger)_90%,black)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
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
    "ui-focus inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition duration-200 disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-50",
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
