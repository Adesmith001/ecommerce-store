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
    "border border-foreground bg-foreground text-primary-foreground shadow-[0_16px_34px_rgba(17,17,17,0.14)] hover:bg-black",
  secondary:
    "border border-border bg-[#e6e2da] text-foreground shadow-[0_10px_24px_rgba(17,17,17,0.05)] hover:bg-[#ddd8cf]",
  outline:
    "border border-border bg-white/75 text-foreground shadow-[0_10px_24px_rgba(17,17,17,0.04)] hover:bg-white",
  danger:
    "border border-danger bg-danger text-danger-foreground shadow-[0_14px_30px_rgba(182,56,48,0.18)] hover:bg-[color-mix(in_srgb,var(--danger)_92%,black)]",
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
    "ui-focus inline-flex items-center justify-center gap-2 rounded-[1rem] font-medium whitespace-nowrap transition duration-200 disabled:pointer-events-none disabled:opacity-50",
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
