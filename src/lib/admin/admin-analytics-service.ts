import "server-only";

import { Query } from "appwrite";
import { APPWRITE_COLLECTION_IDS } from "@/constants/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import {
  buildAppwriteApiUrl,
  getAppwriteErrorMessage,
} from "@/lib/appwrite/server-api";
import type { CartItem } from "@/types/cart";
import type {
  AdminAnalyticsData,
  AdminAnalyticsRange,
  AdminAnalyticsRankingPoint,
  AdminAnalyticsTimePoint,
} from "@/types/admin";

type AppwriteListResponse<TDocument> = {
  documents: TDocument[];
  total: number;
};

type RawOrderDocument = {
  $createdAt?: string;
  $id: string;
  clerkId?: string;
  createdAt?: string;
  estimatedTotal?: number | string;
  items?: string | CartItem[];
  paymentStatus?: string;
};

type RawUserProfileDocument = {
  $id: string;
  clerkId?: string;
  role?: string;
};

const PAGE_SIZE = 100;

function hasAdminReadConfig() {
  return Boolean(
    appwriteConfig.endpoint &&
      appwriteConfig.projectId &&
      appwriteConfig.databaseId &&
      appwriteConfig.apiKey,
  );
}

function createAppwriteHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Appwrite-Key": appwriteConfig.apiKey,
    "X-Appwrite-Project": appwriteConfig.projectId,
  };
}

function toNumber(value: number | string | null | undefined) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function parseItems(value: string | CartItem[] | undefined) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value) as CartItem[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
}

function getOrderDate(order: RawOrderDocument) {
  const value = order.createdAt ?? order.$createdAt;
  const date = value ? new Date(value) : null;

  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function getRangeConfig(range: AdminAnalyticsRange) {
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const start = new Date(end);
  start.setHours(0, 0, 0, 0);

  if (range === "7d") {
    start.setDate(start.getDate() - 6);
  } else if (range === "30d") {
    start.setDate(start.getDate() - 29);
  } else {
    start.setDate(1);
  }

  return { end, start };
}

function formatDayLabel(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
  }).format(value);
}

function formatDayKey(value: Date) {
  return value.toISOString().slice(0, 10);
}

