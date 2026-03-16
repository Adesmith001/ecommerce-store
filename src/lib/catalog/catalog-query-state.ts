import type {
  CatalogListingQuery,
  ProductAvailabilityFilter,
  ProductSortOption,
} from "@/types/catalog";

const DEFAULT_PAGE_SIZE = 8;

const DEFAULT_QUERY: CatalogListingQuery = {
  category: "",
  brand: "",
  availability: "all",
  featured: false,
  minPrice: "",
  maxPrice: "",
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  q: "",
  sort: "featured",
};

function getValue(
  input: URLSearchParams | Record<string, string | string[] | undefined>,
  key: string,
) {
  if (input instanceof URLSearchParams) {
    return input.get(key) ?? "";
  }

  const value = input[key];

  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function normalizeSort(value: string): ProductSortOption {
  return value === "newest" ||
    value === "price-low-to-high" ||
    value === "price-high-to-low" ||
    value === "best-rated" ||
    value === "featured"
    ? value
    : DEFAULT_QUERY.sort;
}

function normalizeAvailability(value: string): ProductAvailabilityFilter {
  return value === "in-stock" || value === "out-of-stock" || value === "all"
    ? value
    : DEFAULT_QUERY.availability;
}

function normalizePage(value: string, fallback: number) {
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function getDefaultCatalogListingQuery(
  overrides: Partial<CatalogListingQuery> = {},
): CatalogListingQuery {
  return {
    ...DEFAULT_QUERY,
    ...overrides,
  };
}

export function parseCatalogListingQuery(
  input: URLSearchParams | Record<string, string | string[] | undefined>,
  overrides: Partial<CatalogListingQuery> = {},
): CatalogListingQuery {
  const defaults = getDefaultCatalogListingQuery(overrides);

  return {
    category: getValue(input, "category") || defaults.category,
    brand: getValue(input, "brand") || defaults.brand,
    availability: normalizeAvailability(getValue(input, "availability")),
    featured: getValue(input, "featured") === "true" || defaults.featured,
    minPrice: getValue(input, "minPrice") || defaults.minPrice,
    maxPrice: getValue(input, "maxPrice") || defaults.maxPrice,
    page: normalizePage(getValue(input, "page"), defaults.page),
    pageSize: normalizePage(getValue(input, "pageSize"), defaults.pageSize),
    q: getValue(input, "q") || defaults.q,
    sort: normalizeSort(getValue(input, "sort")),
  };
}

export function createCatalogSearchParams(query: CatalogListingQuery) {
  const params = new URLSearchParams();

  if (query.q) params.set("q", query.q);
  if (query.category) params.set("category", query.category);
  if (query.brand) params.set("brand", query.brand);
  if (query.availability !== "all") params.set("availability", query.availability);
  if (query.featured) params.set("featured", "true");
  if (query.minPrice) params.set("minPrice", query.minPrice);
  if (query.maxPrice) params.set("maxPrice", query.maxPrice);
  if (query.sort !== DEFAULT_QUERY.sort) params.set("sort", query.sort);
  if (query.page !== DEFAULT_QUERY.page) params.set("page", String(query.page));
  if (query.pageSize !== DEFAULT_QUERY.pageSize) {
    params.set("pageSize", String(query.pageSize));
  }

  return params;
}
