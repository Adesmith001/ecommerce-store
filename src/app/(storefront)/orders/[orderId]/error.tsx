"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";

type OrderDetailErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function OrderDetailError({
  error,
  reset,
}: OrderDetailErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="section-space">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Card className="space-y-5 p-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-danger">
              Order unavailable
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              We could not load this order.
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Try again, or return to your order history.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={reset}>Try again</Button>
            <Link href={ROUTES.storefront.orders}>
              <Button variant="outline">Back to orders</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
