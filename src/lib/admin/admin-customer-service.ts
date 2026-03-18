import "server-only";

import { Query } from "appwrite";
import { buildAppwriteApiUrl, getAppwriteErrorMessage } from "@/lib/appwrite/server-api";
import { appwriteConfig } from "@/lib/appwrite/config";
import type { AccountAddress, AccountProfile } from "@/types/account";
import type { AdminCustomerDetail, AdminCustomerListItem } from "@/types/admin-customer";
import type { AppwriteUserProfile } from "@/types/auth";
import type { CheckoutPricing } from "@/types/checkout";
import type { OrderRecord, OrderStatus, OrderPaymentStatus } from "@/types/order";

type AppwriteDocumentListResponse<T> = {
  documents: Array<T & { $id: string }>;
  total: number;
};

type AppwriteAddressDocument = {
  $id: string;
  addressLine: string;
  city: string;
  clerkId: string;
  country: string;
  createdAt: string;
  fullName: string;
  isDefault: boolean;
  label: string;
  landmark: string;
  phoneNumber: string;
  postalCode: string;
  state: string;
  updatedAt: string;
};

type AppwriteProfileDocument = AppwriteUserProfile & { $id: string };

type AppwriteOrderDocument = {
  $id: string;
  addressLine: string;
  city: string;
  clerkId: string;
  country: string;
  couponCode: string;
  createdAt: string;
  deliveryMethod: OrderRecord["deliveryMethod"];
  email: string;
  estimatedTotal: number | string;
  fullName: string;
  inventoryAdjusted: boolean;
  items: string;
  landmark: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentMessage: string;
  paymentMeta: string;
  paymentMethod: string;
  paymentProvider: OrderRecord["paymentProvider"];
  paymentReference: string;
  paymentStatus: OrderPaymentStatus;
  paymentUrl: string;
  phoneNumber: string;
  postalCode: string;
  pricingSnapshot: string;
  shippingFee: number | string;
  state: string;
  subtotal: number | string;
  totalItemCount: number | string;
  totalQuantity: number | string;
  currency: string;
  updatedAt: string;
};

const PAGE_SIZE = 100;

function isCustomerServiceConfigured() {
  return Boolean(
    appwriteConfig.apiKey &&
      appwriteConfig.databaseId &&
      appwriteConfig.endpoint &&
      appwriteConfig.projectId &&
      appwriteConfig.userProfilesCollectionId &&
      appwriteConfig.ordersCollectionId,
  );
}

function getAppwriteHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Appwrite-Key": appwriteConfig.apiKey,
    "X-Appwrite-Project": appwriteConfig.projectId,
  };
}

function getCollectionUrl(collectionId: string) {
  return buildAppwriteApiUrl(
    `databases/${appwriteConfig.databaseId}/collections/${collectionId}/documents`,
  );
}

