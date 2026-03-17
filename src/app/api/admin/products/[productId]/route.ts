import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin/admin-api-guard";
import {
  archiveAdminProduct,
  getAdminProductById,
  updateAdminProduct,
} from "@/lib/admin/admin-product-service";
import type { AdminProductFormValues } from "@/types/admin-product";

type ProductRouteContext = {
  params: Promise<{ productId: string }>;
};

export async function GET(_request: Request, context: ProductRouteContext) {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  const { productId } = await context.params;

  try {
    const product = await getAdminProductById(productId);

    if (!product) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to load product.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: ProductRouteContext) {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  const { productId } = await context.params;

  try {
    const values = (await request.json()) as AdminProductFormValues;
    const product = await updateAdminProduct(productId, values);

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to update product.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, context: ProductRouteContext) {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  const { productId } = await context.params;

  try {
    const product = await archiveAdminProduct(productId);

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to archive product.",
      },
      { status: 400 },
    );
  }
}
