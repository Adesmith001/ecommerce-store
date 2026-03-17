import "server-only";

import { Query } from "appwrite";
import { APPWRITE_COLLECTION_IDS } from "@/constants/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { buildAppwriteApiUrl, getAppwriteErrorMessage } from "@/lib/appwrite/server-api";
import type { AdminChartPoint, AdminDashboardData, AdminLowStockProduct, AdminRecentOrder, AdminTopProduct } from "@/types/admin";

type AppwriteListResponse<TDocument> = {
  documents: TDocument[];
  total: number;
};

type RawOrderDocument = {
  $createdAt?: string;
  $id: string;
  clerkId?: string;
  estimatedTotal?: number | string;
  fullName?: string;
  orderNumber?: string;
  orderStatus?: string;
  paymentStatus?: string;
};

type RawProductDocument = {
  $id: string;
  featured?: boolean;
  name?: string;
  reviewCount?: number | string;
  sku?: string;
  slug?: string;
  status?: string;
  stock?: number | string;
};

type RawUserProfileDocument = {
  $id: string;
  role?: string;
};

const DASHBOARD_MONTHS = 6;
const PAGE_SIZE = 100;
const LOW_STOCK_THRESHOLD = 5;

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

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
  }).format(date);
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
      `/databases/${appwriteConfig.databaseId}/collections/${collectionId}/documents`,
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
        await getAppwriteErrorMessage(response, "Failed to load admin dashboard data."),
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

  return {
    documents,
    total,
  };
}

function buildChartPoints(orders: RawOrderDocument[]) {
  const now = new Date();
  const points = Array.from({ length: DASHBOARD_MONTHS }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (DASHBOARD_MONTHS - index - 1), 1);

    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: formatMonthLabel(date),
      orders: 0,
      revenue: 0,
    };
  });

  const pointMap = new Map(points.map((point) => [point.key, point]));

  for (const order of orders) {
    if (!order.$createdAt) {
      continue;
    }

    const createdAt = new Date(order.$createdAt);
    const key = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;
    const target = pointMap.get(key);

    if (!target) {
      continue;
    }

    target.orders += 1;

    if (order.paymentStatus === "paid") {
      target.revenue += toNumber(order.estimatedTotal);
    }
  }

  return points.map<AdminChartPoint>((point) => ({
    label: point.label,
    orders: point.orders,
    revenue: point.revenue,
  }));
}

function mapRecentOrders(orders: RawOrderDocument[]) {
  return orders.slice(0, 6).map<AdminRecentOrder>((order) => ({
    createdAt: order.$createdAt ?? new Date().toISOString(),
    customerName: order.fullName || "Customer",
    id: order.$id,
    orderNumber: order.orderNumber || order.$id,
    orderStatus: order.orderStatus || "pending",
    paymentStatus: order.paymentStatus || "pending",
    total: toNumber(order.estimatedTotal),
  }));
}

function mapTopProducts(products: RawProductDocument[]) {
  return [...products]
    .sort((left, right) => {
      const reviewDelta = toNumber(right.reviewCount) - toNumber(left.reviewCount);

      if (reviewDelta !== 0) {
        return reviewDelta;
      }

      if (left.featured === right.featured) {
        return toNumber(right.stock) - toNumber(left.stock);
      }

      return Number(right.featured) - Number(left.featured);
    })
    .slice(0, 5)
    .map<AdminTopProduct>((product) => ({
      featured: Boolean(product.featured),
      id: product.$id,
      name: product.name || "Untitled product",
      reviewCount: toNumber(product.reviewCount),
      slug: product.slug || product.$id,
      stock: toNumber(product.stock),
    }));
}

function mapLowStockProducts(products: RawProductDocument[]) {
  return products
    .sort((left, right) => toNumber(left.stock) - toNumber(right.stock))
    .slice(0, 6)
    .map<AdminLowStockProduct>((product) => ({
      id: product.$id,
      name: product.name || "Untitled product",
      sku: product.sku || "N/A",
      status: product.status || "draft",
      stock: toNumber(product.stock),
    }));
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const warnings: string[] = [];

  if (!hasAdminReadConfig()) {
    return {
      chartPoints: [],
      isUsingFallback: true,
      lowStock: [],
      recentOrders: [],
      summary: {
        lowStockProducts: 0,
        pendingOrders: 0,
        totalCustomers: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalSales: 0,
      },
      topProducts: [],
      warnings: [
        "Appwrite admin dashboard reads are not fully configured yet. Add your Appwrite env vars and API key to enable live metrics.",
      ],
    };
  }

  if (!APPWRITE_COLLECTION_IDS.orders) {
    warnings.push("Orders collection id is missing.");
  }

  if (!APPWRITE_COLLECTION_IDS.products) {
    warnings.push("Products collection id is missing.");
  }

  if (!APPWRITE_COLLECTION_IDS.userProfiles) {
    warnings.push("User profiles collection id is missing.");
  }

  const [ordersResponse, productsResponse, userProfilesResponse] = await Promise.all([
    listAllDocuments<RawOrderDocument>(APPWRITE_COLLECTION_IDS.orders, [
      Query.orderDesc("$createdAt"),
    ]),
    listAllDocuments<RawProductDocument>(APPWRITE_COLLECTION_IDS.products, [
      Query.orderDesc("$createdAt"),
    ]),
    listAllDocuments<RawUserProfileDocument>(APPWRITE_COLLECTION_IDS.userProfiles, [
      Query.orderDesc("$createdAt"),
    ]),
  ]);

  const totalSales = ordersResponse.documents.reduce((sum, order) => {
    if (order.paymentStatus !== "paid") {
      return sum;
    }

    return sum + toNumber(order.estimatedTotal);
  }, 0);

  const pendingOrders = ordersResponse.documents.filter((order) => {
    const paymentPending = order.paymentStatus === "pending";
    const orderPending = order.orderStatus === "pending" || order.orderStatus === "processing";

    return paymentPending || orderPending;
  }).length;

  const totalCustomers = userProfilesResponse.documents.filter(
    (profile) => profile.role !== "admin",
  ).length;

  const allLowStockProducts = productsResponse.documents.filter((product) => {
    const stock = toNumber(product.stock);
    return product.status === "active" && stock > 0 && stock <= LOW_STOCK_THRESHOLD;
  });
  const lowStock = mapLowStockProducts(allLowStockProducts);

  return {
    chartPoints: buildChartPoints(ordersResponse.documents),
    isUsingFallback: false,
    lowStock,
    recentOrders: mapRecentOrders(ordersResponse.documents),
    summary: {
      lowStockProducts: allLowStockProducts.length,
      pendingOrders,
      totalCustomers,
      totalOrders: ordersResponse.total,
      totalProducts: productsResponse.total,
      totalSales,
    },
    topProducts: mapTopProducts(productsResponse.documents),
    warnings,
  };
}
