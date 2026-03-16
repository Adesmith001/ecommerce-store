import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function StorefrontLoading() {
  return (
    <Container className="section-space space-y-6">
      <Skeleton className="h-12 w-40" />
      <Skeleton className="h-72 w-full rounded-4xl" />
      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </Container>
  );
}
