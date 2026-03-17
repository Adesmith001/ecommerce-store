import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin/admin-api-guard";
import {
  archiveAdminBrand,
  getAdminBrandById,
  updateAdminBrand,
} from "@/lib/admin/admin-merchandising-service";
import type { BrandFormValues } from "@/types/admin-merchandising";

type BrandRouteContext = {
  params: Promise<{ brandId: string }>;
};

export async function GET(_request: Request, context: BrandRouteContext) {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  const { brandId } = await context.params;

  try {
    const brand = await getAdminBrandById(brandId);

    if (!brand) {
      return NextResponse.json({ message: "Brand not found." }, { status: 404 });
    }

    return NextResponse.json({ brand });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to load brand.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: BrandRouteContext) {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  const { brandId } = await context.params;

  try {
    const values = (await request.json()) as BrandFormValues;
    const brand = await updateAdminBrand(brandId, values);

    return NextResponse.json({ brand });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to update brand.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, context: BrandRouteContext) {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  const { brandId } = await context.params;

  try {
    const brand = await archiveAdminBrand(brandId);

    return NextResponse.json({ brand });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to archive brand.",
      },
      { status: 400 },
    );
  }
}
