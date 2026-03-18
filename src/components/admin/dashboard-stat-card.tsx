import { Card } from "@/components/ui/card";

type DashboardStatCardProps = {
  label: string;
  value: string;
  description: string;
};

export function DashboardStatCard({
  label,
  value,
  description,
}: DashboardStatCardProps) {
  return (
    <Card className="space-y-3 p-5">
      <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
        {label}
      </p>
      <p className="font-display break-words text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">
        {value}
      </p>
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
    </Card>
  );
}
