"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ROUTES } from "@/constants/routes";
import type { CatalogListingQuery, CatalogListingResponse } from "@/types/catalog";

type CatalogToolbarProps = {
  onSearchSubmit: (value: string) => void;
  onSortChange: (value: CatalogListingQuery["sort"]) => void;
  query: CatalogListingQuery;
  response: CatalogListingResponse;
};

export function CatalogToolbar({
  onSearchSubmit,
  onSortChange,
  query,
  response,
}: CatalogToolbarProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          <Link href={ROUTES.storefront.home}>Home</Link> / <span className="font-medium text-foreground">Products</span>
        </p>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              {response.total} product{response.total === 1 ? "" : "s"} found
            </p>
            <h2 className="font-display mt-3 text-4xl font-bold uppercase tracking-[-0.08em]">
              {query.q ? `Results for "${query.q}"` : "Products"}
            </h2>
          </div>

          <div className="grid gap-3 lg:min-w-[540px] lg:grid-cols-[minmax(0,1fr)_220px]">
            <form
              key={query.q}
              className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_120px]"
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                onSearchSubmit(String(formData.get("q") ?? ""));
              }}
            >
              <Input
                defaultValue={query.q}
                name="q"
                placeholder="Search the collection"
              />
              <Button type="submit" variant="secondary">
                Search
              </Button>
            </form>

            <Select
              onChange={(event) =>
                onSortChange(event.target.value as CatalogListingQuery["sort"])
              }
              value={query.sort}
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low-to-high">Less to more</option>
              <option value="price-high-to-low">More to less</option>
              <option value="best-rated">Best rated</option>
            </Select>
          </div>
        </div>
      </div>

      {response.availableFilters.categories.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {response.availableFilters.categories.slice(0, 8).map((category) => (
            <span
              key={category.value}
              className="inline-flex rounded-full border border-border bg-white/55 px-4 py-2 text-sm uppercase tracking-[0.14em] text-foreground/78"
            >
              {category.label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
