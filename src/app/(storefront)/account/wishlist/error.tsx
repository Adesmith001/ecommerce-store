"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";

type WishlistErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function WishlistError({ error, reset }: WishlistErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="section-space">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Card className="space-y-5 p-8">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-danger">
              Wishlist unavailable
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              We could not load your wishlist.
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Try again, or return to the storefront.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button onClick={reset}>Try again</Button>
            <Link href={ROUTES.storefront.shop}>
              <Button variant="outline">Back to shop</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
