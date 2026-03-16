"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { CatalogListingQuery, CatalogListingResponse } from "@/types/catalog";

type CatalogFilterPanelProps = {
  lockedCategorySlug?: string;
  onAvailabilityChange: (value: CatalogListingQuery["availability"]) => void;
  onBrandChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onFeaturedChange: (value: boolean) => void;
  onMaxPriceChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onReset: () => void;
  query: CatalogListingQuery;
  response: CatalogListingResponse;
};

export function CatalogFilterPanel({
  lockedCategorySlug,
  onAvailabilityChange,
  onBrandChange,
  onCategoryChange,
  onFeaturedChange,
  onMaxPriceChange,
  onMinPriceChange,
  onReset,
  query,
  response,
}: CatalogFilterPanelProps) {
  return (
    <Card className="space-y-5 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button onClick={onReset} size="sm" variant="outline">
          Reset
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="catalog-category">
          Category
        </label>
        <Select
          disabled={Boolean(lockedCategorySlug)}
          id="catalog-category"
          onChange={(event) => onCategoryChange(event.target.value)}
          value={lockedCategorySlug ?? query.category}
        >
          <option value="">All categories</option>
          {response.availableFilters.categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label} ({category.count})
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="catalog-brand">
          Brand
        </label>
        <Select
          id="catalog-brand"
          onChange={(event) => onBrandChange(event.target.value)}
          value={query.brand}
        >
          <option value="">All brands</option>
          {response.availableFilters.brands.map((brand) => (
            <option key={brand.value} value={brand.value}>
              {brand.label} ({brand.count})
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="catalog-availability">
          Availability
        </label>
        <Select
          id="catalog-availability"
          onChange={(event) =>
            onAvailabilityChange(event.target.value as CatalogListingQuery["availability"])
          }
          value={query.availability}
        >
          <option value="all">All products</option>
          <option value="in-stock">In stock</option>
          <option value="out-of-stock">Out of stock</option>
        </Select>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium">Price range</p>
        <div className="grid grid-cols-2 gap-3">
          <Input
            inputMode="numeric"
            onChange={(event) => onMinPriceChange(event.target.value)}
            placeholder={`Min (${response.availableFilters.priceRange.min})`}
            value={query.minPrice}
          />
          <Input
            inputMode="numeric"
            onChange={(event) => onMaxPriceChange(event.target.value)}
            placeholder={`Max (${response.availableFilters.priceRange.max})`}
            value={query.maxPrice}
          />
        </div>
      </div>

      <label className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-medium">
        <input
          checked={query.featured}
          className="h-4 w-4 accent-[var(--primary)]"
          onChange={(event) => onFeaturedChange(event.target.checked)}
          type="checkbox"
        />
        Featured products only
      </label>
    </Card>
  );
}
