import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/helpers/cn";

type FieldVariant = "primary" | "secondary" | "outline" | "danger";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant?: FieldVariant;
};

const fieldVariants: Record<FieldVariant, string> = {
  primary: "border-primary/18",
  secondary: "border-accent/18",
  outline: "border-border/80",
  danger: "border-danger/20",
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
        "field-base min-h-32 resize-y rounded-[1.6rem] py-3.5",
        fieldVariants[variant],
        className,
      )}
      rows={rows}
      {...props}
    />
  );
}
