import type { InputHTMLAttributes } from "react";
import { cn } from "@/helpers/cn";

type FieldVariant = "primary" | "secondary" | "outline" | "danger";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  variant?: FieldVariant;
};

const fieldVariants: Record<FieldVariant, string> = {
  primary: "border-primary/18",
  secondary: "border-accent/18",
  outline: "border-border/80",
  danger: "border-danger/20",
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
