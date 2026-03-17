import { Container } from "@/components/ui/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountLoading() {
  return (
    <section className="section-space">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <Skeleton className="h-80 w-full rounded-4xl" />
          <Skeleton className="h-[32rem] w-full rounded-4xl" />
        </div>
      </Container>
    </section>
  );
}
