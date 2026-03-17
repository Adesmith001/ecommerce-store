import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountNotificationsLoading() {
  return (
    <div className="space-y-4">
      <Card className="space-y-4 p-5">
        <Skeleton className="h-8 w-48 rounded-full" />
        <Skeleton className="h-5 w-32 rounded-full" />
      </Card>
      <Card className="space-y-3 p-5">
        <Skeleton className="h-6 w-40 rounded-full" />
        <Skeleton className="h-16 w-full rounded-[1.2rem]" />
      </Card>
    </div>
  );
}
