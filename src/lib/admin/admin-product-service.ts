import "server-only";

import { ID, Query } from "appwrite";
import { mockBrands, mockCategories, mockProducts } from "@/data/mock/catalog";
import { appwriteDatabases } from "@/lib/appwrite/client";
import { appwriteConfig } from "@/lib/appwrite/config";
import { buildAppwriteApiUrl, getAppwriteErrorMessage } from "@/lib/appwrite/server-api";
import { mapBrandDocumentToBrand, mapProductDocumentToProduct } from "@/lib/catalog/catalog-mappers";
import { slugifyProductName, validateAdminProductForm } from "@/lib/admin/admin-product-validation";
import type {
  AdminManagedProduct,
  AdminProductFormContext,
  AdminProductFormImage,
  AdminProductFormOptions,
  AdminProductFormSpecification,
  AdminProductFormValues,
  AdminProductReferenceOption,
} from "@/types/admin-product";
import type {
  AppwriteBrandDocument,
  AppwriteCategoryDocument,
  AppwriteProductDocument,
  Category,
  Product,
} from "@/types/catalog";

type ProductReference = {
  id: string;
  name: string;
  slug: string;
};

function canManageProducts() {
  return Boolean(
    appwriteConfig.databaseId &&
      appwriteConfig.catalog.productsCollectionId &&
      appwriteConfig.apiKey &&
      appwriteConfig.projectId &&
      appwriteConfig.endpoint,
  );
}

function canReadBrands() {
  return Boolean(
    appwriteConfig.databaseId && appwriteConfig.catalog.brandsCollectionId,
  );
}

function createAppwriteHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Appwrite-Key": appwriteConfig.apiKey,
    "X-Appwrite-Project": appwriteConfig.projectId,
  };
}

function mapProductForAdmin(product: Product): AdminManagedProduct {
  return {
    ...product,
    brandOptionId: product.brand?.id ?? "",
    categoryOptionId: product.category?.id ?? "",
  };
}

function mapReferenceOptions(
  items: { id: string; name: string; slug: string }[],
): AdminProductReferenceOption[] {
  return items.map((item) => ({
    id: item.id,
    label: item.name,
    slug: item.slug,
  }));
}

