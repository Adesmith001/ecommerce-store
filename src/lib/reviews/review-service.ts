import "server-only";

import { Query } from "appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { buildAppwriteApiUrl, getAppwriteErrorMessage } from "@/lib/appwrite/server-api";
import {
  getLatestPaidOrderIdForProduct,
  hasPaidOrderForProduct,
} from "@/lib/orders/order-service";
import type {
  ReviewEligibility,
  ReviewRecord,
  ReviewStatus,
  ReviewSummary,
} from "@/types/review";

type AppwriteDocumentListResponse<T> = {
  documents: Array<T & { $id: string }>;
};

type AppwriteReviewDocument = {
  $id: string;
  clerkId: string;
  createdAt: string;
  entryKey: string;
  fullName: string;
  message: string;
  orderId: string;
  productId: string;
  rating: number | string;
  status: ReviewStatus;
  title: string;
  updatedAt: string;
};

function isReviewConfigured() {
  return Boolean(
    appwriteConfig.apiKey &&
      appwriteConfig.databaseId &&
      appwriteConfig.endpoint &&
      appwriteConfig.projectId &&
      appwriteConfig.reviewsCollectionId &&
      appwriteConfig.catalog.productsCollectionId,
  );
}

function getReviewCollectionUrl() {
  return buildAppwriteApiUrl(
    `databases/${appwriteConfig.databaseId}/collections/${appwriteConfig.reviewsCollectionId}/documents`,
  );
}

function getProductDocumentUrl(productId: string) {
  return buildAppwriteApiUrl(
    `databases/${appwriteConfig.databaseId}/collections/${appwriteConfig.catalog.productsCollectionId}/documents/${productId}`,
  );
}

function getAppwriteHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Appwrite-Key": appwriteConfig.apiKey,
    "X-Appwrite-Project": appwriteConfig.projectId,
  };
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

function clampRating(value: number) {
  return Math.max(1, Math.min(5, Math.round(value)));
}

function buildReviewEntryKey(clerkId: string, productId: string) {
  return `${clerkId}:${productId}`;
}

function toReviewRecord(document: AppwriteReviewDocument): ReviewRecord {
  return {
    id: document.$id,
    clerkId: document.clerkId,
    productId: document.productId,
    orderId: document.orderId || null,
    entryKey: document.entryKey,
    rating: clampRating(toNumber(document.rating, 0)),
    title: document.title ?? "",
    message: document.message ?? "",
    fullName: document.fullName ?? "Verified customer",
    status: document.status ?? "published",
    createdAt: document.createdAt,
    updatedAt: document.updatedAt,
  };
}

function getEmptyReviewSummary(): ReviewSummary {
  return {
    averageRating: 0,
    breakdown: [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: 0,
      percentage: 0,
    })),
    totalReviews: 0,
  };
}

function buildReviewSummary(reviews: ReviewRecord[]): ReviewSummary {
  if (reviews.length === 0) {
    return getEmptyReviewSummary();
  }

  const totalReviews = reviews.length;
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);

  return {
    averageRating: totalRating / totalReviews,
    totalReviews,
    breakdown: [5, 4, 3, 2, 1].map((rating) => {
      const count = reviews.filter((review) => review.rating === rating).length;

      return {
        rating,
        count,
        percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0,
      };
    }),
  };
}

async function listReviewDocuments(queries: string[] = []) {
  const url = getReviewCollectionUrl();

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
      await getAppwriteErrorMessage(response, "Failed to query Appwrite reviews."),
    );
  }

  const result =
    (await response.json()) as AppwriteDocumentListResponse<AppwriteReviewDocument>;

  return result.documents.map(toReviewRecord);
}

async function findUserReviewForProduct(input: {
  clerkId: string;
  productId: string;
}) {
  const [review] = await listReviewDocuments([
    Query.equal("entryKey", buildReviewEntryKey(input.clerkId, input.productId)),
    Query.limit(1),
  ]);

  return review ?? null;
}

async function syncProductReviewSummary(productId: string) {
  const reviews = await listPublishedReviewsForProduct(productId);
  const summary = buildReviewSummary(reviews);

  const response = await fetch(getProductDocumentUrl(productId), {
    body: JSON.stringify({
      data: {
        ratingAverage: Number(summary.averageRating.toFixed(2)),
        reviewCount: summary.totalReviews,
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
        "Failed to sync product rating summary.",
      ),
    );
  }
}

export async function listPublishedReviewsForProduct(productId: string) {
  if (!isReviewConfigured()) {
    throw new Error("Appwrite review storage is not configured.");
  }

  return listReviewDocuments([
    Query.equal("productId", productId),
    Query.equal("status", "published"),
    Query.orderDesc("$createdAt"),
  ]);
}

export async function getReviewSummaryForProduct(productId: string) {
  const reviews = await listPublishedReviewsForProduct(productId);

  return buildReviewSummary(reviews);
}

export async function getReviewDataForProduct(productId: string) {
  const reviews = await listPublishedReviewsForProduct(productId);

  return {
    reviews,
    summary: buildReviewSummary(reviews),
  };
}

export async function getReviewEligibility(input: {
  clerkId: string | null;
  productId: string;
}) {
  if (!input.clerkId) {
    return {
      alreadyReviewed: false,
      canSubmit: false,
      reason: "not-authenticated",
    } satisfies ReviewEligibility;
  }

  const existingReview = await findUserReviewForProduct({
    clerkId: input.clerkId,
    productId: input.productId,
  });

  if (existingReview) {
    return {
      alreadyReviewed: true,
      canSubmit: false,
      reason: "already-reviewed",
    } satisfies ReviewEligibility;
  }

  const hasPurchasedProduct = await hasPaidOrderForProduct({
    clerkId: input.clerkId,
    productId: input.productId,
  });

  if (!hasPurchasedProduct) {
    return {
      alreadyReviewed: false,
      canSubmit: false,
      reason: "not-purchased",
    } satisfies ReviewEligibility;
  }

  return {
    alreadyReviewed: false,
    canSubmit: true,
    reason: "eligible",
  } satisfies ReviewEligibility;
}

export async function createReview(input: {
  clerkId: string;
  fullName: string;
  message: string;
  productId: string;
  rating: number;
  title?: string;
}) {
  if (!isReviewConfigured()) {
    throw new Error("Appwrite review storage is not configured.");
  }

  const eligibility = await getReviewEligibility({
    clerkId: input.clerkId,
    productId: input.productId,
  });

  if (!eligibility.canSubmit) {
    if (eligibility.reason === "already-reviewed") {
      throw new Error("You have already reviewed this product.");
    }

    throw new Error("Only customers who purchased this product can review it.");
  }

  const orderId = await getLatestPaidOrderIdForProduct({
    clerkId: input.clerkId,
    productId: input.productId,
  });

  const response = await fetch(getReviewCollectionUrl(), {
    body: JSON.stringify({
      data: {
        clerkId: input.clerkId,
        productId: input.productId,
        orderId: orderId ?? "",
        entryKey: buildReviewEntryKey(input.clerkId, input.productId),
        fullName: input.fullName.trim() || "Verified customer",
        rating: clampRating(input.rating),
        title: input.title?.trim() ?? "",
        message: input.message.trim(),
        status: "published",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      documentId: crypto.randomUUID(),
    }),
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "POST",
  });

  if (response.status === 409) {
    throw new Error("You have already reviewed this product.");
  }

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to submit review."),
    );
  }

  const document = (await response.json()) as AppwriteReviewDocument;
  const review = toReviewRecord(document);

  await syncProductReviewSummary(input.productId);

  return review;
}
