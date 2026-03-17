import "server-only";

import { ID, Query } from "appwrite";
import { mockBrands, mockCategories } from "@/data/mock/catalog";
import { mockHomepageBanners } from "@/data/mock/banners";
import { appwriteDatabases } from "@/lib/appwrite/client";
import { appwriteConfig } from "@/lib/appwrite/config";
import {
  buildAppwriteApiUrl,
  getAppwriteErrorMessage,
} from "@/lib/appwrite/server-api";
import {
  mapBannerDocumentToHomepageBanner,
  mapBrandDocumentToBrand,
  mapCategoryDocumentToCategory,
} from "@/lib/catalog/catalog-mappers";
import {
  slugifyMerchandisingName,
  validateBannerForm,
  validateBrandForm,
  validateCategoryForm,
} from "@/lib/admin/admin-merchandising-validation";
import type {
  AdminBannerRecord,
  AdminBrandRecord,
  AdminCategoryRecord,
  BannerFormContext,
  BannerFormValues,
  BrandFormContext,
  BrandFormValues,
  CategoryFormContext,
  CategoryFormValues,
} from "@/types/admin-merchandising";
import type {
  AppwriteBannerDocument,
  AppwriteBrandDocument,
  AppwriteCategoryDocument,
  CategoryReference,
  ProductImage,
} from "@/types/catalog";

function createAppwriteHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Appwrite-Key": appwriteConfig.apiKey,
    "X-Appwrite-Project": appwriteConfig.projectId,
  };
}

function canManageCategories() {
  return Boolean(
    appwriteConfig.databaseId &&
      appwriteConfig.catalog.categoriesCollectionId &&
      appwriteConfig.apiKey &&
      appwriteConfig.projectId &&
      appwriteConfig.endpoint,
  );
}

function canManageBrands() {
  return Boolean(
    appwriteConfig.databaseId &&
      appwriteConfig.catalog.brandsCollectionId &&
      appwriteConfig.apiKey &&
      appwriteConfig.projectId &&
      appwriteConfig.endpoint,
  );
}

function canManageBanners() {
  return Boolean(
    appwriteConfig.databaseId &&
      appwriteConfig.catalog.bannersCollectionId &&
      appwriteConfig.apiKey &&
      appwriteConfig.projectId &&
      appwriteConfig.endpoint,
  );
}

function serializeImage(image: ProductImage | null) {
  return image
    ? JSON.stringify({
        alt: image.alt,
        id: image.id,
        isPrimary: image.isPrimary ?? true,
        publicId: image.publicId,
        url: image.url,
      })
    : "";
}

function createParentReference(category: AdminCategoryRecord): CategoryReference {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
  };
}

function buildEmptyCategoryValues(): CategoryFormValues {
  return {
    description: "",
    featured: false,
    image: null,
    name: "",
    parentCategoryId: "",
    slug: "",
    status: "active",
  };
}

function buildEmptyBrandValues(): BrandFormValues {
  return {
    description: "",
    image: null,
    name: "",
    slug: "",
    status: "active",
  };
}

function buildEmptyBannerValues(): BannerFormValues {
  return {
    active: true,
    ctaLink: "",
    ctaText: "",
    image: null,
    sortOrder: "1",
    subtitle: "",
    title: "",
  };
}

function mapCategoryToFormValues(category: AdminCategoryRecord): CategoryFormValues {
  return {
    description: category.description,
    featured: category.featured,
    image: category.image,
    name: category.name,
    parentCategoryId: category.parentCategory?.id ?? "",
    slug: category.slug,
    status: category.status,
  };
}

function mapBrandToFormValues(brand: AdminBrandRecord): BrandFormValues {
  return {
    description: brand.description ?? "",
    image: brand.logo ?? null,
    name: brand.name,
    slug: brand.slug,
    status: brand.status,
  };
}

function mapBannerToFormValues(banner: AdminBannerRecord): BannerFormValues {
  return {
    active: banner.active,
    ctaLink: banner.ctaLink,
    ctaText: banner.ctaText,
    image: banner.image,
    sortOrder: String(banner.sortOrder),
    subtitle: banner.subtitle,
    title: banner.title,
  };
}

async function assertUniqueSlug(
  collectionId: string,
  slug: string,
  currentDocumentId?: string,
) {
  const response = await appwriteDatabases.listDocuments({
    collectionId,
    databaseId: appwriteConfig.databaseId,
    queries: [Query.equal("slug", slug), Query.limit(1)],
    total: false,
  });

  const duplicate = response.documents[0];
  if (duplicate && duplicate.$id !== currentDocumentId) {
    throw new Error("Another record already uses this slug.");
  }
}

