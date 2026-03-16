import type { SelectHTMLAttributes } from "react";
import { cn } from "@/helpers/cn";

type FieldVariant = "primary" | "secondary" | "outline" | "danger";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  variant?: FieldVariant;
};

const fieldVariants: Record<FieldVariant, string> = {
  primary: "border-primary/20 focus-visible:border-primary",
  secondary: "border-accent/20 focus-visible:border-accent",
  outline: "border-border bg-white",
  danger: "border-danger/25 focus-visible:border-danger",
};

export function Select({
  children,
  className,
  variant = "outline",
  ...props
}: SelectProps) {
  return (
    <select
      className={cn(
        "field-base appearance-none bg-[linear-gradient(45deg,transparent_50%,#6b7280_50%),linear-gradient(135deg,#6b7280_50%,transparent_50%)] bg-[length:0.6rem_0.6rem] bg-[position:calc(100%-1.2rem)_calc(50%-0.12rem),calc(100%-0.85rem)_calc(50%-0.12rem)] bg-no-repeat pr-10",
        fieldVariants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
