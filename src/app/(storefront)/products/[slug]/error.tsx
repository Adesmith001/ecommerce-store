"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { EmptyState } from "@/components/ui/empty-state";

type ProductDetailsErrorProps = {
  reset: () => void;
};

export default function ProductDetailsError({
  reset,
}: ProductDetailsErrorProps) {
  return (
    <Container className="section-space">
      <EmptyState
        action={<Button onClick={reset}>Try again</Button>}
        description="The product details could not be loaded right now."
        title="Unable to load this product"
      />
    </Container>
  );
}