async function saveDocument<TDocument>({
  body,
  collectionId,
  documentId,
  errorMessage,
  method,
}: {
  body: Record<string, unknown>;
  collectionId: string;
  documentId?: string;
  errorMessage: string;
  method: "PATCH" | "POST";
}) {
  const url =
    method === "POST"
      ? buildAppwriteApiUrl(
          `/databases/${appwriteConfig.databaseId}/collections/${collectionId}/documents`,
        )
      : buildAppwriteApiUrl(
          `/databases/${appwriteConfig.databaseId}/collections/${collectionId}/documents/${documentId}`,
        );

  const response = await fetch(url, {
    body: JSON.stringify({
      data: body,
      ...(method === "POST" ? { documentId: ID.unique() } : {}),
    }),
    headers: createAppwriteHeaders(),
    method,
  });

  if (!response.ok) {
    throw new Error(await getAppwriteErrorMessage(response, errorMessage));
  }

  return (await response.json()) as TDocument;
}

export async function listAdminCategories() {
  if (!appwriteConfig.databaseId || !appwriteConfig.catalog.categoriesCollectionId) {
    return [...mockCategories].sort((left, right) => left.name.localeCompare(right.name));
  }

  const response = await appwriteDatabases.listDocuments<AppwriteCategoryDocument>({
    collectionId: appwriteConfig.catalog.categoriesCollectionId,
    databaseId: appwriteConfig.databaseId,
    queries: [Query.orderAsc("name")],
    total: false,
  });

  return response.documents.map(mapCategoryDocumentToCategory);
}

export async function getAdminCategoryById(categoryId: string) {
  if (!appwriteConfig.databaseId || !appwriteConfig.catalog.categoriesCollectionId) {
    return mockCategories.find((category) => category.id === categoryId) ?? null;
  }

  try {
    const document = await appwriteDatabases.getDocument<AppwriteCategoryDocument>({
      collectionId: appwriteConfig.catalog.categoriesCollectionId,
      databaseId: appwriteConfig.databaseId,
      documentId: categoryId,
    });

    return mapCategoryDocumentToCategory(document);
  } catch {
    return null;
  }
}

export async function getAdminCategoryFormContext(
  mode: "create" | "edit",
  categoryId?: string,
): Promise<CategoryFormContext> {
  const [categories, category] = await Promise.all([
    listAdminCategories(),
    categoryId ? getAdminCategoryById(categoryId) : Promise.resolve(null),
  ]);

  return {
    categoryId,
    initialValues: category ? mapCategoryToFormValues(category) : buildEmptyCategoryValues(),
    mode,
    parentOptions: categories
      .filter((item) => item.id !== categoryId && item.status !== "archived")
      .map((item) => ({ id: item.id, label: item.name })),
  };
}

export async function createAdminCategory(values: CategoryFormValues) {
  if (!canManageCategories()) {
    throw new Error("Appwrite category management is not configured.");
  }

  const normalizedValues = {
    ...values,
    slug: values.slug.trim() || slugifyMerchandisingName(values.name),
  };
  const validationErrors = validateCategoryForm(normalizedValues);

  if (Object.keys(validationErrors).length > 0) {
    throw new Error("Please fix the highlighted category fields.");
  }

  await assertUniqueSlug(
    appwriteConfig.catalog.categoriesCollectionId,
    normalizedValues.slug.trim(),
  );

  const categories = await listAdminCategories();
  const parentCategory = categories.find(
    (category) => category.id === normalizedValues.parentCategoryId,
  );

  const document = await saveDocument<AppwriteCategoryDocument>({
    body: {
      description: normalizedValues.description.trim(),
      featured: normalizedValues.featured,
      image: serializeImage(normalizedValues.image),
      name: normalizedValues.name.trim(),
      parentCategory: parentCategory
        ? JSON.stringify(createParentReference(parentCategory))
        : "",
      parentCategoryId: parentCategory?.id ?? "",
      parentCategoryName: parentCategory?.name ?? "",
      parentCategorySlug: parentCategory?.slug ?? "",
      slug: normalizedValues.slug.trim(),
      status: normalizedValues.status,
    },
    collectionId: appwriteConfig.catalog.categoriesCollectionId,
    errorMessage: "Failed to save category.",
    method: "POST",
  });

  return mapCategoryDocumentToCategory(document);
}

