import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin/admin-api-guard";
import {
  createAdminCoupon,
  listAdminCoupons,
} from "@/lib/coupons/coupon-service";
import type { AdminCouponFormValues } from "@/types/admin-coupon";

export async function GET() {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  try {
    const coupons = await listAdminCoupons();

    return NextResponse.json({ coupons });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to load coupons.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  try {
    const values = (await request.json()) as AdminCouponFormValues;
    const coupon = await createAdminCoupon(values);

    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to create coupon.",
      },
      { status: 400 },
    );
  }
}