async function listAllDocuments<TDocument>(
  collectionId: string,
  queries: string[] = [],
) {
  if (!collectionId) {
    return { documents: [], total: 0 };
  }

  const documents: TDocument[] = [];
  let offset = 0;
  let total = 0;

  while (true) {
    const url = buildAppwriteApiUrl(
      `databases/${appwriteConfig.databaseId}/collections/${collectionId}/documents`,
    );

    for (const query of queries) {
      url.searchParams.append("queries[]", query);
    }

    url.searchParams.append("queries[]", Query.limit(PAGE_SIZE));
    url.searchParams.append("queries[]", Query.offset(offset));

    const response = await fetch(url, {
      headers: createAppwriteHeaders(),
      method: "GET",
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      throw new Error(
        await getAppwriteErrorMessage(response, "Failed to load analytics data."),
      );
    }

    const payload = (await response.json()) as AppwriteListResponse<TDocument>;
    total = payload.total;
    documents.push(...payload.documents);

    if (documents.length >= total || payload.documents.length === 0) {
      break;
    }

    offset += payload.documents.length;
  }

  return { documents, total };
}

function buildTimeline(
  orders: RawOrderDocument[],
  range: AdminAnalyticsRange,
): AdminAnalyticsTimePoint[] {
  const { end, start } = getRangeConfig(range);
  const cursor = new Date(start);
  const points: AdminAnalyticsTimePoint[] = [];
  const pointMap = new Map<string, AdminAnalyticsTimePoint>();

  while (cursor <= end) {
    const key = formatDayKey(cursor);
    const point: AdminAnalyticsTimePoint = {
      label: formatDayLabel(cursor),
      orders: 0,
      revenue: 0,
    };

    pointMap.set(key, point);
    points.push(point);
    cursor.setDate(cursor.getDate() + 1);
  }

  for (const order of orders) {
    const orderDate = getOrderDate(order);

    if (!orderDate) {
      continue;
    }

    const target = pointMap.get(formatDayKey(orderDate));

    if (!target) {
      continue;
    }

    target.orders += 1;

    if (order.paymentStatus === "paid") {
      target.revenue += toNumber(order.estimatedTotal);
    }
  }

  return points;
}

function buildProductPerformance(orders: RawOrderDocument[]) {
  const productMap = new Map<string, AdminAnalyticsRankingPoint>();

  for (const order of orders) {
    for (const item of parseItems(order.items)) {
      const key = item.productId || item.slug || item.sku || item.name;
      const existing = productMap.get(key) ?? {
        label: item.name || "Untitled product",
        orders: 0,
        quantity: 0,
        revenue: 0,
      };
      const quantity = Math.max(0, toNumber(item.quantity));
      const unitPrice = item.salePrice ?? item.price;

      existing.orders += 1;
      existing.quantity += quantity;
      existing.revenue += quantity * toNumber(unitPrice);
      productMap.set(key, existing);
    }
  }

  return [...productMap.values()]
    .sort((left, right) => {
      if (right.revenue !== left.revenue) {
        return right.revenue - left.revenue;
      }

      return right.quantity - left.quantity;
    })
    .slice(0, 6);
}

function buildCategoryPerformance(orders: RawOrderDocument[]) {
  const categoryMap = new Map<string, AdminAnalyticsRankingPoint>();

  for (const order of orders) {
    for (const item of parseItems(order.items)) {
      const label = item.category?.name || "Uncategorized";
      const existing = categoryMap.get(label) ?? {
        label,
        orders: 0,
        quantity: 0,
        revenue: 0,
      };
      const quantity = Math.max(0, toNumber(item.quantity));
      const unitPrice = item.salePrice ?? item.price;

      existing.orders += 1;
      existing.quantity += quantity;
      existing.revenue += quantity * toNumber(unitPrice);
      categoryMap.set(label, existing);
    }
  }

  return [...categoryMap.values()]
    .sort((left, right) => {
      if (right.revenue !== left.revenue) {
        return right.revenue - left.revenue;
      }

      return right.quantity - left.quantity;
    })
    .slice(0, 6);
}

function normalizeRange(value: string | string[] | undefined): AdminAnalyticsRange {
  if (value === "7d" || value === "30d" || value === "month") {
    return value;
  }

  return "30d";
}

export function parseAdminAnalyticsRange(
  value: string | string[] | undefined,
) {
  return normalizeRange(value);
}

export async function getAdminAnalyticsData(
  range: AdminAnalyticsRange,
): Promise<AdminAnalyticsData> {
  const warnings: string[] = [];

  if (!hasAdminReadConfig()) {
    return {
      categoryPerformance: [],
      isUsingFallback: true,
      range,
      summary: {
        averageOrderValue: 0,
        paidOrders: 0,
        repeatCustomers: 0,
        totalCustomers: 0,
        totalOrders: 0,
        totalRevenue: 0,
      },
      timeline: [],
      topProducts: [],
      warnings: [
        "Appwrite analytics reads are not fully configured yet. Add your Appwrite env vars and API key to enable live reporting.",
      ],
    };
  }

  if (!APPWRITE_COLLECTION_IDS.orders) {
    warnings.push("Orders collection id is missing.");
  }

  if (!APPWRITE_COLLECTION_IDS.userProfiles) {
    warnings.push("User profiles collection id is missing.");
  }

  const [ordersResponse, profilesResponse] = await Promise.all([
    listAllDocuments<RawOrderDocument>(APPWRITE_COLLECTION_IDS.orders, [
      Query.orderDesc("$createdAt"),
    ]),
    listAllDocuments<RawUserProfileDocument>(APPWRITE_COLLECTION_IDS.userProfiles, [
      Query.orderDesc("$createdAt"),
    ]),
  ]);

  const { end, start } = getRangeConfig(range);
  const rangedOrders = ordersResponse.documents.filter((order) => {
    const date = getOrderDate(order);

    return Boolean(date && date >= start && date <= end);
  });
  const paidOrders = rangedOrders.filter((order) => order.paymentStatus === "paid");
  const totalRevenue = paidOrders.reduce(
    (sum, order) => sum + toNumber(order.estimatedTotal),
    0,
  );
  const customerOrderCounts = new Map<string, number>();

  for (const order of paidOrders) {
    if (!order.clerkId) {
      continue;
    }

    customerOrderCounts.set(
      order.clerkId,
      (customerOrderCounts.get(order.clerkId) ?? 0) + 1,
    );
  }

  const totalCustomers = profilesResponse.documents.filter(
    (profile) => profile.role !== "admin",
  ).length;
  const repeatCustomers = [...customerOrderCounts.values()].filter(
    (count) => count >= 2,
  ).length;

  return {
    categoryPerformance: buildCategoryPerformance(paidOrders),
    isUsingFallback: false,
    range,
    summary: {
      averageOrderValue: paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0,
      paidOrders: paidOrders.length,
      repeatCustomers,
      totalCustomers,
      totalOrders: rangedOrders.length,
      totalRevenue,
    },
    timeline: buildTimeline(rangedOrders, range),
    topProducts: buildProductPerformance(paidOrders),
    warnings,
  };
}