function normalizeTagInput(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function normalizeSpecificationInput(values: AdminProductFormSpecification[]) {
  return values
    .map((specification, index) => ({
      group: specification.group?.trim() || undefined,
      id: specification.id || `spec-${index + 1}`,
      label: specification.label.trim(),
      value: specification.value.trim(),
    }))
    .filter((specification) => specification.label && specification.value);
}

function normalizeImageInput(values: AdminProductFormImage[]) {
  return values
    .map((image, index) => ({
      alt: image.alt.trim() || `Product image ${index + 1}`,
      id: image.id || image.publicId || `image-${index + 1}`,
      isPrimary: index === 0,
      publicId: image.publicId?.trim() || undefined,
      url: image.url.trim(),
    }))
    .filter((image) => image.url);
}

function buildEmptyFormValues(): AdminProductFormValues {
  return {
    brandId: "",
    categoryId: "",
    featured: false,
    fullDescription: "",
    images: [],
    name: "",
    price: "",
    salePrice: "",
    shortDescription: "",
    sku: "",
    slug: "",
    specifications: [{ id: "spec-1", label: "", value: "", group: "" }],
    status: "draft",
    stock: "0",
    tags: "",
  };
}

function mapProductToFormValues(product: AdminManagedProduct): AdminProductFormValues {
  return {
    brandId: product.brandOptionId,
    categoryId: product.categoryOptionId,
    featured: product.featured,
    fullDescription: product.fullDescription,
    images: product.images.map((image, index) => ({
      alt: image.alt,
      id: image.id || `image-${index + 1}`,
      isPrimary: index === 0,
      publicId: image.publicId,
      url: image.url,
    })),
    name: product.name,
    price: String(product.price),
    salePrice: product.salePrice === null ? "" : String(product.salePrice),
    shortDescription: product.shortDescription,
    sku: product.sku,
    slug: product.slug,
    specifications:
      product.specifications.length > 0
        ? product.specifications.map((specification) => ({
            group: specification.group ?? "",
            id: specification.id,
            label: specification.label,
            value: specification.value,
          }))
        : [{ id: "spec-1", label: "", value: "", group: "" }],
    status: product.status,
    stock: String(product.stock),
    tags: product.tags.join(", "),
  };
}

async function listBrandDocuments() {
  const response = await appwriteDatabases.listDocuments<AppwriteBrandDocument>({
    collectionId: appwriteConfig.catalog.brandsCollectionId,
    databaseId: appwriteConfig.databaseId,
    queries: [Query.orderAsc("name")],
    total: false,
  });

  return response.documents.map(mapBrandDocumentToBrand);
}

async function getCategoryReference(categoryId: string): Promise<ProductReference | null> {
  if (!categoryId) {
    return null;
  }

  if (!appwriteConfig.catalog.categoriesCollectionId) {
    const fallback = mockCategories.find((category) => category.id === categoryId);
    return fallback ? { id: fallback.id, name: fallback.name, slug: fallback.slug } : null;
  }

  const category = await appwriteDatabases.getDocument<AppwriteCategoryDocument>({
    collectionId: appwriteConfig.catalog.categoriesCollectionId,
    databaseId: appwriteConfig.databaseId,
    documentId: categoryId,
  });

  return category.name && category.slug
    ? { id: category.$id, name: category.name, slug: category.slug }
    : null;
}

async function getBrandReference(brandId: string): Promise<ProductReference | null> {
  if (!brandId) {
    return null;
  }

  if (!appwriteConfig.catalog.brandsCollectionId) {
    const fallback = mockBrands.find((brand) => brand.id === brandId);
    return fallback ? { id: fallback.id, name: fallback.name, slug: fallback.slug } : null;
  }

  const brand = await appwriteDatabases.getDocument<AppwriteBrandDocument>({
    collectionId: appwriteConfig.catalog.brandsCollectionId,
    databaseId: appwriteConfig.databaseId,
    documentId: brandId,
  });

  return brand.name && brand.slug
    ? { id: brand.$id, name: brand.name, slug: brand.slug }
    : null;
}

async function assertUniqueProductIdentity(
  values: AdminProductFormValues,
  currentProductId?: string,
) {
  const slugMatches = await appwriteDatabases.listDocuments<AppwriteProductDocument>({
    collectionId: appwriteConfig.catalog.productsCollectionId,
    databaseId: appwriteConfig.databaseId,
    queries: [Query.equal("slug", values.slug.trim()), Query.limit(1)],
    total: false,
  });

  const duplicateSlug = slugMatches.documents[0];
  if (duplicateSlug && duplicateSlug.$id !== currentProductId) {
    throw new Error("Another product already uses this slug.");
  }

  const skuMatches = await appwriteDatabases.listDocuments<AppwriteProductDocument>({
    collectionId: appwriteConfig.catalog.productsCollectionId,
    databaseId: appwriteConfig.databaseId,
    queries: [Query.equal("sku", values.sku.trim()), Query.limit(1)],
    total: false,
  });

  const duplicateSku = skuMatches.documents[0];
  if (duplicateSku && duplicateSku.$id !== currentProductId) {
    throw new Error("Another product already uses this SKU.");
  }
}

async function persistProductDocument(
  method: "PATCH" | "POST",
  values: AdminProductFormValues,
  productId?: string,
) {
  if (!canManageProducts()) {
    throw new Error("Appwrite product management is not configured.");
  }

  const validationErrors = validateAdminProductForm(values);
  if (Object.keys(validationErrors).length > 0) {
    throw new Error("Please fix the highlighted product form fields.");
  }

  await assertUniqueProductIdentity(values, productId);

  const [categoryReference, brandReference] = await Promise.all([
    getCategoryReference(values.categoryId),
    getBrandReference(values.brandId),
  ]);

  if (!categoryReference) {
    throw new Error("Select a valid category.");
  }

  const body = {
    data: {
      brandId: brandReference?.id ?? "",
      brandName: brandReference?.name ?? "",
      brandSlug: brandReference?.slug ?? "",
      categoryId: categoryReference.id,
      categoryName: categoryReference.name,
      categorySlug: categoryReference.slug,
      featured: values.featured,
      fullDescription: values.fullDescription.trim(),
      images: normalizeImageInput(values.images).map((image) =>
        JSON.stringify(image),
      ),
      price: Number(values.price),
      ratingAverage: 0,
      ratingMax: 5,
      reviewCount: 0,
      salePrice: values.salePrice.trim() ? Number(values.salePrice) : null,
      shortDescription: values.shortDescription.trim(),
      sku: values.sku.trim(),
      slug: values.slug.trim(),
      specifications: normalizeSpecificationInput(values.specifications).map(
        (specification) => JSON.stringify(specification),
      ),
      status: values.status,
      stock: Number(values.stock),
      tags: JSON.stringify(normalizeTagInput(values.tags)),
      variants: [],
      name: values.name.trim(),
    },
    ...(method === "POST" ? { documentId: ID.unique() } : {}),
  };

  const url =
    method === "POST"
      ? buildAppwriteApiUrl(
          `/databases/${appwriteConfig.databaseId}/collections/${appwriteConfig.catalog.productsCollectionId}/documents`,
        )
      : buildAppwriteApiUrl(
          `/databases/${appwriteConfig.databaseId}/collections/${appwriteConfig.catalog.productsCollectionId}/documents/${productId}`,
        );

  const response = await fetch(url, {
    body: JSON.stringify(body),
    headers: createAppwriteHeaders(),
    method,
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to save product."),
    );
  }

  const document = (await response.json()) as AppwriteProductDocument;
  return mapProductForAdmin(mapProductDocumentToProduct(document));
}

export async function listAdminProducts() {
  if (!appwriteConfig.databaseId || !appwriteConfig.catalog.productsCollectionId) {
    return mockProducts.map(mapProductForAdmin);
  }

  const response = await appwriteDatabases.listDocuments<AppwriteProductDocument>({
    collectionId: appwriteConfig.catalog.productsCollectionId,
    databaseId: appwriteConfig.databaseId,
    queries: [Query.orderDesc("$updatedAt")],
    total: false,
  });

  return response.documents.map((document) =>
    mapProductForAdmin(mapProductDocumentToProduct(document)),
  );
}

export async function getAdminProductById(productId: string) {
  if (!appwriteConfig.databaseId || !appwriteConfig.catalog.productsCollectionId) {
    const fallback = mockProducts.find((product) => product.id === productId);
    return fallback ? mapProductForAdmin(fallback) : null;
  }

  try {
    const document = await appwriteDatabases.getDocument<AppwriteProductDocument>({
      collectionId: appwriteConfig.catalog.productsCollectionId,
      databaseId: appwriteConfig.databaseId,
      documentId: productId,
    });

    return mapProductForAdmin(mapProductDocumentToProduct(document));
  } catch {
    return null;
  }
}

export async function getAdminProductFormOptions(): Promise<AdminProductFormOptions> {
  const categories = appwriteConfig.catalog.categoriesCollectionId
    ? await appwriteDatabases
        .listDocuments<AppwriteCategoryDocument>({
          collectionId: appwriteConfig.catalog.categoriesCollectionId,
          databaseId: appwriteConfig.databaseId,
          queries: [Query.orderAsc("name")],
          total: false,
        })
        .then((response) =>
          response.documents.map<Category>((document) => ({
            description: document.description ?? "",
            featured: Boolean(document.featured),
            id: document.$id,
            image: null,
            name: document.name ?? "",
            parentCategory: null,
            slug: document.slug ?? "",
            status: document.status === "archived" ? "archived" : "active",
          })),
        )
    : [...mockCategories];

  const brands = canReadBrands() ? await listBrandDocuments() : [...mockBrands];

  return {
    brands: brands.filter((brand) => brand.status !== "archived"),
    categories: categories.filter((category) => category.status !== "archived"),
  };
}

export async function getAdminProductFormContext(
  mode: "create" | "edit",
  productId?: string,
): Promise<AdminProductFormContext> {
  const options = await getAdminProductFormOptions();
  const product = productId ? await getAdminProductById(productId) : null;

  return {
    brands: mapReferenceOptions(options.brands),
    categories: mapReferenceOptions(options.categories),
    initialValues: product ? mapProductToFormValues(product) : buildEmptyFormValues(),
    mode,
    productId,
  };
}

export async function createAdminProduct(values: AdminProductFormValues) {
  return persistProductDocument("POST", {
    ...values,
    slug: values.slug.trim() || slugifyProductName(values.name),
  });
}

export async function updateAdminProduct(
  productId: string,
  values: AdminProductFormValues,
) {
  return persistProductDocument(
    "PATCH",
    {
      ...values,
      slug: values.slug.trim() || slugifyProductName(values.name),
    },
    productId,
  );
}

export async function archiveAdminProduct(productId: string) {
  if (!canManageProducts()) {
    throw new Error("Appwrite product management is not configured.");
  }

  const url = buildAppwriteApiUrl(
    `/databases/${appwriteConfig.databaseId}/collections/${appwriteConfig.catalog.productsCollectionId}/documents/${productId}`,
  );

  const response = await fetch(url, {
    body: JSON.stringify({
      data: {
        status: "archived",
      },
    }),
    headers: createAppwriteHeaders(),
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to archive product."),
    );
  }

  const document = (await response.json()) as AppwriteProductDocument;
  return mapProductForAdmin(mapProductDocumentToProduct(document));
}