export async function updateAdminCategory(
  categoryId: string,
  values: CategoryFormValues,
) {
  if (!canManageCategories()) {
    throw new Error("Appwrite category management is not configured.");
  }

  const normalizedValues = {
    ...values,
    slug: values.slug.trim() || slugifyMerchandisingName(values.name),
  };
  const validationErrors = validateCategoryForm(normalizedValues);

  if (Object.keys(validationErrors).length > 0) {
    throw new Error("Please fix the highlighted category fields.");
  }

  await assertUniqueSlug(
    appwriteConfig.catalog.categoriesCollectionId,
    normalizedValues.slug.trim(),
    categoryId,
  );

  const categories = await listAdminCategories();
  const parentCategory = categories.find(
    (category) => category.id === normalizedValues.parentCategoryId,
  );

  const document = await saveDocument<AppwriteCategoryDocument>({
    body: {
      description: normalizedValues.description.trim(),
      featured: normalizedValues.featured,
      image: serializeImage(normalizedValues.image),
      name: normalizedValues.name.trim(),
      parentCategory: parentCategory
        ? JSON.stringify(createParentReference(parentCategory))
        : "",
      parentCategoryId: parentCategory?.id ?? "",
      parentCategoryName: parentCategory?.name ?? "",
      parentCategorySlug: parentCategory?.slug ?? "",
      slug: normalizedValues.slug.trim(),
      status: normalizedValues.status,
    },
    collectionId: appwriteConfig.catalog.categoriesCollectionId,
    documentId: categoryId,
    errorMessage: "Failed to save category.",
    method: "PATCH",
  });

  return mapCategoryDocumentToCategory(document);
}

export async function archiveAdminCategory(categoryId: string) {
  if (!canManageCategories()) {
    throw new Error("Appwrite category management is not configured.");
  }

  const document = await saveDocument<AppwriteCategoryDocument>({
    body: { status: "archived" },
    collectionId: appwriteConfig.catalog.categoriesCollectionId,
    documentId: categoryId,
    errorMessage: "Failed to archive category.",
    method: "PATCH",
  });

  return mapCategoryDocumentToCategory(document);
}

export async function listAdminBrands() {
  if (!appwriteConfig.databaseId || !appwriteConfig.catalog.brandsCollectionId) {
    return [...mockBrands].sort((left, right) => left.name.localeCompare(right.name));
  }

  const response = await appwriteDatabases.listDocuments<AppwriteBrandDocument>({
    collectionId: appwriteConfig.catalog.brandsCollectionId,
    databaseId: appwriteConfig.databaseId,
    queries: [Query.orderAsc("name")],
    total: false,
  });

  return response.documents.map(mapBrandDocumentToBrand);
}

export async function getAdminBrandById(brandId: string) {
  if (!appwriteConfig.databaseId || !appwriteConfig.catalog.brandsCollectionId) {
    return mockBrands.find((brand) => brand.id === brandId) ?? null;
  }

  try {
    const document = await appwriteDatabases.getDocument<AppwriteBrandDocument>({
      collectionId: appwriteConfig.catalog.brandsCollectionId,
      databaseId: appwriteConfig.databaseId,
      documentId: brandId,
    });

    return mapBrandDocumentToBrand(document);
  } catch {
    return null;
  }
}

export async function getAdminBrandFormContext(
  mode: "create" | "edit",
  brandId?: string,
): Promise<BrandFormContext> {
  const brand = brandId ? await getAdminBrandById(brandId) : null;

  return {
    brandId,
    initialValues: brand ? mapBrandToFormValues(brand) : buildEmptyBrandValues(),
    mode,
  };
}

export async function createAdminBrand(values: BrandFormValues) {
  if (!canManageBrands()) {
    throw new Error("Appwrite brand management is not configured.");
  }

  const normalizedValues = {
    ...values,
    slug: values.slug.trim() || slugifyMerchandisingName(values.name),
  };
  const validationErrors = validateBrandForm(normalizedValues);

  if (Object.keys(validationErrors).length > 0) {
    throw new Error("Please fix the highlighted brand fields.");
  }

  await assertUniqueSlug(
    appwriteConfig.catalog.brandsCollectionId,
    normalizedValues.slug.trim(),
  );

  const document = await saveDocument<AppwriteBrandDocument>({
    body: {
      description: normalizedValues.description.trim(),
      featured: false,
      logo: serializeImage(normalizedValues.image),
      name: normalizedValues.name.trim(),
      slug: normalizedValues.slug.trim(),
      status: normalizedValues.status,
    },
    collectionId: appwriteConfig.catalog.brandsCollectionId,
    errorMessage: "Failed to save brand.",
    method: "POST",
  });

  return mapBrandDocumentToBrand(document);
}

export async function updateAdminBrand(brandId: string, values: BrandFormValues) {
  if (!canManageBrands()) {
    throw new Error("Appwrite brand management is not configured.");
  }

  const normalizedValues = {
    ...values,
    slug: values.slug.trim() || slugifyMerchandisingName(values.name),
  };
  const validationErrors = validateBrandForm(normalizedValues);

  if (Object.keys(validationErrors).length > 0) {
    throw new Error("Please fix the highlighted brand fields.");
  }

  await assertUniqueSlug(
    appwriteConfig.catalog.brandsCollectionId,
    normalizedValues.slug.trim(),
    brandId,
  );

  const document = await saveDocument<AppwriteBrandDocument>({
    body: {
      description: normalizedValues.description.trim(),
      logo: serializeImage(normalizedValues.image),
      name: normalizedValues.name.trim(),
      slug: normalizedValues.slug.trim(),
      status: normalizedValues.status,
    },
    collectionId: appwriteConfig.catalog.brandsCollectionId,
    documentId: brandId,
    errorMessage: "Failed to save brand.",
    method: "PATCH",
  });

  return mapBrandDocumentToBrand(document);
}

