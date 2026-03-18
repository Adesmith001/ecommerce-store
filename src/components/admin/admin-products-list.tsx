"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminArchiveProductButton } from "@/components/admin/admin-archive-product-button";
import { AdminProductStatusBadge } from "@/components/admin/admin-product-status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { formatCurrency } from "@/helpers/format-currency";
import type { AdminProductListItem } from "@/types/admin-product";

type AdminProductsListProps = {
  products: AdminProductListItem[];
};

export function AdminProductsList({ products }: AdminProductsListProps) {
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return products;
    }

    return products.filter((product) =>
      [product.name, product.slug, product.category?.name, product.brand?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [products, query]);

  if (products.length === 0) {
    return (
      <EmptyState
        action={
          <Link href={`${ROUTES.admin.products}/new`}>
            <Button>Create your first product</Button>
          </Link>
        }
        description="Products you create here will flow into the storefront catalog layer."
        title="No products yet"
      />
    );
  }

  return (
    <div className="space-y-5">
      <Card className="space-y-4 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Product manager
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
              Catalog products
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, slug, or brand..."
              value={query}
            />
            <Link href={`${ROUTES.admin.products}/new`}>
              <Button>Create product</Button>
            </Link>
          </div>
        </div>
      </Card>

      {filteredProducts.length === 0 ? (
        <EmptyState
          description="Try another search term."
          title="No products match this view"
        />
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="space-y-4 p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <AdminProductStatusBadge status={product.status} />
                    {product.featured ? (
                      <span className="rounded-full border border-accent/15 bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-[-0.05em]">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {product.slug}
                    </p>
                  </div>
                  <div className="grid gap-3 text-sm sm:grid-cols-4">
                    <div className="rounded-[1.2rem] border border-white/80 bg-white/72 px-3 py-3">
                      <p className="text-muted-foreground">Price</p>
                      <p className="mt-1 font-medium">
                        {formatCurrency(product.salePrice ?? product.price)}
                      </p>
                    </div>
                    <div className="rounded-[1.2rem] border border-white/80 bg-white/72 px-3 py-3">
                      <p className="text-muted-foreground">Stock</p>
                      <p className="mt-1 font-medium">{product.stock}</p>
                    </div>
                    <div className="rounded-[1.2rem] border border-white/80 bg-white/72 px-3 py-3">
                      <p className="text-muted-foreground">Category</p>
                      <p className="mt-1 font-medium">
                        {product.category?.name ?? "Unassigned"}
                      </p>
                    </div>
                    <div className="rounded-[1.2rem] border border-white/80 bg-white/72 px-3 py-3">
                      <p className="text-muted-foreground">Brand</p>
                      <p className="mt-1 font-medium">
                        {product.brand?.name ?? "Unassigned"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link href={`${ROUTES.admin.products}/${product.id}`}>
                    <Button variant="outline">View</Button>
                  </Link>
                  <Link href={`${ROUTES.admin.products}/${product.id}/edit`}>
                    <Button variant="outline">Edit</Button>
                  </Link>
                  {product.status !== "archived" ? (
                    <AdminArchiveProductButton productId={product.id} />
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

