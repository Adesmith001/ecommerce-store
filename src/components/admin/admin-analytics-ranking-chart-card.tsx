"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/helpers/format-currency";
import type { AdminAnalyticsRankingPoint } from "@/types/admin";

type AdminAnalyticsRankingChartCardProps = {
  data: AdminAnalyticsRankingPoint[];
  description: string;
  metric: "orders" | "quantity" | "revenue";
  title: string;
};

function formatMetric(
  metric: "orders" | "quantity" | "revenue",
  value: number,
) {
  if (metric === "revenue") {
    return formatCurrency(value, { notation: "compact" });
  }

  if (metric === "quantity") {
    return `${value} units`;
  }

  return `${value} orders`;
}

export function AdminAnalyticsRankingChartCard({
  data,
  description,
  metric,
  title,
}: AdminAnalyticsRankingChartCardProps) {
  return (
    <Card className="space-y-5 p-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Analytics ranking
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>

      {data.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          No ranking data yet for this range.
        </div>
      ) : (
        <div className="h-80 w-full">
          <ResponsiveContainer>
            <BarChart data={data} layout="vertical" margin={{ left: 8, right: 8 }}>
              <CartesianGrid stroke="rgba(20,21,26,0.08)" strokeDasharray="4 4" />
              <XAxis
                axisLine={false}
                tickFormatter={(value) => formatMetric(metric, Number(value))}
                tickLine={false}
                type="number"
              />
              <YAxis
                axisLine={false}
                dataKey="label"
                tickLine={false}
                type="category"
                width={108}
              />
              <Tooltip
                formatter={(value) => formatMetric(metric, Number(value))}
                contentStyle={{
                  background: "rgba(255,255,255,0.94)",
                  border: "1px solid rgba(222,213,202,0.9)",
                  borderRadius: "20px",
                }}
              />
              <Bar dataKey={metric} fill={metric === "revenue" ? "#2563EB" : "#F97316"} radius={[10, 10, 10, 10]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
