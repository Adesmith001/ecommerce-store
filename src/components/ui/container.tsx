import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/helpers/cn";

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  children: ReactNode;
};

export function Container({
  children,
  className,
  ...props
}: ContainerProps) {
  return (
    <div className={cn("app-shell", className)} {...props}>
      {children}
    </div>
  );
}
