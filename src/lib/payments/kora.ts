import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { APP_NAME } from "@/constants/app";
import { ROUTES } from "@/constants/routes";
import { decrementInventoryForOrderItems } from "@/lib/catalog/catalog-inventory";
import {
  getOrderByPaymentReference,
  markOrderInventoryAdjusted,
  updateOrderVerificationState,
} from "@/lib/orders/order-service";
import type { CheckoutOrderDraft } from "@/types/checkout";
import type {
  KoraVerificationSnapshot,
  OrderPaymentStatus,
  OrderStatus,
} from "@/types/order";

type KoraInitializeResponse = {
  data?: {
    checkout_url?: string;
  };
  message?: string;
  status?: boolean;
};

type KoraVerificationResponse = {
  data?: {
    amount?: number;
    currency?: string;
    reference?: string;
    payment_method?: string;
    status?: string;
  };
  message?: string;
  status?: boolean;
};

type KoraWebhookPayload = {
  data?: {
    reference?: string;
    status?: string;
  };
  event?: string;
};

function getKoraBaseUrl() {
  return process.env.KORA_BASE_URL ?? "https://api.korapay.com";
}

function getKoraSecretKey() {
  return process.env.KORA_SECRET_KEY ?? "";
}

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function getKoraCurrency() {
  return process.env.KORA_CURRENCY ?? "NGN";
}

function getKoraAmountMultiplier() {
  const raw = Number(process.env.KORA_AMOUNT_MULTIPLIER ?? "1");
  return Number.isFinite(raw) && raw > 0 ? raw : 1;
}

function getNotificationUrl() {
  return (
    process.env.KORA_WEBHOOK_URL ??
    `${getAppUrl()}/api/payments/kora/webhook`
  );
}

function getRedirectUrl() {
  return `${getAppUrl()}${ROUTES.storefront.checkoutSuccess}`;
}

function isKoraConfigured() {
  return Boolean(getKoraSecretKey() && getAppUrl());
}

function getKoraHeaders() {
  return {
    Authorization: `Bearer ${getKoraSecretKey()}`,
    "Content-Type": "application/json",
  };
}

export function buildKoraPaymentReference() {
  return `ASTER-${Date.now()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
}

export function toKoraAmount(amount: number) {
  return Math.round(amount * getKoraAmountMultiplier());
}

export async function initializeKoraCheckout(input: {
  draft: CheckoutOrderDraft;
  orderId: string;
  paymentReference: string;
}) {
  if (!isKoraConfigured()) {
    throw new Error("Kora payment configuration is incomplete.");
  }

  const response = await fetch(
    `${getKoraBaseUrl()}/merchant/api/v1/charges/initialize`,
    {
      body: JSON.stringify({
        amount: toKoraAmount(input.draft.pricing.estimatedTotal),
        currency: getKoraCurrency(),
        customer: {
          email: input.draft.customer.email,
          name: input.draft.customer.fullName,
        },
        merchant_bears_cost: true,
        metadata: {
          orderId: input.orderId,
          source: "web-checkout",
        },
        notification_url: getNotificationUrl(),
        redirect_url: getRedirectUrl(),
        reference: input.paymentReference,
        narration: `${APP_NAME} checkout payment`,
      }),
      cache: "no-store",
      headers: getKoraHeaders(),
      method: "POST",
    },
  );

  const payload = (await response.json()) as KoraInitializeResponse;
  const checkoutUrl = payload.data?.checkout_url;

  if (!response.ok || !payload.status || !checkoutUrl) {
    throw new Error(payload.message ?? "Failed to initialize Kora checkout.");
  }

  return {
    checkoutUrl,
    message: payload.message ?? "Checkout initialized.",
  };
}

export async function verifyKoraCharge(paymentReference: string) {
  if (!isKoraConfigured()) {
    throw new Error("Kora payment configuration is incomplete.");
  }

  const response = await fetch(
    `${getKoraBaseUrl()}/merchant/api/v1/charges/${paymentReference}`,
    {
      cache: "no-store",
      headers: getKoraHeaders(),
      method: "GET",
    },
  );

  const payload = (await response.json()) as KoraVerificationResponse;
  const rawStatus = payload.data?.status?.toLowerCase() ?? "unknown";

  if (!response.ok || !payload.status) {
    throw new Error(payload.message ?? "Failed to verify Kora payment.");
  }

  const verification: KoraVerificationSnapshot = {
    amount: typeof payload.data?.amount === "number" ? payload.data.amount : null,
    currency: payload.data?.currency ?? null,
    message: payload.message ?? null,
    paymentMethod: payload.data?.payment_method ?? null,
    rawStatus,
    reference: payload.data?.reference ?? paymentReference,
    successful: rawStatus === "success",
  };

  return verification;
}

function mapKoraStatusToOrderState(rawStatus: string): {
  orderStatus: OrderStatus;
  paymentStatus: OrderPaymentStatus;
} {
  switch (rawStatus) {
    case "success":
      return { paymentStatus: "paid", orderStatus: "confirmed" };
    case "failed":
      return { paymentStatus: "failed", orderStatus: "failed" };
    case "cancelled":
    case "abandoned":
    case "expired":
      return { paymentStatus: "cancelled", orderStatus: "cancelled" };
    default:
      return { paymentStatus: "pending", orderStatus: "pending" };
  }
}

export async function verifyAndFinalizeKoraOrder(paymentReference: string) {
  const existingOrder = await getOrderByPaymentReference(paymentReference);

  if (!existingOrder) {
    throw new Error("Order not found for payment reference.");
  }

  if (existingOrder.paymentStatus === "paid" && existingOrder.inventoryAdjusted) {
    return {
      order: existingOrder,
      verification: {
        amount: null,
        currency: existingOrder.currency,
        message: existingOrder.paymentMessage,
        paymentMethod: existingOrder.paymentMethod,
        rawStatus: "success",
        reference: existingOrder.paymentReference,
        successful: true,
      } satisfies KoraVerificationSnapshot,
      isPaid: true,
      isPending: false,
    };
  }

  const verification = await verifyKoraCharge(paymentReference);
  const mappedState = mapKoraStatusToOrderState(verification.rawStatus);

  let order = await updateOrderVerificationState({
    orderStatus: mappedState.orderStatus,
    paymentMessage: verification.message,
    paymentMethod: verification.paymentMethod,
    paymentReference,
    paymentStatus: mappedState.paymentStatus,
    verification,
  });

  if (mappedState.paymentStatus === "paid" && !existingOrder.inventoryAdjusted) {
    // Inventory only moves after an explicit verified payment result. This keeps
    // stock changes aligned with confirmed money movement instead of checkout intent.
    await decrementInventoryForOrderItems(order.items);
    order = await markOrderInventoryAdjusted(paymentReference);
  }

  return {
    order,
    verification,
    isPaid: mappedState.paymentStatus === "paid",
    isPending: mappedState.paymentStatus === "pending",
  };
}

export function verifyKoraWebhookSignature(input: {
  payload: KoraWebhookPayload;
  signature: string;
}) {
  const secret = getKoraSecretKey();

  if (!secret || !input.payload.data) {
    return false;
  }

  const expectedSignature = createHmac("sha256", secret)
    .update(JSON.stringify(input.payload.data))
    .digest("hex");

  const expectedBuffer = Buffer.from(expectedSignature);
  const receivedBuffer = Buffer.from(input.signature);

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, receivedBuffer);
}
