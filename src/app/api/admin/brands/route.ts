import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin/admin-api-guard";
import {
  createAdminBrand,
  listAdminBrands,
} from "@/lib/admin/admin-merchandising-service";
import type { BrandFormValues } from "@/types/admin-merchandising";

export async function GET() {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  try {
    const brands = await listAdminBrands();

    return NextResponse.json({ brands });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to load brands.",
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
    const values = (await request.json()) as BrandFormValues;
    const brand = await createAdminBrand(values);

    return NextResponse.json({ brand }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to create brand.",
      },
      { status: 400 },
    );
  }
}
