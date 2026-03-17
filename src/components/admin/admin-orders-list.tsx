"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ROUTES } from "@/constants/routes";
import {
  formatOrderCurrency,
  formatOrderDate,
  getOrderStatusLabel,
  getOrderStatusVariant,
  getPaymentStatusLabel,
  getPaymentStatusVariant,
} from "@/lib/orders/order-presentation";
import type { AdminOrderListItem } from "@/types/admin-order";
import type { OrderPaymentStatus, OrderStatus } from "@/types/order";

type AdminOrdersListProps = {
  orders: AdminOrderListItem[];
};

function isRecentOrder(createdAt: string, days: number) {
  const createdTime = new Date(createdAt).getTime();
  const threshold = Date.now() - days * 24 * 60 * 60 * 1000;

  return createdTime >= threshold;
}

export function AdminOrdersList({ orders }: AdminOrdersListProps) {
  const [query, setQuery] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<OrderPaymentStatus | "all">("all");
  const [orderStatus, setOrderStatus] = useState<OrderStatus | "all">("all");
  const [recency, setRecency] = useState<"all" | "7d" | "30d">("all");

  const filteredOrders = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return orders.filter((order) => {
      if (paymentStatus !== "all" && order.paymentStatus !== paymentStatus) {
        return false;
      }

      if (orderStatus !== "all" && order.orderStatus !== orderStatus) {
        return false;
      }

      if (recency === "7d" && !isRecentOrder(order.createdAt, 7)) {
        return false;
      }

      if (recency === "30d" && !isRecentOrder(order.createdAt, 30)) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return [order.orderNumber, order.customerName, order.customerEmail]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [orders, orderStatus, paymentStatus, query, recency]);

  if (orders.length === 0) {
    return (
      <EmptyState
        description="Customer orders will appear here as soon as checkout creates them."
        title="No orders yet"
      />
    );
  }

  return (
    <div className="space-y-5">
      <Card className="space-y-4 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Order manager
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
              Customer orders
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search order, customer, email..."
              value={query}
            />
            <Select
              onChange={(event) =>
                setPaymentStatus(event.target.value as OrderPaymentStatus | "all")
              }
              value={paymentStatus}
            >
              <option value="all">All payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </Select>
            <Select
              onChange={(event) =>
                setOrderStatus(event.target.value as OrderStatus | "all")
              }
              value={orderStatus}
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="failed">Failed</option>
            </Select>
            <Select
              onChange={(event) =>
                setRecency(event.target.value as "all" | "7d" | "30d")
              }
              value={recency}
            >
              <option value="all">All time</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
            </Select>
          </div>
        </div>
      </Card>

      {filteredOrders.length === 0 ? (
        <EmptyState
          description="Try another combination of search and filters."
          title="No orders match this view"
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="space-y-4 p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={getPaymentStatusVariant(order.paymentStatus)}>
                      {getPaymentStatusLabel(order.paymentStatus)}
                    </Badge>
                    <Badge variant={getOrderStatusVariant(order.orderStatus)}>
                      {getOrderStatusLabel(order.orderStatus)}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-[-0.05em]">
                      {order.orderNumber}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {order.customerName} · {order.customerEmail}
                    </p>
                  </div>

                  <div className="grid gap-3 text-sm sm:grid-cols-3">
                    <div className="rounded-[1.2rem] border border-white/80 bg-white/72 px-3 py-3">
                      <p className="text-muted-foreground">Total amount</p>
                      <p className="mt-1 font-medium">
                        {formatOrderCurrency(order.totalAmount, order.currency)}
                      </p>
                    </div>
                    <div className="rounded-[1.2rem] border border-white/80 bg-white/72 px-3 py-3">
                      <p className="text-muted-foreground">Created</p>
                      <p className="mt-1 font-medium">{formatOrderDate(order.createdAt)}</p>
                    </div>
                    <div className="rounded-[1.2rem] border border-white/80 bg-white/72 px-3 py-3">
                      <p className="text-muted-foreground">Order id</p>
                      <p className="mt-1 font-medium">{order.id}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    className="rounded-full border border-white/80 bg-white/75 px-4 py-2 text-sm font-medium text-foreground shadow-[0_10px_24px_rgba(20,21,26,0.04)] hover:bg-white"
                    href={`${ROUTES.admin.orders}/${order.id}`}
                  >
                    View order
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
