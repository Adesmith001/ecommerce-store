import { getAllCategories, getAllProducts } from "@/lib/catalog/catalog-service";
import {
  getDefaultCatalogListingQuery,
  parseCatalogListingQuery,
} from "@/lib/catalog/catalog-query-state";
import type {
  CatalogFacetOption,
  CatalogListingQuery,
  CatalogListingResponse,
  Product,
} from "@/types/catalog";

function getEffectivePrice(product: Product) {
  return product.salePrice ?? product.price;
}

function filterProducts(products: Product[], query: CatalogListingQuery) {
  const normalizedSearch = query.q.trim().toLowerCase();
  const minPrice = query.minPrice ? Number(query.minPrice) : null;
  const maxPrice = query.maxPrice ? Number(query.maxPrice) : null;

  return products.filter((product) => {
    const effectivePrice = getEffectivePrice(product);
    const matchesSearch =
      !normalizedSearch ||
      [
        product.name,
        product.slug,
        product.sku,
        product.shortDescription,
        product.fullDescription,
        product.brand?.name,
        product.category?.name,
        ...product.tags,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);

    const matchesCategory =
      !query.category || product.category?.slug === query.category;
    const matchesBrand = !query.brand || product.brand?.slug === query.brand;
    const matchesAvailability =
      query.availability === "all" ||
      (query.availability === "in-stock" && product.stock > 0) ||
      (query.availability === "out-of-stock" && product.stock <= 0);
    const matchesFeatured = !query.featured || product.featured;
    const matchesMinPrice = minPrice === null || effectivePrice >= minPrice;
    const matchesMaxPrice = maxPrice === null || effectivePrice <= maxPrice;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesBrand &&
      matchesAvailability &&
      matchesFeatured &&
      matchesMinPrice &&
      matchesMaxPrice
    );
  });
}

function sortProducts(products: Product[], sort: CatalogListingQuery["sort"]) {
  const items = [...products];

  switch (sort) {
    case "newest":
      return items.sort(
        (left, right) =>
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      );
    case "price-low-to-high":
      return items.sort(
        (left, right) => getEffectivePrice(left) - getEffectivePrice(right),
      );
    case "price-high-to-low":
      return items.sort(
        (left, right) => getEffectivePrice(right) - getEffectivePrice(left),
      );
    case "best-rated":
      return items.sort(
        (left, right) =>
          right.ratingSummary.average - left.ratingSummary.average ||
          right.reviewCount - left.reviewCount,
      );
    case "featured":
    default:
      return items.sort(
        (left, right) =>
          Number(right.featured) - Number(left.featured) ||
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
      );
  }
}

function createFacetOptions(
  values: Array<{ label: string; value: string }>,
): CatalogFacetOption[] {
  const counts = new Map<string, CatalogFacetOption>();

  values.forEach((item) => {
    if (!item.value) {
      return;
    }

    const existing = counts.get(item.value);

    if (existing) {
      existing.count += 1;
      return;
    }

    counts.set(item.value, {
      count: 1,
      label: item.label,
      value: item.value,
    });
  });

  return [...counts.values()].sort((left, right) =>
    left.label.localeCompare(right.label),
  );
}

export async function getCatalogListing(
  partialQuery: Partial<CatalogListingQuery> = {},
): Promise<CatalogListingResponse> {
  const query = getDefaultCatalogListingQuery(partialQuery);
  const [allProducts, allCategories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  const filteredProducts = filterProducts(allProducts, query);
  const sortedProducts = sortProducts(filteredProducts, query.sort);
  const total = sortedProducts.length;
  const totalPages = total === 0 ? 1 : Math.ceil(total / query.pageSize);
  const page = Math.min(query.page, totalPages);
  const startIndex = (page - 1) * query.pageSize;
  const products = sortedProducts.slice(startIndex, startIndex + query.pageSize);
  const prices = allProducts.map(getEffectivePrice);

  return {
    products,
    total,
    page,
    pageSize: query.pageSize,
    totalPages,
    hasMore: page < totalPages,
    availableFilters: {
      brands: createFacetOptions(
        allProducts.map((product) => ({
          label: product.brand?.name ?? "",
          value: product.brand?.slug ?? "",
        })),
      ),
      categories: createFacetOptions(
        allProducts.map((product) => ({
          label:
            allCategories.find((category) => category.slug === product.category?.slug)
              ?.name ??
            product.category?.name ??
            "",
          value: product.category?.slug ?? "",
        })),
      ),
      priceRange: {
        min: prices.length > 0 ? Math.min(...prices) : 0,
        max: prices.length > 0 ? Math.max(...prices) : 0,
      },
    },
    appliedQuery: {
      ...query,
      page,
    },
  };
}

export function parseCatalogListingRequest(
  input: URLSearchParams | Record<string, string | string[] | undefined>,
  overrides: Partial<CatalogListingQuery> = {},
) {
  return parseCatalogListingQuery(input, overrides);
}
