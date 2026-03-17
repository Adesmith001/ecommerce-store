"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminArchiveRecordButton } from "@/components/admin/admin-archive-record-button";
import { AdminMerchandisingStatusBadge } from "@/components/admin/admin-merchandising-status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import type { AdminBrandRecord } from "@/types/admin-merchandising";

type AdminBrandsListProps = {
  brands: AdminBrandRecord[];
};

export function AdminBrandsList({ brands }: AdminBrandsListProps) {
  const [query, setQuery] = useState("");

  const filteredBrands = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return brands;
    }

    return brands.filter((brand) =>
      [brand.name, brand.slug, brand.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [brands, query]);

  if (brands.length === 0) {
    return (
      <EmptyState
        action={
          <Link href={`${ROUTES.admin.brands}/new`}>
            <Button>Create your first brand</Button>
          </Link>
        }
        description="Brands keep your catalog metadata clean for future filters and storytelling."
        title="No brands yet"
      />
    );
  }

  return (
    <div className="space-y-5">
      <Card className="space-y-4 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Brand manager
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
              Merchandising brands
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name or slug..."
              value={query}
            />
            <Link href={`${ROUTES.admin.brands}/new`}>
              <Button>Create brand</Button>
            </Link>
          </div>
        </div>
      </Card>

      {filteredBrands.length === 0 ? (
        <EmptyState description="Try another search term." title="No brands match this view" />
      ) : (
        <div className="space-y-4">
          {filteredBrands.map((brand) => (
            <Card key={brand.id} className="space-y-4 p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-3">
                  <AdminMerchandisingStatusBadge status={brand.status} />
                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-[-0.05em]">
                      {brand.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{brand.slug}</p>
                  </div>
                  <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                    {brand.description || "No brand description added yet."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link href={`${ROUTES.admin.brands}/${brand.id}/edit`}>
                    <Button variant="outline">Edit</Button>
                  </Link>
                  {brand.status !== "archived" ? (
                    <AdminArchiveRecordButton
                      endpoint={`/api/admin/brands/${brand.id}`}
                      label="Brand"
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
