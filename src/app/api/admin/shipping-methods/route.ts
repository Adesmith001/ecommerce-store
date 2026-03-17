import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin/admin-api-guard";
import {
  listAdminShippingMethods,
  upsertAdminShippingMethod,
} from "@/lib/shipping/shipping-service";
import type { ShippingMethodFormValues } from "@/types/shipping";

export async function GET() {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  try {
    const shippingMethods = await listAdminShippingMethods();

    return NextResponse.json({ shippingMethods });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to load shipping settings.",
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
    const values = (await request.json()) as ShippingMethodFormValues;
    const shippingMethod = await upsertAdminShippingMethod(values);

    return NextResponse.json({ shippingMethod });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to save shipping method.",
      },
      { status: 400 },
    );
  }
}
