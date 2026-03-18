"use client";

import {
  Area,
  AreaChart,
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
import type { AdminChartPoint } from "@/types/admin";

type DashboardChartCardProps = {
  data: AdminChartPoint[];
  description: string;
  metric: "orders" | "revenue";
  title: string;
  variant?: "area" | "bar";
};

export function DashboardChartCard({
  data,
  description,
  metric,
  title,
  variant = "area",
}: DashboardChartCardProps) {
  return (
    <Card className="space-y-5 p-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Dashboard chart
        </p>
        <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
      </div>

      {data.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
          No chart data yet.
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer>
            {variant === "area" ? (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(20,21,26,0.08)" strokeDasharray="4 4" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis
                  tickFormatter={(value) =>
                    metric === "revenue"
                      ? formatCurrency(Number(value), { notation: "compact" })
                      : String(value)
                  }
                  tickLine={false}
                  axisLine={false}
                  width={48}
                />
                <Tooltip
                  formatter={(value) =>
                    metric === "revenue"
                      ? formatCurrency(Number(value), { notation: "compact" })
                      : `${value} orders`
                  }
                  contentStyle={{
                    background: "rgba(255,255,255,0.94)",
                    border: "1px solid rgba(222,213,202,0.9)",
                    borderRadius: "20px",
                  }}
                />
                <Area
                  dataKey={metric}
                  fill="url(#revenueFill)"
                  stroke="#2563EB"
                  strokeWidth={3}
                  type="monotone"
                />
              </AreaChart>
            ) : (
              <BarChart data={data}>
                <CartesianGrid stroke="rgba(20,21,26,0.08)" strokeDasharray="4 4" />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={36} />
                <Tooltip
                  formatter={(value) => `${value} orders`}
                  contentStyle={{
                    background: "rgba(255,255,255,0.94)",
                    border: "1px solid rgba(222,213,202,0.9)",
                    borderRadius: "20px",
                  }}
                />
                <Bar dataKey={metric} fill="#F97316" radius={[12, 12, 6, 6]} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
