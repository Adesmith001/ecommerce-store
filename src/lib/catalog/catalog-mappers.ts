import { resolveCatalogAssetUrl } from "@/lib/catalog/catalog-media";
import type {
  AppwriteCategoryDocument,
  AppwriteProductDocument,
  Brand,
  Category,
  CategoryReference,
  Product,
  ProductImage,
  ProductSpecification,
  ProductStatus,
  ProductVariant,
} from "@/types/catalog";

function parseArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value as T[];
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }

  return [];
}

function parseObject<T>(value: unknown): T | null {
  if (!value) {
    return null;
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    return value as T;
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      return parsed && typeof parsed === "object" && !Array.isArray(parsed)
        ? (parsed as T)
        : null;
    } catch {
      return null;
    }
  }

  return null;
}

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function toStatus(value: unknown): ProductStatus {
  return value === "draft" || value === "archived" || value === "active"
    ? value
    : "draft";
}

function normalizeImage(value: unknown, fallbackAlt: string): ProductImage | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return {
      id: value,
      url: resolveCatalogAssetUrl(value),
      alt: fallbackAlt,
    };
  }

  const parsed = parseObject<{
    alt?: string;
    height?: number;
    id?: string;
    isPrimary?: boolean;
    publicId?: string;
    url?: string;
    width?: number;
  }>(value);

  if (!parsed) {
    return null;
  }

  const source = parsed.url ?? parsed.publicId ?? "";

  return {
    id: parsed.id ?? source ?? fallbackAlt,
    url: resolveCatalogAssetUrl(source),
    alt: parsed.alt ?? fallbackAlt,
    publicId: parsed.publicId,
    isPrimary: parsed.isPrimary,
    width: parsed.width,
    height: parsed.height,
  };
}

function normalizeImages(value: unknown, fallbackAlt: string): ProductImage[] {
  const images = parseArray<unknown>(value)
    .map((image, index) => normalizeImage(image, `${fallbackAlt} image ${index + 1}`))
    .filter((image): image is ProductImage => Boolean(image));

  if (images.length > 0) {
    return images;
  }

  const singleImage = normalizeImage(value, fallbackAlt);

  return singleImage ? [singleImage] : [];
}

function normalizeSpecifications(value: unknown): ProductSpecification[] {
  return parseArray<unknown>(value).reduce<ProductSpecification[]>(
    (specifications, spec, index) => {
      const parsed = parseObject<{
        group?: string;
        id?: string;
        label?: string;
        value?: string;
      }>(spec);

      if (!parsed?.label || !parsed.value) {
        return specifications;
      }

      specifications.push({
        id: parsed.id ?? `spec-${index + 1}`,
        label: parsed.label,
        value: parsed.value,
        group: parsed.group,
      });

      return specifications;
    },
    [],
  );
}

function normalizeVariants(value: unknown): ProductVariant[] {
  return parseArray<unknown>(value).reduce<ProductVariant[]>(
    (variants, variant, index) => {
      const parsed = parseObject<{
        id?: string;
        name?: string;
        price?: number | string;
        salePrice?: number | string | null;
        sku?: string;
        stock?: number | string;
        value?: string;
      }>(variant);

      if (!parsed?.name || !parsed.value) {
        return variants;
      }

      variants.push({
        id: parsed.id ?? `variant-${index + 1}`,
        name: parsed.name,
        value: parsed.value,
        sku: parsed.sku,
        price: parsed.price === undefined ? undefined : toNumber(parsed.price),
        salePrice:
          parsed.salePrice === undefined || parsed.salePrice === null
            ? null
            : toNumber(parsed.salePrice),
        stock: parsed.stock === undefined ? undefined : toNumber(parsed.stock),
      });

      return variants;
    },
    [],
  );
}

function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed.map(String).filter(Boolean);
      }
    } catch {
      return value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }
  }

  return [];
}

function normalizeCategoryReference(
  value: unknown,
  fallbacks: {
    id?: string;
    name?: string;
    slug?: string;
  },
): CategoryReference | null {
  const parsed = parseObject<{
    id?: string;
    name?: string;
    slug?: string;
  }>(value);

  const id = parsed?.id ?? fallbacks.id ?? "";
  const name = parsed?.name ?? fallbacks.name ?? "";
  const slug = parsed?.slug ?? fallbacks.slug ?? "";

  return id && name && slug ? { id, name, slug } : null;
}

function normalizeBrandReference(
  value: unknown,
  fallbacks: {
    id?: string;
    name?: string;
    slug?: string;
  },
): Pick<Brand, "id" | "name" | "slug"> | null {
  const parsed = parseObject<{
    id?: string;
    name?: string;
    slug?: string;
  }>(value);

  const id = parsed?.id ?? fallbacks.id ?? "";
  const name = parsed?.name ?? fallbacks.name ?? "";
  const slug = parsed?.slug ?? fallbacks.slug ?? "";

  return id && name && slug ? { id, name, slug } : null;
}

export function mapCategoryDocumentToCategory(
  document: AppwriteCategoryDocument,
): Category {
  const image = normalizeImage(document.image, document.name ?? "Category image");

  return {
    id: document.$id,
    name: document.name ?? "",
    slug: document.slug ?? "",
    description: document.description ?? "",
    image,
    parentCategory: normalizeCategoryReference(document.parentCategory, {
      id: document.parentCategoryId,
      name: document.parentCategoryName,
      slug: document.parentCategorySlug,
    }),
    featured: Boolean(document.featured),
  };
}

export function mapProductDocumentToProduct(document: AppwriteProductDocument): Product {
  return {
    id: document.$id,
    name: document.name ?? "",
    slug: document.slug ?? "",
    sku: document.sku ?? "",
    createdAt: document.$createdAt,
    updatedAt: document.$updatedAt,
    price: toNumber(document.price),
    salePrice:
      document.salePrice === null || document.salePrice === undefined
        ? null
        : toNumber(document.salePrice),
    stock: toNumber(document.stock),
    images: normalizeImages(document.images, document.name ?? "Product"),
    category: normalizeCategoryReference(document.category, {
      id: document.categoryId,
      name: document.categoryName,
      slug: document.categorySlug,
    }),
    brand: normalizeBrandReference(document.brand, {
      id: document.brandId,
      name: document.brandName,
      slug: document.brandSlug,
    }),
    featured: Boolean(document.featured),
    tags: normalizeTags(document.tags),
    ratingSummary: {
      average: toNumber(document.ratingAverage),
      max: toNumber(document.ratingMax, 5),
    },
    reviewCount: toNumber(document.reviewCount),
    specifications: normalizeSpecifications(document.specifications),
    variants: normalizeVariants(document.variants),
    shortDescription: document.shortDescription ?? "",
    fullDescription: document.fullDescription ?? "",
    status: toStatus(document.status),
  };
}
