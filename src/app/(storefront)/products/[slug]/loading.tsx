import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailsLoading() {
  return (
    <Container className="section-space space-y-6">
      <Skeleton className="h-12 w-56" />
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <Skeleton className="aspect-square w-full rounded-4xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-40" />
        </div>
      </div>
    </Container>
  );
}
