import { NextResponse } from "next/server";
import { validateCouponApplication } from "@/lib/coupons/coupon-service";
import type { CartItem } from "@/types/cart";

type CouponApplyPayload = {
  code?: unknown;
  items?: unknown;
};

function isCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<CartItem>;

  return (
    typeof candidate.productId === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.price === "number" &&
    typeof candidate.quantity === "number" &&
    typeof candidate.sku === "string" &&
    typeof candidate.slug === "string" &&
    typeof candidate.stock === "number"
  );
}

export async function POST(request: Request) {
  let payload: CouponApplyPayload;

  try {
    payload = (await request.json()) as CouponApplyPayload;
  } catch {
    return NextResponse.json(
      { message: "Coupon payload could not be parsed." },
      { status: 400 },
    );
  }

  const code = typeof payload.code === "string" ? payload.code : "";
  const items = Array.isArray(payload.items)
    ? payload.items.filter(isCartItem)
    : [];

  if (items.length === 0) {
    return NextResponse.json(
      { message: "Add items to your cart before applying a coupon." },
      { status: 400 },
    );
  }

  try {
    const result = await validateCouponApplication({
      code,
      items,
      subtotal: items.reduce(
        (total, item) => total + (item.salePrice ?? item.price) * item.quantity,
        0,
      ),
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "This coupon could not be applied.",
      },
      { status: 400 },
    );
  }
}
