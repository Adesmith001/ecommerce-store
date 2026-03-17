import "server-only";

import { Query } from "appwrite";
import { PRODUCT_LOW_STOCK_THRESHOLD } from "@/constants/admin";
import { appwriteConfig } from "@/lib/appwrite/config";
import {
  buildAppwriteApiUrl,
  getAppwriteErrorMessage,
} from "@/lib/appwrite/server-api";
import { mapProductDocumentToProduct } from "@/lib/catalog/catalog-mappers";
import type { AdminInventoryProduct } from "@/types/admin-inventory";
import type { AppwriteProductDocument } from "@/types/catalog";

type AppwriteDocumentListResponse<TDocument> = {
  documents: TDocument[];
};

function canManageInventory() {
  return Boolean(
    appwriteConfig.databaseId &&
      appwriteConfig.catalog.productsCollectionId &&
      appwriteConfig.apiKey &&
      appwriteConfig.projectId &&
      appwriteConfig.endpoint,
  );
}

function createAppwriteHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Appwrite-Key": appwriteConfig.apiKey,
    "X-Appwrite-Project": appwriteConfig.projectId,
  };
}

function mapInventoryProduct(document: AppwriteProductDocument): AdminInventoryProduct {
  const product = mapProductDocumentToProduct(document);

  return {
    categoryName: product.category?.name ?? "Unassigned",
    id: product.id,
    isLowStock: product.stock > 0 && product.stock <= PRODUCT_LOW_STOCK_THRESHOLD,
    isOutOfStock: product.stock <= 0,
    name: product.name,
    sku: product.sku,
    status: product.status,
    stock: product.stock,
    updatedAt: product.updatedAt,
  };
}

async function listInventoryDocuments() {
  if (!canManageInventory()) {
    throw new Error("Appwrite inventory management is not configured.");
  }

  const url = buildAppwriteApiUrl(
    `/databases/${appwriteConfig.databaseId}/collections/${appwriteConfig.catalog.productsCollectionId}/documents`,
  );
  url.searchParams.append("queries[]", Query.orderAsc("stock"));
  url.searchParams.append("queries[]", Query.orderAsc("name"));

  const response = await fetch(url, {
    cache: "no-store",
    headers: createAppwriteHeaders(),
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to load inventory products."),
    );
  }

  const payload =
    (await response.json()) as AppwriteDocumentListResponse<AppwriteProductDocument>;

  return payload.documents;
}

export async function listAdminInventoryProducts() {
  const documents = await listInventoryDocuments();

  return documents.map(mapInventoryProduct);
}

export async function updateAdminProductStock(productId: string, stock: number) {
  if (!canManageInventory()) {
    throw new Error("Appwrite inventory management is not configured.");
  }

  if (!Number.isInteger(stock) || stock < 0) {
    throw new Error("Stock must be a whole number greater than or equal to zero.");
  }

  const url = buildAppwriteApiUrl(
    `/databases/${appwriteConfig.databaseId}/collections/${appwriteConfig.catalog.productsCollectionId}/documents/${productId}`,
  );

  const response = await fetch(url, {
    body: JSON.stringify({
      data: {
        stock,
      },
    }),
    headers: createAppwriteHeaders(),
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to update inventory."),
    );
  }

  const document = (await response.json()) as AppwriteProductDocument;

  return mapInventoryProduct(document);
}
