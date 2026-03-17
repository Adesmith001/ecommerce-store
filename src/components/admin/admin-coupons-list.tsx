"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminArchiveRecordButton } from "@/components/admin/admin-archive-record-button";
import { AdminCouponStatusBadge } from "@/components/admin/admin-coupon-status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import type { AdminCouponRecord } from "@/types/admin-coupon";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AdminCouponsList({
  coupons,
}: {
  coupons: AdminCouponRecord[];
}) {
  const [query, setQuery] = useState("");

  const filteredCoupons = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return coupons;
    }

    return coupons.filter((coupon) =>
      [
        coupon.code,
        coupon.discountType,
        coupon.restrictedCategorySlugs.join(" "),
        coupon.restrictedProductIds.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [coupons, query]);

  if (coupons.length === 0) {
    return (
      <EmptyState
        action={
          <Link href={`${ROUTES.admin.coupons}/new`}>
            <Button>Create your first coupon</Button>
          </Link>
        }
        description="Promotion rules you create here can be applied in cart and checkout."
        title="No coupons yet"
      />
    );
  }

  return (
    <div className="space-y-5">
      <Card className="space-y-4 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Promotion manager
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
              Coupons and discounts
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by code, type, category..."
              value={query}
            />
            <Link href={`${ROUTES.admin.coupons}/new`}>
              <Button>Create coupon</Button>
            </Link>
          </div>
        </div>
      </Card>

      {filteredCoupons.length === 0 ? (
        <EmptyState
          description="Try another search term."
          title="No coupons match this view"
        />
      ) : (
        <div className="space-y-4">
          {filteredCoupons.map((coupon) => (
            <Card key={coupon.id} className="space-y-4 p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <AdminCouponStatusBadge coupon={coupon} />
                    <span className="rounded-full border border-white/80 bg-white/72 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}% off`
                        : `$${coupon.discountValue.toFixed(2)} off`}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-[-0.05em]">
                      {coupon.code}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Valid {formatDate(coupon.startDate)} to {formatDate(coupon.endDate)}
                    </p>
                  </div>
                  <div className="grid gap-3 text-sm sm:grid-cols-4">
                    <div className="rounded-[1.2rem] border border-white/80 bg-white/72 px-3 py-3">
                      <p className="text-muted-foreground">Minimum spend</p>
                      <p className="mt-1 font-medium">${coupon.minimumSpend.toFixed(2)}</p>
                    </div>
                    <div className="rounded-[1.2rem] border border-white/80 bg-white/72 px-3 py-3">
                      <p className="text-muted-foreground">Usage</p>
                      <p className="mt-1 font-medium">
                        {coupon.usageCount}
                        {coupon.usageLimit !== null ? ` / ${coupon.usageLimit}` : ""}
                      </p>
                    </div>
                    <div className="rounded-[1.2rem] border border-white/80 bg-white/72 px-3 py-3">
                      <p className="text-muted-foreground">Category rules</p>
                      <p className="mt-1 font-medium">
                        {coupon.restrictedCategorySlugs.length || "All"}
                      </p>
                    </div>
                    <div className="rounded-[1.2rem] border border-white/80 bg-white/72 px-3 py-3">
                      <p className="text-muted-foreground">Product rules</p>
                      <p className="mt-1 font-medium">
                        {coupon.restrictedProductIds.length || "All"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link href={`${ROUTES.admin.coupons}/${coupon.id}`}>
                    <Button variant="outline">View</Button>
                  </Link>
                  <Link href={`${ROUTES.admin.coupons}/${coupon.id}/edit`}>
                    <Button variant="outline">Edit</Button>
                  </Link>
                  {coupon.active ? (
                    <AdminArchiveRecordButton
                      actionLabel="Disable coupon"
                      confirmMessage="Disable this coupon? Existing orders stay unchanged, but customers will no longer be able to apply it."
                      endpoint={`/api/admin/coupons/${coupon.id}`}
                      label="Coupon"
                    />
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
