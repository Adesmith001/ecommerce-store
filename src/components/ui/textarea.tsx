import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/helpers/cn";

type FieldVariant = "primary" | "secondary" | "outline" | "danger";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant?: FieldVariant;
};

const fieldVariants: Record<FieldVariant, string> = {
  primary: "border-primary/20 focus-visible:border-primary",
  secondary: "border-accent/20 focus-visible:border-accent",
  outline: "border-border bg-white",
  danger: "border-danger/25 focus-visible:border-danger",
};

export function Textarea({
  className,
  variant = "outline",
  rows = 5,
  ...props
}: TextareaProps) {
  return (
    <textarea
      className={cn(
        "field-base min-h-32 resize-y rounded-3xl py-3.5",
        fieldVariants[variant],
        className,
      )}
      rows={rows}
      {...props}
    />
  );
}
