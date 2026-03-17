"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { formatOrderCurrency, formatOrderDate } from "@/lib/orders/order-presentation";
import type { AdminCustomerListItem } from "@/types/admin-customer";

type AdminCustomersListProps = {
  customers: AdminCustomerListItem[];
};

export function AdminCustomersList({ customers }: AdminCustomersListProps) {
  const [query, setQuery] = useState("");

  const filteredCustomers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return customers;
    }

    return customers.filter((customer) =>
      [customer.fullName, customer.email, customer.phone]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [customers, query]);

  if (customers.length === 0) {
    return (
      <EmptyState
        description="Customer profiles will appear here as people sign up and place orders."
        title="No customers yet"
      />
    );
  }

  return (
    <div className="space-y-5">
      <Card className="space-y-4 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Customer manager
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
              Customer records
            </h2>
          </div>
          <Input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, email, phone..."
            value={query}
          />
        </div>
      </Card>

      {filteredCustomers.length === 0 ? (
        <EmptyState
          description="Try another search term."
          title="No customers match this view"
        />
      ) : (
        <div className="space-y-4">
          {filteredCustomers.map((customer) => (
            <Card key={customer.clerkId} className="space-y-4 p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-[-0.05em]">
                      {customer.fullName || "Unnamed customer"}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {customer.email || "No email"} · {customer.phone || "No phone"}
                    </p>
                  </div>

                  <div className="grid gap-3 text-sm sm:grid-cols-3">
                    <div className="rounded-[1.2rem] border border-white/80 bg-white/72 px-3 py-3">
                      <p className="text-muted-foreground">Total orders</p>
                      <p className="mt-1 font-medium">{customer.totalOrders}</p>
                    </div>
                    <div className="rounded-[1.2rem] border border-white/80 bg-white/72 px-3 py-3">
                      <p className="text-muted-foreground">Total spend</p>
                      <p className="mt-1 font-medium">
                        {formatOrderCurrency(customer.totalSpend, customer.currency)}
                      </p>
                    </div>
                    <div className="rounded-[1.2rem] border border-white/80 bg-white/72 px-3 py-3">
                      <p className="text-muted-foreground">Most recent order</p>
                      <p className="mt-1 font-medium">
                        {customer.mostRecentOrderDate
                          ? formatOrderDate(customer.mostRecentOrderDate)
                          : "No orders yet"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    className="rounded-full border border-white/80 bg-white/75 px-4 py-2 text-sm font-medium text-foreground shadow-[0_10px_24px_rgba(20,21,26,0.04)] hover:bg-white"
                    href={`${ROUTES.admin.customers}/${customer.clerkId}`}
                  >
                    View customer
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
