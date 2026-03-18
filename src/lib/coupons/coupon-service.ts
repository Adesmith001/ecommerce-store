import "server-only";

import { ID, Query } from "appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { buildAppwriteApiUrl, getAppwriteErrorMessage } from "@/lib/appwrite/server-api";
import { createAppliedCouponSnapshot, evaluateCoupon, normalizeCouponCode } from "@/lib/coupons/coupon-pricing";
import { validateAdminCouponForm } from "@/lib/admin/admin-coupon-validation";
import { formatCurrency } from "@/helpers/format-currency";
import type {
  AdminCouponFormContext,
  AdminCouponFormValues,
} from "@/types/admin-coupon";
import type {
  AppliedCoupon,
  CouponDiscountType,
  CouponRecord,
  CouponValidationInput,
} from "@/types/coupon";

type AppwriteDocumentListResponse<T> = {
  documents: Array<T & { $id: string }>;
  total?: number;
};

type AppwriteCouponDocument = {
  $createdAt: string;
  $id: string;
  $updatedAt: string;
  active?: boolean;
  code?: string;
  discountType?: CouponDiscountType;
  discountValue?: number | string;
  endDate?: string;
  minimumSpend?: number | string;
  restrictedCategorySlugs?: unknown;
  restrictedProductIds?: unknown;
  startDate?: string;
  usageCount?: number | string;
  usageLimit?: number | string;
};

function isCouponConfigured() {
  return Boolean(
    appwriteConfig.apiKey &&
      appwriteConfig.databaseId &&
      appwriteConfig.endpoint &&
      appwriteConfig.projectId &&
      appwriteConfig.catalog.couponsCollectionId,
  );
}

function getAppwriteHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Appwrite-Key": appwriteConfig.apiKey,
    "X-Appwrite-Project": appwriteConfig.projectId,
  };
}

function getCouponCollectionUrl() {
  return buildAppwriteApiUrl(
    `databases/${appwriteConfig.databaseId}/collections/${appwriteConfig.catalog.couponsCollectionId}/documents`,
  );
}

function getCouponDocumentUrl(couponId: string) {
  return buildAppwriteApiUrl(
    `databases/${appwriteConfig.databaseId}/collections/${appwriteConfig.catalog.couponsCollectionId}/documents/${couponId}`,
  );
}

function parseStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : [];
    } catch {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return [];
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

function parseDelimitedValues(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toCouponRecord(document: AppwriteCouponDocument): CouponRecord {
  const usageLimit = toNumber(document.usageLimit);

  return {
    active: Boolean(document.active),
    code: normalizeCouponCode(document.code ?? ""),
    createdAt: document.$createdAt,
    discountType: document.discountType === "fixed" ? "fixed" : "percentage",
    discountValue: toNumber(document.discountValue),
    endDate: document.endDate ?? "",
    id: document.$id,
    minimumSpend: toNumber(document.minimumSpend),
    restrictedCategorySlugs: parseStringArray(document.restrictedCategorySlugs),
    restrictedProductIds: parseStringArray(document.restrictedProductIds),
    startDate: document.startDate ?? "",
    updatedAt: document.$updatedAt,
    usageCount: toNumber(document.usageCount),
    usageLimit: usageLimit > 0 ? usageLimit : null,
  };
}

function toCouponFormValues(coupon: CouponRecord): AdminCouponFormValues {
  return {
    active: coupon.active,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: String(coupon.discountValue),
    endDate: coupon.endDate.slice(0, 16),
    minimumSpend: String(coupon.minimumSpend),
    restrictedCategorySlugs: coupon.restrictedCategorySlugs.join(", "),
    restrictedProductIds: coupon.restrictedProductIds.join(", "),
    startDate: coupon.startDate.slice(0, 16),
    usageLimit: coupon.usageLimit === null ? "" : String(coupon.usageLimit),
  };
}

function buildEmptyCouponValues(): AdminCouponFormValues {
  const now = new Date();
  const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const toLocalInput = (value: Date) => value.toISOString().slice(0, 16);

  return {
    active: true,
    code: "",
    discountType: "percentage",
    discountValue: "",
    endDate: toLocalInput(end),
    minimumSpend: "0",
    restrictedCategorySlugs: "",
    restrictedProductIds: "",
    startDate: toLocalInput(now),
    usageLimit: "",
  };
}

async function assertUniqueCouponCode(code: string, currentCouponId?: string) {
  const url = getCouponCollectionUrl();
  url.searchParams.append("queries[]", Query.equal("code", code));
  url.searchParams.append("queries[]", Query.limit(1));

  const response = await fetch(url, {
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to validate coupon code."),
    );
  }

  const payload =
    (await response.json()) as AppwriteDocumentListResponse<AppwriteCouponDocument>;
  const duplicate = payload.documents[0];

  if (duplicate && duplicate.$id !== currentCouponId) {
    throw new Error("Another coupon already uses this code.");
  }
}

async function saveCouponDocument(
  method: "PATCH" | "POST",
  values: AdminCouponFormValues,
  couponId?: string,
) {
  if (!isCouponConfigured()) {
    throw new Error("Appwrite coupon storage is not configured.");
  }

  const normalizedCode = normalizeCouponCode(values.code);
  const normalizedValues = {
    ...values,
    code: normalizedCode,
  };
  const validationErrors = validateAdminCouponForm(normalizedValues);

  if (Object.keys(validationErrors).length > 0) {
    throw new Error("Please fix the highlighted coupon fields.");
  }

  await assertUniqueCouponCode(normalizedCode, couponId);

  const response = await fetch(
    method === "POST" ? getCouponCollectionUrl() : getCouponDocumentUrl(couponId!),
    {
      body: JSON.stringify({
        data: {
          active: normalizedValues.active,
          code: normalizedCode,
          discountType: normalizedValues.discountType,
          discountValue: Number(normalizedValues.discountValue),
          endDate: new Date(normalizedValues.endDate).toISOString(),
          minimumSpend: Number(normalizedValues.minimumSpend),
          restrictedCategorySlugs: JSON.stringify(
            parseDelimitedValues(normalizedValues.restrictedCategorySlugs),
          ),
          restrictedProductIds: JSON.stringify(
            parseDelimitedValues(normalizedValues.restrictedProductIds),
          ),
          startDate: new Date(normalizedValues.startDate).toISOString(),
          usageLimit: Number(normalizedValues.usageLimit || "0"),
          ...(method === "POST" ? { usageCount: 0 } : {}),
        },
        ...(method === "POST" ? { documentId: ID.unique() } : {}),
      }),
      cache: "no-store",
      headers: getAppwriteHeaders(),
      method,
    },
  );

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to save coupon."),
    );
  }

  return toCouponRecord((await response.json()) as AppwriteCouponDocument);
}

