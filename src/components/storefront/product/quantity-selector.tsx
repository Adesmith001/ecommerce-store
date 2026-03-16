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
    <div className="space-y-2">
      <p className="text-sm font-medium">Quantity</p>
      <div className="inline-flex items-center gap-3 rounded-full border border-border bg-white px-3 py-2">
        <Button
          aria-label="Decrease quantity"
          className="h-9 w-9 rounded-full px-0"
          onClick={() => onChange(Math.max(1, value - 1))}
          size="sm"
          variant="outline"
        >
          -
        </Button>
        <span className="min-w-8 text-center text-sm font-semibold">{value}</span>
        <Button
          aria-label="Increase quantity"
          className="h-9 w-9 rounded-full px-0"
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
