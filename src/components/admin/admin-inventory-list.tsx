"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { PRODUCT_LOW_STOCK_THRESHOLD } from "@/constants/admin";
import { ROUTES } from "@/constants/routes";
import type {
  AdminInventoryFilter,
  AdminInventoryProduct,
} from "@/types/admin-inventory";

type AdminInventoryListProps = {
  products: AdminInventoryProduct[];
};

type SavingState = Record<string, boolean>;
type DraftState = Record<string, string>;
type RowMessageState = Record<string, string | null>;

const FILTER_OPTIONS: { label: string; value: AdminInventoryFilter }[] = [
  { label: "All products", value: "all" },
  { label: "Low stock", value: "low-stock" },
  { label: "Out of stock", value: "out-of-stock" },
  { label: "Active only", value: "active" },
];

function applyInventoryFilter(
  products: AdminInventoryProduct[],
  filter: AdminInventoryFilter,
) {
  if (filter === "low-stock") {
    return products.filter((product) => product.isLowStock);
  }

  if (filter === "out-of-stock") {
    return products.filter((product) => product.isOutOfStock);
  }

  if (filter === "active") {
    return products.filter((product) => product.status === "active");
  }

  return products;
}

export function AdminInventoryList({ products }: AdminInventoryListProps) {
  const [items, setItems] = useState(products);
  const [filter, setFilter] = useState<AdminInventoryFilter>("all");
  const [query, setQuery] = useState("");
  const [draftStock, setDraftStock] = useState<DraftState>(() =>
    Object.fromEntries(products.map((product) => [product.id, String(product.stock)])),
  );
  const [isSaving, setIsSaving] = useState<SavingState>({});
  const [rowErrors, setRowErrors] = useState<RowMessageState>({});
  const [rowSuccess, setRowSuccess] = useState<RowMessageState>({});

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const filtered = applyInventoryFilter(items, filter);

    if (!normalizedQuery) {
      return filtered;
    }

    return filtered.filter((product) =>
      [product.name, product.sku, product.categoryName, product.status]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [filter, items, query]);

  const lowStockCount = items.filter((product) => product.isLowStock).length;
  const outOfStockCount = items.filter((product) => product.isOutOfStock).length;
  const activeCount = items.filter((product) => product.status === "active").length;

  if (products.length === 0) {
    return (
      <EmptyState
        action={
          <Link href={`${ROUTES.admin.products}/new`}>
            <Button>Create your first product</Button>
          </Link>
        }
        description="Inventory appears here as soon as you create products with stock values."
        title="No inventory yet"
      />
    );
  }

  return (
    <div className="space-y-5">
      <Card className="space-y-5 p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Inventory manager
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
              Stock visibility and quick adjustments
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
              Low stock means between 1 and {PRODUCT_LOW_STOCK_THRESHOLD} units left.
              Out of stock means the current stock is 0.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by product, SKU, category..."
              value={query}
            />
            <Link href={ROUTES.admin.products}>
              <Button variant="outline">Open products</Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[1.4rem] border border-white/80 bg-white/72 px-4 py-4">
            <p className="text-sm text-muted-foreground">Low stock alerts</p>
            <p className="font-display mt-2 text-3xl font-semibold tracking-[-0.05em]">
              {lowStockCount}
            </p>
          </div>
          <div className="rounded-[1.4rem] border border-white/80 bg-white/72 px-4 py-4">
            <p className="text-sm text-muted-foreground">Out of stock</p>
            <p className="font-display mt-2 text-3xl font-semibold tracking-[-0.05em]">
              {outOfStockCount}
            </p>
          </div>
          <div className="rounded-[1.4rem] border border-white/80 bg-white/72 px-4 py-4">
            <p className="text-sm text-muted-foreground">Active products</p>
            <p className="font-display mt-2 text-3xl font-semibold tracking-[-0.05em]">
              {activeCount}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((option) => {
            const active = option.value === filter;

            return (
              <button
                key={option.value}
                className={
                  active
                    ? "rounded-full bg-foreground px-4 py-2 text-sm font-medium text-white"
                    : "rounded-full border border-white/80 bg-white/70 px-4 py-2 text-sm font-medium text-muted-foreground"
                }
                onClick={() => setFilter(option.value)}
                type="button"
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </Card>

      {filteredProducts.length === 0 ? (
        <EmptyState
          description="Try another filter or search term."
          title="No products match this inventory view"
        />
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="space-y-4 p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={product.isOutOfStock ? "danger" : "outline"}>
                      {product.status}
                    </Badge>
                    {product.isOutOfStock ? (
                      <Badge variant="danger">Out of stock</Badge>
                    ) : null}
                    {product.isLowStock ? (
                      <Badge variant="secondary">Low stock</Badge>
                    ) : null}
                  </div>

                  <div>
                    <h3 className="font-display text-2xl font-semibold tracking-[-0.05em]">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {product.sku} · {product.categoryName}
                    </p>
                  </div>

                  <div className="grid gap-3 text-sm sm:grid-cols-3">
                    <div className="rounded-[1.2rem] border border-white/80 bg-white/72 px-3 py-3">
                      <p className="text-muted-foreground">Current stock</p>
                      <p className="mt-1 font-medium">{product.stock}</p>
                    </div>
                    <div className="rounded-[1.2rem] border border-white/80 bg-white/72 px-3 py-3">
                      <p className="text-muted-foreground">Status</p>
                      <p className="mt-1 font-medium capitalize">{product.status}</p>
                    </div>
                    <div className="rounded-[1.2rem] border border-white/80 bg-white/72 px-3 py-3">
                      <p className="text-muted-foreground">Updated</p>
                      <p className="mt-1 font-medium">
                        {new Date(product.updatedAt).toLocaleDateString("en-US")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="w-full space-y-3 xl:max-w-xs">
                  <label className="text-sm font-medium">Quick stock edit</label>
                  <div className="flex gap-2">
                    <Input
                      inputMode="numeric"
                      min={0}
                      onChange={(event) => {
                        setDraftStock((current) => ({
                          ...current,
                          [product.id]: event.target.value,
                        }));
                        setRowErrors((current) => ({ ...current, [product.id]: null }));
                        setRowSuccess((current) => ({ ...current, [product.id]: null }));
                      }}
                      type="number"
                      value={draftStock[product.id] ?? String(product.stock)}
                    />
                    <Button
                      disabled={Boolean(isSaving[product.id])}
                      onClick={async () => {
                        const nextStock = Number(draftStock[product.id]);

                        if (!Number.isInteger(nextStock) || nextStock < 0) {
                          setRowErrors((current) => ({
                            ...current,
                            [product.id]:
                              "Enter a whole number greater than or equal to zero.",
                          }));
                          return;
                        }

                        setIsSaving((current) => ({ ...current, [product.id]: true }));
                        setRowErrors((current) => ({ ...current, [product.id]: null }));
                        setRowSuccess((current) => ({ ...current, [product.id]: null }));

                        try {
                          const response = await fetch(`/api/admin/inventory/${product.id}`, {
                            body: JSON.stringify({ stock: nextStock }),
                            headers: { "Content-Type": "application/json" },
                            method: "PATCH",
                          });

                          const payload = (await response.json()) as {
                            message?: string;
                            product?: AdminInventoryProduct;
                          };

                          if (!response.ok || !payload.product) {
                            throw new Error(payload.message ?? "Failed to update inventory.");
                          }

                          const updatedProduct = payload.product;

                          setItems((current) =>
                            current.map((item) =>
                              item.id === product.id ? updatedProduct : item,
                            ),
                          );
                          setDraftStock((current) => ({
                            ...current,
                            [product.id]: String(updatedProduct.stock),
                          }));
                          setRowSuccess((current) => ({
                            ...current,
                            [product.id]: "Stock updated.",
                          }));
                        } catch (error) {
                          setRowErrors((current) => ({
                            ...current,
                            [product.id]:
                              error instanceof Error
                                ? error.message
                                : "Failed to update inventory.",
                          }));
                        } finally {
                          setIsSaving((current) => ({ ...current, [product.id]: false }));
                        }
                      }}
                    >
                      {isSaving[product.id] ? "Saving..." : "Save"}
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link href={`${ROUTES.admin.products}/${product.id}/edit`}>
                      <Button variant="outline">Open full product edit</Button>
                    </Link>
                  </div>

                  {rowErrors[product.id] ? (
                    <p className="text-sm text-danger">{rowErrors[product.id]}</p>
                  ) : null}
                  {rowSuccess[product.id] ? (
                    <p className="text-sm text-success">{rowSuccess[product.id]}</p>
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
