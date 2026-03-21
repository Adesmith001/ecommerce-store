"use client";

import { Button } from "@/components/ui/button";

type QuantitySelectorProps = {
  max?: number;
  onChange: (value: number) => void;
  value: number;
};

export function QuantitySelector({
  max = 99,
  onChange,
  value,
}: QuantitySelectorProps) {
  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
        Quantity
      </p>
      <div className="inline-flex items-center gap-2 rounded-[1rem] border border-border bg-muted/60 p-2">
        <Button
          aria-label="Decrease quantity"
          className="h-10 w-10 rounded-[0.85rem] px-0"
          onClick={() => onChange(Math.max(1, value - 1))}
          size="sm"
          variant="outline"
        >
          -
        </Button>
        <span className="min-w-12 text-center text-sm font-semibold">{value}</span>
        <Button
          aria-label="Increase quantity"
          className="h-10 w-10 rounded-[0.85rem] px-0"
          onClick={() => onChange(Math.min(max, value + 1))}
          size="sm"
          variant="outline"
        >
          +
        </Button>
      </div>
    </div>
  );
}
