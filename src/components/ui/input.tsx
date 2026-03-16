import type { InputHTMLAttributes } from "react";
import { cn } from "@/helpers/cn";

type FieldVariant = "primary" | "secondary" | "outline" | "danger";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  variant?: FieldVariant;
};

const fieldVariants: Record<FieldVariant, string> = {
  primary: "border-primary/20 focus-visible:border-primary",
  secondary: "border-accent/20 focus-visible:border-accent",
  outline: "border-border bg-white",
  danger: "border-danger/25 focus-visible:border-danger",
};

export function Input({
  className,
  variant = "outline",
  ...props
}: InputProps) {
  return (
    <input
      className={cn("field-base", fieldVariants[variant], className)}
      {...props}
    />
  );
}
