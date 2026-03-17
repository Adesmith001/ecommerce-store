import {
  DashboardChartCard,
  DashboardStatCard,
  LowStockPanel,
  RecentOrdersPanel,
  TopProductsPanel,
} from "@/components/admin";
import { Card } from "@/components/ui/card";
import { getAdminDashboardData } from "@/lib/admin/admin-dashboard-service";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(value);
}

export default async function AdminDashboardPage() {
  const dashboard = await getAdminDashboardData();

  return (
    <div className="space-y-6">
      {dashboard.warnings.length > 0 ? (
        <Card className="space-y-2 border-accent/20 p-5">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-accent">
            Setup notes
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            {dashboard.warnings.map((warning) => (
              <p key={warning}>{warning}</p>
            ))}
          </div>
        </Card>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <DashboardStatCard
          description="Confirmed paid revenue across verified orders."
          label="Total sales"
          value={formatCurrency(dashboard.summary.totalSales)}
        />
        <DashboardStatCard
          description="All orders currently stored in Appwrite."
          label="Total orders"
          value={String(dashboard.summary.totalOrders)}
        />
        <DashboardStatCard
          description="Orders still awaiting payment or fulfillment progress."
          label="Pending orders"
          value={String(dashboard.summary.pendingOrders)}
        />
        <DashboardStatCard
          description="Products in the current catalog collection."
          label="Total products"
          value={String(dashboard.summary.totalProducts)}
        />
        <DashboardStatCard
          description="Customer profiles excluding manual admin accounts."
          label="Total customers"
          value={String(dashboard.summary.totalCustomers)}
        />
        <DashboardStatCard
          description="Active products at or below the low stock threshold."
          label="Low stock"
          value={String(dashboard.summary.lowStockProducts)}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <DashboardChartCard
          data={dashboard.chartPoints}
          description="Paid order revenue grouped across the last six months."
          metric="revenue"
          title="Revenue over time"
          variant="area"
        />
        <DashboardChartCard
          data={dashboard.chartPoints}
          description="Total order volume grouped across the last six months."
          metric="orders"
          title="Order volume over time"
          variant="bar"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <RecentOrdersPanel orders={dashboard.recentOrders} />
        <div className="space-y-6">
          <TopProductsPanel products={dashboard.topProducts} />
          <LowStockPanel products={dashboard.lowStock} />
        </div>
      </div>
    </div>
  );
}
