"use client";

import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductCard } from "@/components/storefront/catalog/product-card";
import { CatalogFilterPanel } from "@/components/storefront/catalog/catalog-filter-panel";
import { CatalogPagination } from "@/components/storefront/catalog/catalog-pagination";
import { CatalogToolbar } from "@/components/storefront/catalog/catalog-toolbar";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux";
import { createCatalogSearchParams } from "@/lib/catalog/catalog-query-state";
import {
  hydrateFromSearchParams,
  resetDiscoveryState,
  setAvailability,
  setBrand,
  setCategory,
  setFeatured,
  setMaxPrice,
  setMinPrice,
  setPage,
  setQuery,
  setSort,
} from "@/store/features/catalog/catalog-discovery-slice";
import { useGetProductListingQuery } from "@/store/services/catalog-api";

type CatalogListingViewProps = {
  lockedCategorySlug?: string;
};

export function CatalogListingView({
  lockedCategorySlug,
}: CatalogListingViewProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryState = useAppSelector((state) => state.catalogDiscovery);

  const searchParamsString = searchParams.toString();

  useEffect(() => {
    dispatch(
      hydrateFromSearchParams({
        lockedCategory: lockedCategorySlug,
        queryString: searchParamsString,
      }),
    );
  }, [dispatch, lockedCategorySlug, searchParamsString]);

  const requestQuery = useMemo(
    () => ({
      ...queryState,
      category: lockedCategorySlug ?? queryState.category,
    }),
    [lockedCategorySlug, queryState],
  );

  useEffect(() => {
    if (!queryState.initialized) {
      return;
    }

    const nextQuery = createCatalogSearchParams(requestQuery).toString();

    if (nextQuery === searchParamsString) {
      return;
    }

    const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;

    router.replace(nextUrl, { scroll: false });
  }, [pathname, queryState.initialized, requestQuery, router, searchParamsString]);

  const { data, error, isFetching, isLoading, refetch } = useGetProductListingQuery(
    requestQuery,
    {
      skip: !queryState.initialized,
    },
  );

  if (!queryState.initialized || isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full rounded-[2rem]" />
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <Skeleton className="h-[420px] w-full rounded-[2rem]" />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-[420px] w-full rounded-[2rem]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <EmptyState
        action={
          <button
            className="rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
            onClick={() => void refetch()}
            type="button"
          >
            Retry
          </button>
        }
        description="The catalog listing could not be loaded. Check your Appwrite setup or enable mock catalog fallback for local development."
        title="Unable to load products"
      />
    );
  }

  return (
    <div className="space-y-6">
      <CatalogToolbar
        onSearchSubmit={(value) => dispatch(setQuery(value))}
        onSortChange={(value) => dispatch(setSort(value))}
        query={requestQuery}
        response={data}
      />

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div>
          <CatalogFilterPanel
            lockedCategorySlug={lockedCategorySlug}
            onAvailabilityChange={(value) => dispatch(setAvailability(value))}
            onBrandChange={(value) => dispatch(setBrand(value))}
            onCategoryChange={(value) => dispatch(setCategory(value))}
            onFeaturedChange={(value) => dispatch(setFeatured(value))}
            onMaxPriceChange={(value) => dispatch(setMaxPrice(value))}
            onMinPriceChange={(value) => dispatch(setMinPrice(value))}
            onReset={() =>
              dispatch(resetDiscoveryState({ lockedCategory: lockedCategorySlug }))
            }
            query={requestQuery}
            response={data}
          />
        </div>

        <div className="space-y-6">
          {data.products.length === 0 ? (
            <EmptyState
              description="Try changing your search, filters, or sort options to surface more products."
              title="No products match this view"
            />
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {data.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <CatalogPagination
            onPageChange={(page) => dispatch(setPage(page))}
            page={data.page}
            totalPages={data.totalPages}
          />

          {isFetching ? (
            <p className="text-sm text-muted-foreground">Refreshing products...</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
