"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type AdminErrorPageProps = {
  error: Error;
  reset: () => void;
};

export default function AdminErrorPage({
  error,
  reset,
}: AdminErrorPageProps) {
  return (
    <Card className="space-y-4 p-6">
      <p className="text-xs font-medium uppercase tracking-[0.24em] text-danger">
        Dashboard unavailable
      </p>
      <h2 className="font-display text-3xl font-semibold tracking-[-0.05em]">
        We could not load the admin dashboard.
      </h2>
      <p className="text-sm leading-7 text-muted-foreground">{error.message}</p>
      <Button onClick={reset}>Try again</Button>
    </Card>
  );
}
