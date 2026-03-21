import { Query } from "appwrite";
import { appwriteDatabases } from "@/lib/appwrite/client";
import { appwriteConfig } from "@/lib/appwrite/config";
import { logAppwriteReadFallback } from "@/lib/appwrite/server-api";
import {
  mapCategoryDocumentToCategory,
  mapProductDocumentToProduct,
} from "@/lib/catalog/catalog-mappers";
import type {
  AppwriteCategoryDocument,
  AppwriteProductDocument,
  Product,
} from "@/types/catalog";

function canReadCatalogFromAppwrite() {
  return Boolean(
    appwriteConfig.databaseId &&
      appwriteConfig.endpoint &&
      appwriteConfig.catalog.categoriesCollectionId &&
      appwriteConfig.projectId &&
      appwriteConfig.catalog.productsCollectionId,
  );
}

function handleCatalogError(error: unknown, context: string) {
  logAppwriteReadFallback(
    `Catalog service error: ${context}`,
    error,
    "Using an empty catalog response.",
  );
}

function sortProducts(products: Product[]) {
  return [...products].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

async function listProductDocuments(queries: string[] = []) {
  const response = await appwriteDatabases.listDocuments<AppwriteProductDocument>({
    databaseId: appwriteConfig.databaseId,
    collectionId: appwriteConfig.catalog.productsCollectionId,
    queries,
    total: false,
  });

  return response.documents.map(mapProductDocumentToProduct);
}

async function listCategoryDocuments(queries: string[] = []) {
  const response =
    await appwriteDatabases.listDocuments<AppwriteCategoryDocument>({
      databaseId: appwriteConfig.databaseId,
      collectionId: appwriteConfig.catalog.categoriesCollectionId,
      queries,
      total: false,
    });

  return response.documents.map(mapCategoryDocumentToCategory);
}

function filterProductsBySearch(products: Product[], searchTerm: string) {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  if (!normalizedSearchTerm) {
    return [];
  }

  return products.filter((product) => {
    const haystack = [
      product.name,
      product.slug,
      product.sku,
      product.shortDescription,
      product.fullDescription,
      product.category?.name,
      product.brand?.name,
      ...product.tags,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedSearchTerm);
  });
}

export async function getAllProducts() {
  if (!canReadCatalogFromAppwrite()) {
    return [];
  }

  try {
    const products = await listProductDocuments([
      Query.equal("status", "active"),
      Query.orderDesc("featured"),
      Query.orderDesc("$createdAt"),
    ]);

    return sortProducts(products);
  } catch (error) {
    handleCatalogError(error, "getAllProducts");

    return [];
  }
}

export async function getProductsByIds(productIds: string[]) {
  if (productIds.length === 0) {
    return [];
  }

  if (!canReadCatalogFromAppwrite()) {
    return [];
  }

  try {
    const products = await listProductDocuments([
      Query.equal("status", "active"),
      Query.equal("$id", productIds),
    ]);

    return sortProducts(products).filter((product) => productIds.includes(product.id));
  } catch (error) {
    handleCatalogError(error, "getProductsByIds");

    return [];
  }
}

export async function getFeaturedProducts(limit = 8) {
  if (!canReadCatalogFromAppwrite()) {
    return [];
  }

  try {
    const products = await listProductDocuments([
      Query.equal("status", "active"),
      Query.equal("featured", true),
      Query.limit(limit),
      Query.orderDesc("$createdAt"),
    ]);

    return sortProducts(products).slice(0, limit);
  } catch (error) {
    handleCatalogError(error, "getFeaturedProducts");

    return [];
  }
}

export async function getProductBySlug(slug: string) {
  if (!canReadCatalogFromAppwrite()) {
    return null;
  }

  try {
    const products = await listProductDocuments([
      Query.equal("status", "active"),
      Query.equal("slug", slug),
      Query.limit(1),
    ]);

    return products[0] ?? null;
  } catch (error) {
    handleCatalogError(error, "getProductBySlug");

    return null;
  }
}

export async function getRelatedProducts(slug: string, limit = 4) {
  const currentProduct = await getProductBySlug(slug);

  if (!currentProduct) {
    return [];
  }

  const products = await getAllProducts();

  return products
    .filter((product) => product.slug !== currentProduct.slug)
    .map((product) => {
      let score = 0;

      if (
        product.category?.slug &&
        product.category.slug === currentProduct.category?.slug
      ) {
        score += 4;
      }

      if (
        product.brand?.slug &&
        product.brand.slug === currentProduct.brand?.slug
      ) {
        score += 2;
      }

      const overlappingTags = product.tags.filter((tag) =>
        currentProduct.tags.includes(tag),
      ).length;

      score += overlappingTags;

      return { product, score };
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map((item) => item.product);
}

export async function getAllCategories() {
  if (!canReadCatalogFromAppwrite()) {
    return [];
  }

  try {
    return await listCategoryDocuments([Query.orderAsc("name")]);
  } catch (error) {
    handleCatalogError(error, "getAllCategories");

    return [];
  }
}

export async function getCategoryBySlug(slug: string) {
  if (!canReadCatalogFromAppwrite()) {
    return null;
  }

  try {
    const categories = await listCategoryDocuments([
      Query.equal("slug", slug),
      Query.limit(1),
    ]);

    return categories[0] ?? null;
  } catch (error) {
    handleCatalogError(error, "getCategoryBySlug");

    return null;
  }
}

export async function getProductsByCategory(categorySlug: string) {
  if (!canReadCatalogFromAppwrite()) {
    return [];
  }

  try {
    const products = await listProductDocuments([
      Query.equal("status", "active"),
      Query.equal("categorySlug", categorySlug),
      Query.orderDesc("featured"),
      Query.orderDesc("$createdAt"),
    ]);

    return sortProducts(products);
  } catch (error) {
    handleCatalogError(error, "getProductsByCategory");

    return [];
  }
}

export async function searchProducts(searchTerm: string) {
  if (!searchTerm.trim()) {
    return [];
  }

  // This intentionally performs an in-memory search on the normalized product list.
  // It avoids coupling the first version of the catalog layer to Appwrite full-text
  // indexes, while still giving us a single reusable API that we can optimize later.
  const products = await getAllProducts();

  return filterProductsBySearch(products, searchTerm);
}

export type CatalogService = {
  getAllCategories: typeof getAllCategories;
  getAllProducts: typeof getAllProducts;
  getProductsByIds: typeof getProductsByIds;
  getCategoryBySlug: typeof getCategoryBySlug;
  getFeaturedProducts: typeof getFeaturedProducts;
  getProductBySlug: typeof getProductBySlug;
  getProductsByCategory: typeof getProductsByCategory;
  getRelatedProducts: typeof getRelatedProducts;
  searchProducts: typeof searchProducts;
};

export const catalogService: CatalogService = {
  getAllCategories,
  getAllProducts,
  getProductsByIds,
  getCategoryBySlug,
  getFeaturedProducts,
  getProductBySlug,
  getProductsByCategory,
  getRelatedProducts,
  searchProducts,
};
