import "server-only";

import { ID, Query } from "appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import {
  buildAppwriteApiUrl,
  getAppwriteErrorMessage,
  logAppwriteReadFallback,
} from "@/lib/appwrite/server-api";
import type {
  DeliveryMethod,
  ShippingMethod,
  ShippingMethodFormErrors,
  ShippingMethodFormValues,
} from "@/types";

type AppwriteDocumentListResponse<T> = {
  documents: Array<T & { $id: string }>;
};

type AppwriteShippingMethodDocument = {
  $createdAt: string;
  $id: string;
  $updatedAt: string;
  active?: boolean;
  code?: DeliveryMethod;
  description?: string;
  estimatedDelivery?: string;
  fee?: number | string;
  name?: string;
};

const SHIPPING_CODE_ORDER: Record<DeliveryMethod, number> = {
  standard: 1,
  express: 2,
  pickup: 3,
};

const DEFAULT_SHIPPING_METHODS: ShippingMethod[] = [
  {
    active: true,
    code: "standard",
    createdAt: "",
    description: "Reliable delivery for everyday orders.",
    estimatedDelivery: "3-5 business days",
    fee: 8,
    id: "standard",
    name: "Standard delivery",
    updatedAt: "",
  },
  {
    active: true,
    code: "express",
    createdAt: "",
    description: "Priority handling for faster delivery.",
    estimatedDelivery: "1-2 business days",
    fee: 18,
    id: "express",
    name: "Express delivery",
    updatedAt: "",
  },
  {
    active: true,
    code: "pickup",
    createdAt: "",
    description: "Collect your order from the pickup point.",
    estimatedDelivery: "Ready for pickup today",
    fee: 0,
    id: "pickup",
    name: "Pickup",
    updatedAt: "",
  },
] as const;

function isShippingConfigured() {
  return Boolean(
    appwriteConfig.apiKey &&
      appwriteConfig.databaseId &&
      appwriteConfig.endpoint &&
      appwriteConfig.projectId &&
      appwriteConfig.catalog.shippingMethodsCollectionId,
  );
}

function getShippingCollectionUrl() {
  return buildAppwriteApiUrl(
    `databases/${appwriteConfig.databaseId}/collections/${appwriteConfig.catalog.shippingMethodsCollectionId}/documents`,
  );
}

function getShippingDocumentUrl(methodId: string) {
  return buildAppwriteApiUrl(
    `databases/${appwriteConfig.databaseId}/collections/${appwriteConfig.catalog.shippingMethodsCollectionId}/documents/${methodId}`,
  );
}

function getAppwriteHeaders() {
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

function sortShippingMethods(methods: ShippingMethod[]) {
  return [...methods].sort(
    (left, right) => SHIPPING_CODE_ORDER[left.code] - SHIPPING_CODE_ORDER[right.code],
  );
}

function toShippingMethod(
  document: AppwriteShippingMethodDocument,
): ShippingMethod {
  return {
    active: Boolean(document.active),
    code: document.code ?? "standard",
    createdAt: document.$createdAt,
    description: document.description ?? "",
    estimatedDelivery: document.estimatedDelivery ?? "",
    fee: toNumber(document.fee),
    id: document.$id,
    name: document.name ?? "",
    updatedAt: document.$updatedAt,
  };
}

function validateShippingMethodForm(
  values: ShippingMethodFormValues,
): ShippingMethodFormErrors {
  const errors: ShippingMethodFormErrors = {};
  const fee = Number(values.fee);

  if (!values.name.trim()) {
    errors.name = "Method name is required.";
  }

  if (!values.description.trim()) {
    errors.description = "Description is required.";
  }

  if (!values.estimatedDelivery.trim()) {
    errors.estimatedDelivery = "Estimated delivery text is required.";
  }

  if (!Number.isFinite(fee) || fee < 0) {
    errors.fee = "Fee must be zero or greater.";
  }

  if (!values.code) {
    errors.code = "Method code is required.";
  }

  return errors;
}

async function findShippingDocumentByCode(code: DeliveryMethod) {
  const url = getShippingCollectionUrl();
  url.searchParams.append("queries[]", Query.equal("code", code));
  url.searchParams.append("queries[]", Query.limit(1));

  const response = await fetch(url, {
    cache: "no-store",
    headers: getAppwriteHeaders(),
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to read shipping methods."),
    );
  }

  const payload =
    (await response.json()) as AppwriteDocumentListResponse<AppwriteShippingMethodDocument>;

  return payload.documents[0] ? toShippingMethod(payload.documents[0]) : null;
}

export function getDefaultShippingMethods() {
  return sortShippingMethods([...DEFAULT_SHIPPING_METHODS]);
}

export async function listAdminShippingMethods() {
  if (!isShippingConfigured()) {
    return getDefaultShippingMethods();
  }

  try {
    const url = getShippingCollectionUrl();
    const response = await fetch(url, {
      cache: "no-store",
      headers: getAppwriteHeaders(),
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(
        await getAppwriteErrorMessage(response, "Failed to load shipping methods."),
      );
    }

    const payload =
      (await response.json()) as AppwriteDocumentListResponse<AppwriteShippingMethodDocument>;

    return sortShippingMethods(payload.documents.map(toShippingMethod));
  } catch (error) {
    logAppwriteReadFallback(
      "Shipping service error: listAdminShippingMethods",
      error,
      "Using default shipping methods.",
    );
    return getDefaultShippingMethods();
  }
}

export async function listActiveShippingMethods() {
  if (!isShippingConfigured()) {
    return getDefaultShippingMethods();
  }

  const methods = await listAdminShippingMethods();
  return methods.filter((method) => method.active);
}

export async function upsertAdminShippingMethod(values: ShippingMethodFormValues) {
  if (!isShippingConfigured()) {
    throw new Error("Appwrite shipping settings are not configured.");
  }

  const errors = validateShippingMethodForm(values);
  if (Object.keys(errors).length > 0) {
    throw new Error("Please fix the highlighted shipping method fields.");
  }

  const existingMethod = await findShippingDocumentByCode(values.code);
  const nowPayload = {
    active: values.active,
    code: values.code,
    description: values.description.trim(),
    estimatedDelivery: values.estimatedDelivery.trim(),
    fee: Number(values.fee),
    name: values.name.trim(),
  };

  const response = await fetch(
    existingMethod ? getShippingDocumentUrl(existingMethod.id) : getShippingCollectionUrl(),
    {
      body: JSON.stringify({
        data: nowPayload,
        ...(existingMethod ? {} : { documentId: ID.unique() }),
      }),
      cache: "no-store",
      headers: getAppwriteHeaders(),
      method: existingMethod ? "PATCH" : "POST",
    },
  );

  if (!response.ok) {
    throw new Error(
      await getAppwriteErrorMessage(response, "Failed to save shipping method."),
    );
  }

  return toShippingMethod((await response.json()) as AppwriteShippingMethodDocument);
}
