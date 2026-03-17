import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/helpers/cn";
import type { AdminAnalyticsRange } from "@/types/admin";

const RANGE_OPTIONS: Array<{ label: string; value: AdminAnalyticsRange }> = [
  { label: "Last 7 days", value: "7d" },
  { label: "Last 30 days", value: "30d" },
  { label: "This month", value: "month" },
];

type AdminAnalyticsRangeFilterProps = {
  activeRange: AdminAnalyticsRange;
};

export function AdminAnalyticsRangeFilter({
  activeRange,
}: AdminAnalyticsRangeFilterProps) {
  return (
    <div className="card-shell flex flex-wrap gap-2 p-3">
      {RANGE_OPTIONS.map((option) => {
        const active = option.value === activeRange;

        return (
          <Link
            key={option.value}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              active
                ? "bg-foreground text-white shadow-[0_16px_34px_rgba(20,21,26,0.16)]"
                : "border border-white/80 bg-white/70 text-muted-foreground hover:bg-white hover:text-foreground",
            )}
            href={`${ROUTES.admin.analytics}?range=${option.value}`}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}
