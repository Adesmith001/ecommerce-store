"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
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
    <div className="editorial-panel space-y-4 p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            {response.total} product{response.total === 1 ? "" : "s"} found
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.06em]">
            {query.q ? `Results for "${query.q}"` : "Discover the catalog"}
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px] lg:min-w-[560px]">
          <form
            key={query.q}
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              onSearchSubmit(String(formData.get("q") ?? ""));
            }}
          >
            <Input
              defaultValue={query.q}
              name="q"
              placeholder="Search products, brands, tags, or SKU"
            />
            <Button type="submit">Search</Button>
          </form>

          <Select
            onChange={(event) =>
              onSortChange(event.target.value as CatalogListingQuery["sort"])
            }
            value={query.sort}
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low-to-high">Price: low to high</option>
            <option value="price-high-to-low">Price: high to low</option>
            <option value="best-rated">Best rated</option>
          </Select>
        </div>
      </div>
    </div>
  );
}
