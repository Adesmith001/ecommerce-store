"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type QuantitySelectorProps = {
  max?: number;
};

export function QuantitySelector({ max = 99 }: QuantitySelectorProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Quantity</p>
      <div className="inline-flex items-center gap-3 rounded-full border border-border bg-white px-3 py-2">
        <Button
          aria-label="Decrease quantity"
          className="h-9 w-9 rounded-full px-0"
          onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          size="sm"
          variant="outline"
        >
          -
        </Button>
        <span className="min-w-8 text-center text-sm font-semibold">{quantity}</span>
        <Button
          aria-label="Increase quantity"
          className="h-9 w-9 rounded-full px-0"
          onClick={() => setQuantity((current) => Math.min(max, current + 1))}
          size="sm"
          variant="outline"
        >
          +
        </Button>
      </div>
    </div>
  );
}
