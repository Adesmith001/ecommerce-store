import "server-only";

import type { CartItem } from "@/types/cart";
import { buildAppwriteApiUrl, getAppwriteErrorMessage } from "@/lib/appwrite/server-api";
import { appwriteConfig } from "@/lib/appwrite/config";

type AppwriteProductStockDocument = {
  $id: string;
  stock?: number | string;
};

function isInventoryWriteConfigured() {
  return Boolean(
    appwriteConfig.apiKey &&
      appwriteConfig.databaseId &&
      appwriteConfig.endpoint &&
      appwriteConfig.projectId &&
      appwriteConfig.catalog.productsCollectionId,
  );
}

function getAppwriteHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Appwrite-Key": appwriteConfig.apiKey,
    "X-Appwrite-Project": appwriteConfig.projectId,
  };
}

function getProductDocumentUrl(productId: string) {
  return buildAppwriteApiUrl(
    `databases/${appwriteConfig.databaseId}/collections/${appwriteConfig.catalog.productsCollectionId}/documents/${productId}`,
  );
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

async function getProductStockDocument(productId: string) {
  const response = await fetch(getProductDocumentUrl(productId), {
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(
        response,
        `Failed to read product stock for ${productId}.`,
      ),
    );
  }

  return (await response.json()) as AppwriteProductStockDocument;
}

async function updateProductStock(productId: string, nextStock: number) {
  const response = await fetch(getProductDocumentUrl(productId), {
    body: JSON.stringify({
      data: {
        stock: nextStock,
      },
    }),
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(
        response,
        `Failed to update product stock for ${productId}.`,
      ),
    );
  }
}

export async function decrementInventoryForOrderItems(items: CartItem[]) {
  if (!isInventoryWriteConfigured()) {
    throw new Error("Appwrite product inventory writes are not configured.");
  }

  for (const item of items) {
    const product = await getProductStockDocument(item.productId);
    const currentStock = toNumber(product.stock);
    const nextStock = Math.max(currentStock - item.quantity, 0);

    await updateProductStock(item.productId, nextStock);
  }
}
