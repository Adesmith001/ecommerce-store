import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin/admin-api-guard";
import {
  disableAdminCoupon,
  getAdminCouponById,
  updateAdminCoupon,
} from "@/lib/coupons/coupon-service";
import type { AdminCouponFormValues } from "@/types/admin-coupon";

type CouponRouteContext = {
  params: Promise<{ couponId: string }>;
};

export async function GET(_request: Request, context: CouponRouteContext) {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  const { couponId } = await context.params;

  try {
    const coupon = await getAdminCouponById(couponId);

    if (!coupon) {
      return NextResponse.json({ message: "Coupon not found." }, { status: 404 });
    }

    return NextResponse.json({ coupon });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to load coupon.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: CouponRouteContext) {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  const { couponId } = await context.params;

  try {
    const values = (await request.json()) as AdminCouponFormValues;
    const coupon = await updateAdminCoupon(couponId, values);

    return NextResponse.json({ coupon });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to update coupon.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, context: CouponRouteContext) {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  const { couponId } = await context.params;

  try {
    const coupon = await disableAdminCoupon(couponId);

    return NextResponse.json({ coupon });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to disable coupon.",
      },
      { status: 400 },
    );
  }
}