export async function archiveAdminBrand(brandId: string) {
  if (!canManageBrands()) {
    throw new Error("Appwrite brand management is not configured.");
  }

  const document = await saveDocument<AppwriteBrandDocument>({
    body: { status: "archived" },
    collectionId: appwriteConfig.catalog.brandsCollectionId,
    documentId: brandId,
    errorMessage: "Failed to archive brand.",
    method: "PATCH",
  });

  return mapBrandDocumentToBrand(document);
}

export async function listAdminBanners() {
  if (!appwriteConfig.databaseId || !appwriteConfig.catalog.bannersCollectionId) {
    return [...mockHomepageBanners].sort((left, right) => left.sortOrder - right.sortOrder);
  }

  const response = await appwriteDatabases.listDocuments<AppwriteBannerDocument>({
    collectionId: appwriteConfig.catalog.bannersCollectionId,
    databaseId: appwriteConfig.databaseId,
    queries: [Query.orderAsc("sortOrder"), Query.orderDesc("$createdAt")],
    total: false,
  });

  return response.documents.map(mapBannerDocumentToHomepageBanner);
}

export async function getAdminBannerById(bannerId: string) {
  if (!appwriteConfig.databaseId || !appwriteConfig.catalog.bannersCollectionId) {
    return mockHomepageBanners.find((banner) => banner.id === bannerId) ?? null;
  }

  try {
    const document = await appwriteDatabases.getDocument<AppwriteBannerDocument>({
      collectionId: appwriteConfig.catalog.bannersCollectionId,
      databaseId: appwriteConfig.databaseId,
      documentId: bannerId,
    });

    return mapBannerDocumentToHomepageBanner(document);
  } catch {
    return null;
  }
}

export async function getAdminBannerFormContext(
  mode: "create" | "edit",
  bannerId?: string,
): Promise<BannerFormContext> {
  const banner = bannerId ? await getAdminBannerById(bannerId) : null;

  return {
    bannerId,
    initialValues: banner ? mapBannerToFormValues(banner) : buildEmptyBannerValues(),
    mode,
  };
}

export async function createAdminBanner(values: BannerFormValues) {
  if (!canManageBanners()) {
    throw new Error("Appwrite banner management is not configured.");
  }

  const validationErrors = validateBannerForm(values);
  if (Object.keys(validationErrors).length > 0) {
    throw new Error("Please fix the highlighted banner fields.");
  }

  const document = await saveDocument<AppwriteBannerDocument>({
    body: {
      active: values.active,
      ctaLink: values.ctaLink.trim(),
      ctaText: values.ctaText.trim(),
      image: serializeImage(values.image),
      sortOrder: Number(values.sortOrder),
      subtitle: values.subtitle.trim(),
      title: values.title.trim(),
    },
    collectionId: appwriteConfig.catalog.bannersCollectionId,
    errorMessage: "Failed to save banner.",
    method: "POST",
  });

  return mapBannerDocumentToHomepageBanner(document);
}

export async function updateAdminBanner(bannerId: string, values: BannerFormValues) {
  if (!canManageBanners()) {
    throw new Error("Appwrite banner management is not configured.");
  }

  const validationErrors = validateBannerForm(values);
  if (Object.keys(validationErrors).length > 0) {
    throw new Error("Please fix the highlighted banner fields.");
  }

  const document = await saveDocument<AppwriteBannerDocument>({
    body: {
      active: values.active,
      ctaLink: values.ctaLink.trim(),
      ctaText: values.ctaText.trim(),
      image: serializeImage(values.image),
      sortOrder: Number(values.sortOrder),
      subtitle: values.subtitle.trim(),
      title: values.title.trim(),
    },
    collectionId: appwriteConfig.catalog.bannersCollectionId,
    documentId: bannerId,
    errorMessage: "Failed to save banner.",
    method: "PATCH",
  });

  return mapBannerDocumentToHomepageBanner(document);
}

export async function deactivateAdminBanner(bannerId: string) {
  if (!canManageBanners()) {
    throw new Error("Appwrite banner management is not configured.");
  }

  const document = await saveDocument<AppwriteBannerDocument>({
    body: { active: false },
    collectionId: appwriteConfig.catalog.bannersCollectionId,
    documentId: bannerId,
    errorMessage: "Failed to update banner.",
    method: "PATCH",
  });

  return mapBannerDocumentToHomepageBanner(document);
}
