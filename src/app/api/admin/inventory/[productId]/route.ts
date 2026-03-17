import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin/admin-api-guard";
import { updateAdminProductStock } from "@/lib/admin/admin-inventory-service";

type InventoryRouteContext = {
  params: Promise<{ productId: string }>;
};

export async function PATCH(request: Request, context: InventoryRouteContext) {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  const { productId } = await context.params;

  try {
    const payload = (await request.json()) as { stock?: number };
    const product = await updateAdminProductStock(productId, Number(payload.stock));

    return NextResponse.json({ product });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to update inventory.",
      },
      { status: 400 },
    );
  }
}
