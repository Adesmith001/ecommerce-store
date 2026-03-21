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
  const availabilityOptions: {
    label: string;
    value: CatalogListingQuery["availability"];
  }[] = [
    { label: "All products", value: "all" },
    { label: "In stock", value: "in-stock" },
    { label: "Out of stock", value: "out-of-stock" },
  ];

  return (
    <Card className="space-y-8 rounded-[1.8rem] bg-white/45 p-6 sm:p-7">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
            Refine view
          </p>
          <h2 className="font-display mt-3 text-4xl font-bold uppercase tracking-[-0.08em]">
            Filters
          </h2>
        </div>
        <Button onClick={onReset} size="sm" variant="outline">
          Reset
        </Button>
      </div>

      <div className="space-y-4">
        <p className="text-lg font-semibold uppercase tracking-[0.12em]">Category</p>
        <div className="grid gap-2">
          <button
            className={`rounded-[1rem] border px-4 py-3 text-left text-sm font-medium ${
              (lockedCategorySlug ?? query.category) === ""
                ? "border-foreground bg-foreground text-primary-foreground"
                : "border-border bg-white/60 text-foreground"
            }`}
            disabled={Boolean(lockedCategorySlug)}
            onClick={() => onCategoryChange("")}
            type="button"
          >
            All categories
          </button>
          {response.availableFilters.categories.map((category) => (
            <button
              key={category.value}
              className={`rounded-[1rem] border px-4 py-3 text-left text-sm font-medium ${
                (lockedCategorySlug ?? query.category) === category.value
                  ? "border-foreground bg-foreground text-primary-foreground"
                  : "border-border bg-white/60 text-foreground"
              }`}
              disabled={Boolean(lockedCategorySlug)}
              onClick={() => onCategoryChange(category.value)}
              type="button"
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-lg font-semibold uppercase tracking-[0.12em]">Brand</p>
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

      <div className="space-y-4">
        <p className="text-lg font-semibold uppercase tracking-[0.12em]">Availability</p>
        <div className="grid gap-2">
          {availabilityOptions.map((option) => (
            <button
              key={option.value}
              className={`rounded-[1rem] border px-4 py-3 text-left text-sm font-medium ${
                query.availability === option.value
                  ? "border-foreground bg-foreground text-primary-foreground"
                  : "border-border bg-white/60 text-foreground"
              }`}
              onClick={() => onAvailabilityChange(option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-lg font-semibold uppercase tracking-[0.12em]">Price range</p>
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

      <label className="flex items-center gap-3 rounded-[1rem] border border-border bg-white/60 px-4 py-3 text-sm font-medium">
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
