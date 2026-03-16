import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/helpers/cn";

type CardVariant = "primary" | "secondary" | "outline" | "danger";

type CardProps = ComponentPropsWithoutRef<"div"> & {
  children: ReactNode;
  variant?: CardVariant;
};

const cardVariants: Record<CardVariant, string> = {
  primary: "border-primary/15 bg-white",
  secondary: "border-accent/15 bg-white",
  outline: "border-border bg-white",
  danger: "border-danger/15 bg-white",
};

export function Card({
  children,
  className,
  variant = "outline",
  ...props
}: CardProps) {
  return (
    <div
      className={cn("card-shell p-6 sm:p-8", cardVariants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"h3">) {
  return (
    <h3 className={cn("text-xl font-semibold tracking-tight", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"p">) {
  return (
    <p className={cn("text-sm leading-6 text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("mt-6", className)} {...props}>
      {children}
    </div>
  );
}