export async function listAdminCoupons() {
  if (!isCouponConfigured()) {
    return [];
  }

  const url = getCouponCollectionUrl();
  url.searchParams.append("queries[]", Query.orderDesc("$updatedAt"));

  const response = await fetch(url, {
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to list coupons."),
    );
  }

  const payload =
    (await response.json()) as AppwriteDocumentListResponse<AppwriteCouponDocument>;

  return payload.documents.map(toCouponRecord);
}

export async function getAdminCouponById(couponId: string) {
  if (!isCouponConfigured()) {
    throw new Error("Appwrite coupon storage is not configured.");
  }

  const response = await fetch(getCouponDocumentUrl(couponId), {
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "GET",
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to load coupon."),
    );
  }

  return toCouponRecord((await response.json()) as AppwriteCouponDocument);
}

export async function getAdminCouponFormContext(
  mode: "create" | "edit",
  couponId?: string,
): Promise<AdminCouponFormContext> {
  const coupon = couponId ? await getAdminCouponById(couponId) : null;

  return {
    couponId,
    initialValues: coupon ? toCouponFormValues(coupon) : buildEmptyCouponValues(),
    mode,
  };
}

export async function createAdminCoupon(values: AdminCouponFormValues) {
  return saveCouponDocument("POST", values);
}

export async function updateAdminCoupon(couponId: string, values: AdminCouponFormValues) {
  return saveCouponDocument("PATCH", values, couponId);
}

export async function disableAdminCoupon(couponId: string) {
  if (!isCouponConfigured()) {
    throw new Error("Appwrite coupon storage is not configured.");
  }

  const response = await fetch(getCouponDocumentUrl(couponId), {
    body: JSON.stringify({
      data: {
        active: false,
      },
    }),
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to disable coupon."),
    );
  }

  return toCouponRecord((await response.json()) as AppwriteCouponDocument);
}

export async function findCouponByCode(code: string) {
  if (!isCouponConfigured()) {
    throw new Error("Appwrite coupon storage is not configured.");
  }

  const normalizedCode = normalizeCouponCode(code);
  const url = getCouponCollectionUrl();
  url.searchParams.append("queries[]", Query.equal("code", normalizedCode));
  url.searchParams.append("queries[]", Query.limit(1));

  const response = await fetch(url, {
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to validate coupon."),
    );
  }

  const payload =
    (await response.json()) as AppwriteDocumentListResponse<AppwriteCouponDocument>;

  return payload.documents[0] ? toCouponRecord(payload.documents[0]) : null;
}

export async function validateCouponApplication(input: CouponValidationInput): Promise<{
  appliedCoupon: AppliedCoupon;
  discountAmount: number;
  message: string;
}> {
  const normalizedCode = normalizeCouponCode(input.code);

  if (!normalizedCode) {
    throw new Error("Enter a coupon code to apply.");
  }

  const coupon = await findCouponByCode(normalizedCode);

  if (!coupon) {
    throw new Error("This coupon does not exist.");
  }

  if (!coupon.active) {
    throw new Error("This coupon is currently disabled.");
  }

  const now = new Date();
  const startsAt = new Date(coupon.startDate);
  const endsAt = new Date(coupon.endDate);

  if (now < startsAt || now > endsAt) {
    throw new Error("This coupon is not currently valid.");
  }

  if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) {
    throw new Error("This coupon has reached its usage limit.");
  }

  if (input.subtotal < coupon.minimumSpend) {
    throw new Error(
      `This coupon requires a minimum spend of ${formatCurrency(coupon.minimumSpend)}.`,
    );
  }

  const evaluation = evaluateCoupon({
    code: normalizedCode,
    coupon,
    items: input.items,
    subtotal: input.subtotal,
  });

  if (!evaluation.isValid || !evaluation.appliedCoupon) {
    throw new Error("This coupon does not apply to the current cart.");
  }

  return {
    appliedCoupon: createAppliedCouponSnapshot(coupon),
    discountAmount: evaluation.discountAmount,
    message: `${coupon.code} applied successfully.`,
  };
}

export async function incrementCouponUsage(couponId: string) {
  const coupon = await getAdminCouponById(couponId);

  if (!coupon) {
    return null;
  }

  const response = await fetch(getCouponDocumentUrl(couponId), {
    body: JSON.stringify({
      data: {
        usageCount: coupon.usageCount + 1,
      },
    }),
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to update coupon usage."),
    );
  }

  return toCouponRecord((await response.json()) as AppwriteCouponDocument);
}
