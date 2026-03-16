import { buildCheckoutOrderDraft } from "@/lib/checkout/checkout-order";
import type { CartItem } from "@/types/cart";
import type {
  CheckoutFormErrors,
  CheckoutFormValues,
  CheckoutOrderDraft,
  DeliveryMethod,
} from "@/types/checkout";

function isBlank(value: string) {
  return !value.trim();
}

function isEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value);
}

export function validateCheckoutForm(values: CheckoutFormValues) {
  const errors: CheckoutFormErrors = {};

  if (isBlank(values.fullName)) errors.fullName = "Full name is required.";
  if (isBlank(values.email)) {
    errors.email = "Email is required.";
  } else if (!isEmail(values.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (isBlank(values.phoneNumber)) errors.phoneNumber = "Phone number is required.";
  if (isBlank(values.country)) errors.country = "Country is required.";
  if (isBlank(values.state)) errors.state = "State is required.";
  if (isBlank(values.city)) errors.city = "City is required.";
  if (isBlank(values.addressLine)) errors.addressLine = "Address line is required.";

  return errors;
}

function isCategoryReference(
  value: CartItem["category"],
): value is NonNullable<CartItem["category"]> {
  return Boolean(
    value &&
      typeof value === "object" &&
      typeof value.id === "string" &&
      typeof value.name === "string" &&
      typeof value.slug === "string",
  );
}

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as CartItem;

  return Boolean(
    typeof candidate.productId === "string" &&
      typeof candidate.slug === "string" &&
      typeof candidate.name === "string" &&
      typeof candidate.sku === "string" &&
      (candidate.image === null ||
        (typeof candidate.image === "object" &&
          typeof candidate.image.id === "string" &&
          typeof candidate.image.url === "string" &&
          typeof candidate.image.alt === "string")) &&
      typeof candidate.price === "number" &&
      (candidate.salePrice === null || typeof candidate.salePrice === "number") &&
      typeof candidate.quantity === "number" &&
      typeof candidate.stock === "number" &&
      (candidate.category === null || isCategoryReference(candidate.category)),
  );
}

function isDeliveryMethod(value: unknown): value is DeliveryMethod {
  return value === "standard" || value === "express" || value === "pickup";
}

function isCheckoutFormValues(value: unknown): value is CheckoutFormValues {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as CheckoutFormValues;

  return Boolean(
    typeof candidate.fullName === "string" &&
      typeof candidate.email === "string" &&
      typeof candidate.phoneNumber === "string" &&
      typeof candidate.country === "string" &&
      typeof candidate.state === "string" &&
      typeof candidate.city === "string" &&
      typeof candidate.addressLine === "string" &&
      typeof candidate.landmark === "string" &&
      typeof candidate.postalCode === "string",
  );
}

export function normalizeCheckoutOrderDraftPayload(
  value: unknown,
): CheckoutOrderDraft | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const candidate = value as {
    customer?: unknown;
    deliveryMethod?: unknown;
    items?: unknown;
    pricing?: { couponCode?: unknown } | null;
  };

  if (
    !isCheckoutFormValues(candidate.customer) ||
    !isDeliveryMethod(candidate.deliveryMethod) ||
    !Array.isArray(candidate.items) ||
    !candidate.items.every(isCartItem)
  ) {
    return null;
  }

  const couponCode =
    candidate.pricing &&
    typeof candidate.pricing === "object" &&
    typeof candidate.pricing.couponCode === "string"
      ? candidate.pricing.couponCode
      : undefined;

  return buildCheckoutOrderDraft({
    couponCode,
    deliveryMethod: candidate.deliveryMethod,
    items: candidate.items,
    values: candidate.customer,
  });
}
