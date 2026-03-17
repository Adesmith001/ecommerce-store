import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-28 w-full rounded-[2.2rem]" />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-44 w-full rounded-[2.2rem]" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Skeleton className="h-[380px] w-full rounded-[2.2rem]" />
        <Skeleton className="h-[380px] w-full rounded-[2.2rem]" />
      </div>
    </div>
  );
}
