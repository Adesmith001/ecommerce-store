import "server-only";

import { Query } from "appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { buildAppwriteApiUrl, getAppwriteErrorMessage } from "@/lib/appwrite/server-api";
import { getProductsByIds } from "@/lib/catalog/catalog-service";
import type { WishlistEntry, WishlistItem } from "@/types/wishlist";

type AppwriteDocumentListResponse<T> = {
  documents: Array<T & { $id: string }>;
};

type AppwriteWishlistDocument = {
  $id: string;
  clerkId: string;
  createdAt: string;
  entryKey: string;
  productId: string;
  productSlug: string;
};

function isWishlistConfigured() {
  return Boolean(
    appwriteConfig.apiKey &&
      appwriteConfig.databaseId &&
      appwriteConfig.endpoint &&
      appwriteConfig.projectId &&
      appwriteConfig.wishlistsCollectionId,
  );
}

function getWishlistCollectionUrl() {
  return buildAppwriteApiUrl(
    `databases/${appwriteConfig.databaseId}/collections/${appwriteConfig.wishlistsCollectionId}/documents`,
  );
}

function getWishlistDocumentUrl(documentId: string) {
  return buildAppwriteApiUrl(
    `databases/${appwriteConfig.databaseId}/collections/${appwriteConfig.wishlistsCollectionId}/documents/${documentId}`,
  );
}

function getAppwriteHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Appwrite-Key": appwriteConfig.apiKey,
    "X-Appwrite-Project": appwriteConfig.projectId,
  };
}

function toWishlistEntry(document: AppwriteWishlistDocument): WishlistEntry {
  return {
    id: document.$id,
    clerkId: document.clerkId,
    productId: document.productId,
    productSlug: document.productSlug,
    entryKey: document.entryKey,
    createdAt: document.createdAt,
  };
}

function buildEntryKey(clerkId: string, productId: string) {
  return `${clerkId}:${productId}`;
}

async function listWishlistDocuments(queries: string[] = []) {
  const url = getWishlistCollectionUrl();

  for (const query of queries) {
    url.searchParams.append("queries[]", query);
  }

  const response = await fetch(url, {
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to query Appwrite wishlist."),
    );
  }

  const result =
    (await response.json()) as AppwriteDocumentListResponse<AppwriteWishlistDocument>;

  return result.documents.map(toWishlistEntry);
}

async function findWishlistEntry(input: { clerkId: string; productId: string }) {
  const [entry] = await listWishlistDocuments([
    Query.equal("entryKey", buildEntryKey(input.clerkId, input.productId)),
    Query.limit(1),
  ]);

  return entry ?? null;
}

function sortWishlistEntries(entries: WishlistEntry[]) {
  return [...entries].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

export async function listWishlistEntriesForClerkUser(clerkId: string) {
  if (!isWishlistConfigured()) {
    throw new Error("Appwrite wishlist storage is not configured.");
  }

  const entries = await listWishlistDocuments([
    Query.equal("clerkId", clerkId),
    Query.orderDesc("$createdAt"),
  ]);

  return sortWishlistEntries(entries);
}

export async function getWishlistItemsForClerkUser(clerkId: string) {
  const entries = await listWishlistEntriesForClerkUser(clerkId);
  const productIds = entries.map((entry) => entry.productId);
  const products = await getProductsByIds(productIds);
  const productMap = new Map(products.map((product) => [product.id, product]));

  return entries.reduce<WishlistItem[]>((items, entry) => {
    const product = productMap.get(entry.productId);

    if (!product) {
      return items;
    }

    items.push({
      id: entry.id,
      createdAt: entry.createdAt,
      product,
    });

    return items;
  }, []);
}

export async function addProductToWishlist(input: {
  clerkId: string;
  productId: string;
  productSlug: string;
}) {
  if (!isWishlistConfigured()) {
    throw new Error("Appwrite wishlist storage is not configured.");
  }

  const existingEntry = await findWishlistEntry(input);

  if (existingEntry) {
    return existingEntry;
  }

  const response = await fetch(getWishlistCollectionUrl(), {
    body: JSON.stringify({
      data: {
        clerkId: input.clerkId,
        productId: input.productId,
        productSlug: input.productSlug,
        entryKey: buildEntryKey(input.clerkId, input.productId),
        createdAt: new Date().toISOString(),
      },
      documentId: crypto.randomUUID(),
    }),
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "POST",
  });

  if (response.status === 409) {
    const conflictingEntry = await findWishlistEntry(input);

    if (conflictingEntry) {
      return conflictingEntry;
    }
  }

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to add wishlist item."),
    );
  }

  const document = (await response.json()) as AppwriteWishlistDocument;

  return toWishlistEntry(document);
}

export async function removeProductFromWishlist(input: {
  clerkId: string;
  productId: string;
}) {
  if (!isWishlistConfigured()) {
    throw new Error("Appwrite wishlist storage is not configured.");
  }

  const existingEntry = await findWishlistEntry(input);

  if (!existingEntry) {
    return { removed: false };
  }

  const response = await fetch(getWishlistDocumentUrl(existingEntry.id), {
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to remove wishlist item."),
    );
  }

  return { removed: true };
}
