import type { Models } from "appwrite";

export type ProductStatus = "draft" | "active" | "archived";

export type ProductImage = {
  id: string;
  url: string;
  alt: string;
  publicId?: string;
  isPrimary?: boolean;
  width?: number;
  height?: number;
};

export type ProductSpecification = {
  id: string;
  label: string;
  value: string;
  group?: string;
};

export type ProductVariant = {
  id: string;
  name: string;
  value: string;
  sku?: string;
  price?: number;
  salePrice?: number | null;
  stock?: number;
};

export type Brand = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo?: ProductImage | null;
  featured?: boolean;
};

export type CategoryReference = {
  id: string;
  name: string;
  slug: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: ProductImage | null;
  parentCategory: CategoryReference | null;
  featured: boolean;
};

export type RatingSummary = {
  average: number;
  max: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  createdAt: string;
  updatedAt: string;
  price: number;
  salePrice: number | null;
  stock: number;
  images: ProductImage[];
  category: CategoryReference | null;
  brand: Pick<Brand, "id" | "name" | "slug"> | null;
  featured: boolean;
  tags: string[];
  ratingSummary: RatingSummary;
  reviewCount: number;
  specifications: ProductSpecification[];
  variants: ProductVariant[];
  shortDescription: string;
  fullDescription: string;
  status: ProductStatus;
};

export type AppwriteCategoryDocument = Models.Document & {
  name?: string;
  slug?: string;
  description?: string;
  image?: unknown;
  parentCategory?: unknown;
  parentCategoryId?: string;
  parentCategoryName?: string;
  parentCategorySlug?: string;
  featured?: boolean;
};

export type AppwriteProductDocument = Models.Document & {
  name?: string;
  slug?: string;
  sku?: string;
  price?: number | string;
  salePrice?: number | string | null;
  stock?: number | string;
  images?: unknown;
  variants?: unknown;
  specifications?: unknown;
  category?: unknown;
  categoryId?: string;
  categoryName?: string;
  categorySlug?: string;
  brand?: unknown;
  brandId?: string;
  brandName?: string;
  brandSlug?: string;
  featured?: boolean;
  tags?: unknown;
  ratingAverage?: number | string;
  ratingMax?: number | string;
  reviewCount?: number | string;
  shortDescription?: string;
  fullDescription?: string;
  status?: string;
};

export type ProductAvailabilityFilter = "all" | "in-stock" | "out-of-stock";

export type ProductSortOption =
  | "newest"
  | "price-low-to-high"
  | "price-high-to-low"
  | "best-rated"
  | "featured";

export type CatalogListingQuery = {
  category: string;
  brand: string;
  availability: ProductAvailabilityFilter;
  featured: boolean;
  minPrice: string;
  maxPrice: string;
  page: number;
  pageSize: number;
  q: string;
  sort: ProductSortOption;
};

export type CatalogFacetOption = {
  count: number;
  label: string;
  value: string;
};

export type CatalogListingResponse = {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
  availableFilters: {
    brands: CatalogFacetOption[];
    categories: CatalogFacetOption[];
    priceRange: {
      max: number;
      min: number;
    };
  };
  appliedQuery: CatalogListingQuery;
};
