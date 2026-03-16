import { Query } from "appwrite";
import { mockCategories, mockProducts } from "@/data/mock/catalog";
import { appwriteDatabases } from "@/lib/appwrite/client";
import { appwriteConfig } from "@/lib/appwrite/config";
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
      appwriteConfig.catalog.categoriesCollectionId &&
      appwriteConfig.catalog.productsCollectionId,
  );
}

function shouldUseCatalogMocks() {
  return appwriteConfig.catalog.enableMockFallback;
}

function handleCatalogError(error: unknown, context: string) {
  console.error(`Catalog service error: ${context}`, error);
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

function getActiveMockProducts() {
  return sortProducts(mockProducts.filter((product) => product.status === "active"));
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
    return shouldUseCatalogMocks() ? getActiveMockProducts() : [];
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

    return shouldUseCatalogMocks() ? getActiveMockProducts() : [];
  }
}

export async function getFeaturedProducts(limit = 8) {
  if (!canReadCatalogFromAppwrite()) {
    return shouldUseCatalogMocks()
      ? getActiveMockProducts().filter((product) => product.featured).slice(0, limit)
      : [];
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

    return shouldUseCatalogMocks()
      ? getActiveMockProducts().filter((product) => product.featured).slice(0, limit)
      : [];
  }
}

export async function getProductBySlug(slug: string) {
  if (!canReadCatalogFromAppwrite()) {
    return shouldUseCatalogMocks()
      ? getActiveMockProducts().find((product) => product.slug === slug) ?? null
      : null;
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

    return shouldUseCatalogMocks()
      ? getActiveMockProducts().find((product) => product.slug === slug) ?? null
      : null;
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
    return shouldUseCatalogMocks() ? [...mockCategories] : [];
  }

  try {
    return await listCategoryDocuments([Query.orderAsc("name")]);
  } catch (error) {
    handleCatalogError(error, "getAllCategories");

    return shouldUseCatalogMocks() ? [...mockCategories] : [];
  }
}

export async function getCategoryBySlug(slug: string) {
  if (!canReadCatalogFromAppwrite()) {
    return shouldUseCatalogMocks()
      ? mockCategories.find((category) => category.slug === slug) ?? null
      : null;
  }

  try {
    const categories = await listCategoryDocuments([
      Query.equal("slug", slug),
      Query.limit(1),
    ]);

    return categories[0] ?? null;
  } catch (error) {
    handleCatalogError(error, "getCategoryBySlug");

    return shouldUseCatalogMocks()
      ? mockCategories.find((category) => category.slug === slug) ?? null
      : null;
  }
}

export async function getProductsByCategory(categorySlug: string) {
  if (!canReadCatalogFromAppwrite()) {
    return shouldUseCatalogMocks()
      ? getActiveMockProducts().filter(
          (product) => product.category?.slug === categorySlug,
        )
      : [];
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

    return shouldUseCatalogMocks()
      ? getActiveMockProducts().filter(
          (product) => product.category?.slug === categorySlug,
        )
      : [];
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
  getCategoryBySlug,
  getFeaturedProducts,
  getProductBySlug,
  getProductsByCategory,
  getRelatedProducts,
  searchProducts,
};
