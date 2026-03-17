import {
  AdminAnalyticsRangeFilter,
  AdminAnalyticsRankingChartCard,
  DashboardChartCard,
  DashboardStatCard,
} from "@/components/admin";
import { Card } from "@/components/ui/card";
import {
  getAdminAnalyticsData,
  parseAdminAnalyticsRange,
} from "@/lib/admin/admin-analytics-service";

type AdminAnalyticsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(value);
}

export default async function AdminAnalyticsPage({
  searchParams,
}: AdminAnalyticsPageProps) {
  const params = await searchParams;
  const range = parseAdminAnalyticsRange(params.range);
  const analytics = await getAdminAnalyticsData(range);

  return (
    <div className="space-y-6">
      {analytics.warnings.length > 0 ? (
        <Card className="space-y-2 border-accent/20 p-5">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-accent">
            Setup notes
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            {analytics.warnings.map((warning) => (
              <p key={warning}>{warning}</p>
            ))}
          </div>
        </Card>
      ) : null}

      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Reporting
          </p>
          <h2 className="font-display text-4xl font-semibold tracking-[-0.06em]">
            Commerce analytics
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
            Revenue is based on paid orders only, while customer repeat behavior
            is measured from paid orders within the selected reporting window.
          </p>
        </div>
        <AdminAnalyticsRangeFilter activeRange={analytics.range} />
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <DashboardStatCard
          description="Paid revenue inside the selected reporting window."
          label="Total revenue"
          value={formatCurrency(analytics.summary.totalRevenue)}
        />
        <DashboardStatCard
          description="All orders created during this reporting window."
          label="Total orders"
          value={String(analytics.summary.totalOrders)}
        />
        <DashboardStatCard
          description="Orders with confirmed successful payment."
          label="Paid orders"
          value={String(analytics.summary.paidOrders)}
        />
        <DashboardStatCard
          description="Average value across paid orders in this range."
          label="Average order value"
          value={formatCurrency(analytics.summary.averageOrderValue)}
        />
        <DashboardStatCard
          description="Customer profiles currently stored for the storefront."
          label="Total customers"
          value={String(analytics.summary.totalCustomers)}
        />
        <DashboardStatCard
          description="Customers with at least two paid orders in this range."
          label="Repeat customers"
          value={String(analytics.summary.repeatCustomers)}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardChartCard
          data={analytics.timeline}
          description="Paid revenue grouped over the selected reporting range."
          metric="revenue"
          title="Revenue over time"
          variant="area"
        />
        <DashboardChartCard
          data={analytics.timeline}
          description="Total order count grouped over the selected reporting range."
          metric="orders"
          title="Orders over time"
          variant="bar"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminAnalyticsRankingChartCard
          data={analytics.topProducts}
          description="Top paid products ranked by generated revenue from order snapshots."
          metric="revenue"
          title="Top products"
        />
        <AdminAnalyticsRankingChartCard
          data={analytics.categoryPerformance}
          description="Category performance from paid order items in the selected range."
          metric="revenue"
          title="Category performance"
        />
      </div>
    </div>
  );
}
