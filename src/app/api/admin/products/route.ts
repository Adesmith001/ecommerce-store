import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin/admin-api-guard";
import {
  createAdminProduct,
  listAdminProducts,
} from "@/lib/admin/admin-product-service";
import type { AdminProductFormValues } from "@/types/admin-product";

export async function GET() {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  try {
    const products = await listAdminProducts();

    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to load admin products.",
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
    const values = (await request.json()) as AdminProductFormValues;
    const product = await createAdminProduct(values);

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to create product.",
      },
      { status: 400 },
    );
  }
}
