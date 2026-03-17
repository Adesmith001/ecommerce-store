import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin/admin-api-guard";
import {
  deactivateAdminBanner,
  getAdminBannerById,
  updateAdminBanner,
} from "@/lib/admin/admin-merchandising-service";
import type { BannerFormValues } from "@/types/admin-merchandising";

type BannerRouteContext = {
  params: Promise<{ bannerId: string }>;
};

export async function GET(_request: Request, context: BannerRouteContext) {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  const { bannerId } = await context.params;

  try {
    const banner = await getAdminBannerById(bannerId);

    if (!banner) {
      return NextResponse.json({ message: "Banner not found." }, { status: 404 });
    }

    return NextResponse.json({ banner });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to load banner.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: BannerRouteContext) {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  const { bannerId } = await context.params;

  try {
    const values = (await request.json()) as BannerFormValues;
    const banner = await updateAdminBanner(bannerId, values);

    return NextResponse.json({ banner });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to update banner.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, context: BannerRouteContext) {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  const { bannerId } = await context.params;

  try {
    const banner = await deactivateAdminBanner(bannerId);

    return NextResponse.json({ banner });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to deactivate banner.",
      },
      { status: 400 },
    );
  }
}