function parseJsonSafely<T>(value: string, fallback: T) {
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
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

function toAccountProfile(document: AppwriteProfileDocument): AccountProfile {
  return {
    avatar: document.avatar ?? "",
    clerkId: document.clerkId,
    email: document.email ?? "",
    fullName: document.fullName ?? "",
    id: document.$id,
    phone: document.phone ?? "",
    role: document.role ?? "customer",
  };
}

function toAccountAddress(document: AppwriteAddressDocument): AccountAddress {
  return {
    addressLine: document.addressLine,
    city: document.city,
    clerkId: document.clerkId,
    country: document.country,
    createdAt: document.createdAt,
    fullName: document.fullName,
    id: document.$id,
    isDefault: Boolean(document.isDefault),
    label: document.label,
    landmark: document.landmark,
    phoneNumber: document.phoneNumber,
    postalCode: document.postalCode,
    state: document.state,
    updatedAt: document.updatedAt,
  };
}

function toOrderRecord(document: AppwriteOrderDocument): OrderRecord {
  const pricingSnapshot = document.pricingSnapshot
    ? parseJsonSafely<Partial<CheckoutPricing>>(document.pricingSnapshot, {})
    : {};

  return {
    clerkId: document.clerkId,
    createdAt: document.createdAt,
    currency: document.currency,
    customer: {
      addressLine: document.addressLine,
      city: document.city,
      country: document.country,
      email: document.email,
      fullName: document.fullName,
      landmark: document.landmark,
      phoneNumber: document.phoneNumber,
      postalCode: document.postalCode,
      state: document.state,
    },
    deliveryMethod: document.deliveryMethod,
    id: document.$id,
    inventoryAdjusted: Boolean(document.inventoryAdjusted),
    items: parseJsonSafely(document.items, []),
    orderNumber: document.orderNumber || document.$id,
    orderStatus: document.orderStatus,
    paymentMessage: document.paymentMessage || null,
    paymentMeta: document.paymentMeta
      ? parseJsonSafely<Record<string, unknown> | null>(document.paymentMeta, null)
      : null,
    paymentMethod: document.paymentMethod || null,
    paymentProvider: document.paymentProvider,
    paymentReference: document.paymentReference,
    paymentStatus: document.paymentStatus,
    paymentUrl: document.paymentUrl || null,
    pricing: {
      appliedCoupon: pricingSnapshot.appliedCoupon ?? null,
      couponCode:
        document.couponCode || pricingSnapshot.couponCode || null,
      discountAmount: typeof pricingSnapshot.discountAmount === "number"
        ? pricingSnapshot.discountAmount
        : 0,
      estimatedTotal: toNumber(document.estimatedTotal),
      shippingFee: toNumber(document.shippingFee),
      subtotal: toNumber(document.subtotal),
      totalItemCount: toNumber(document.totalItemCount),
      totalQuantity: toNumber(document.totalQuantity),
    },
    updatedAt: document.updatedAt,
  };
}

async function listAllDocuments<TDocument>(collectionId: string, queries: string[] = []) {
  if (!collectionId) {
    return [] as TDocument[];
  }

  const documents: TDocument[] = [];
  let offset = 0;
  let total = 0;

  while (true) {
    const url = getCollectionUrl(collectionId);

    for (const query of queries) {
      url.searchParams.append("queries[]", query);
    }

    url.searchParams.append("queries[]", Query.limit(PAGE_SIZE));
    url.searchParams.append("queries[]", Query.offset(offset));

    const response = await fetch(url, {
      cache: "no-store",
      headers: getAppwriteHeaders(),
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        await getAppwriteErrorMessage(response, "Failed to load admin customer data."),
      );
    }

    const payload = (await response.json()) as AppwriteDocumentListResponse<TDocument>;
    total = payload.total;
    documents.push(...payload.documents);

    if (documents.length >= total || payload.documents.length === 0) {
      break;
    }

    offset += payload.documents.length;
  }

  return documents;
}

function summarizeOrders(orders: OrderRecord[]) {
  return orders.reduce(
    (summary, order) => {
      summary.totalOrders += 1;

      if (order.paymentStatus === "paid") {
        summary.totalSpend += order.pricing.estimatedTotal;
        summary.currency = order.currency || summary.currency;
      }

      if (!summary.mostRecentOrderDate || order.createdAt > summary.mostRecentOrderDate) {
        summary.mostRecentOrderDate = order.createdAt;
      }

      return summary;
    },
    {
      currency: "NGN",
      mostRecentOrderDate: null as string | null,
      totalOrders: 0,
      totalSpend: 0,
    },
  );
}

export async function listAdminCustomers(): Promise<AdminCustomerListItem[]> {
  if (!isCustomerServiceConfigured()) {
    throw new Error("Appwrite customer management is not configured.");
  }

  const [profiles, orders] = await Promise.all([
    listAllDocuments<AppwriteProfileDocument>(appwriteConfig.userProfilesCollectionId, [
      Query.orderAsc("fullName"),
    ]),
    listAllDocuments<AppwriteOrderDocument>(appwriteConfig.ordersCollectionId, [
      Query.orderDesc("$createdAt"),
    ]),
  ]);

  const customerProfiles = profiles.filter((profile) => profile.role !== "admin");
  const ordersByClerkId = new Map<string, OrderRecord[]>();

  for (const order of orders.map(toOrderRecord)) {
    const collection = ordersByClerkId.get(order.clerkId) ?? [];
    collection.push(order);
    ordersByClerkId.set(order.clerkId, collection);
  }

  return customerProfiles.map((profile) => {
    const accountProfile = toAccountProfile(profile);
    const customerOrders = ordersByClerkId.get(profile.clerkId) ?? [];
    const summary = summarizeOrders(customerOrders);

    return {
      clerkId: accountProfile.clerkId,
      currency: summary.currency,
      email: accountProfile.email,
      fullName: accountProfile.fullName,
      mostRecentOrderDate: summary.mostRecentOrderDate,
      phone: accountProfile.phone,
      totalOrders: summary.totalOrders,
      totalSpend: summary.totalSpend,
    };
  });
}

export async function getAdminCustomerByClerkId(
  clerkId: string,
): Promise<AdminCustomerDetail | null> {
  if (!isCustomerServiceConfigured()) {
    throw new Error("Appwrite customer management is not configured.");
  }

  const profileUrl = getCollectionUrl(appwriteConfig.userProfilesCollectionId);
  profileUrl.searchParams.append("queries[]", Query.equal("clerkId", clerkId));
  profileUrl.searchParams.append("queries[]", Query.limit(1));

  const profileResponse = await fetch(profileUrl, {
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "GET",
  });

  if (!profileResponse.ok) {
    throw new Error(
      await getAppwriteErrorMessage(profileResponse, "Failed to load customer profile."),
    );
  }

  const profilePayload =
    (await profileResponse.json()) as AppwriteDocumentListResponse<AppwriteProfileDocument>;
  const profileDocument = profilePayload.documents[0];

  if (!profileDocument || profileDocument.role === "admin") {
    return null;
  }

  const [addresses, orders] = await Promise.all([
    appwriteConfig.addressesCollectionId
      ? listAllDocuments<AppwriteAddressDocument>(appwriteConfig.addressesCollectionId, [
          Query.equal("clerkId", clerkId),
          Query.orderDesc("isDefault"),
          Query.orderDesc("$updatedAt"),
        ])
      : Promise.resolve([] as AppwriteAddressDocument[]),
    listAllDocuments<AppwriteOrderDocument>(appwriteConfig.ordersCollectionId, [
      Query.equal("clerkId", clerkId),
      Query.orderDesc("$createdAt"),
    ]),
  ]);

  const orderRecords = orders.map(toOrderRecord);
  const summary = summarizeOrders(orderRecords);

  return {
    addresses: addresses.map(toAccountAddress),
    profile: toAccountProfile(profileDocument),
    recentOrders: orderRecords.slice(0, 5),
    summary,
  };
}
