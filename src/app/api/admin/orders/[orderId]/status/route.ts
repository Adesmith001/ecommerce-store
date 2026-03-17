import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin/admin-api-guard";
import { updateAdminOrderStatus } from "@/lib/admin/admin-order-service";
import type { OrderStatus } from "@/types/order";

type AdminOrderStatusRouteContext = {
  params: Promise<{ orderId: string }>;
};

export async function PATCH(
  request: Request,
  context: AdminOrderStatusRouteContext,
) {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  const { orderId } = await context.params;

  try {
    const payload = (await request.json()) as { orderStatus?: OrderStatus };
    const order = await updateAdminOrderStatus({
      nextStatus: payload.orderStatus as OrderStatus,
      orderId,
    });

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to update order status.",
      },
      { status: 400 },
    );
  }
}
