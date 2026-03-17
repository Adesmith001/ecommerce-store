import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin/admin-api-guard";
import {
  createAdminCategory,
  listAdminCategories,
} from "@/lib/admin/admin-merchandising-service";
import type { CategoryFormValues } from "@/types/admin-merchandising";

export async function GET() {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  try {
    const categories = await listAdminCategories();

    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to load categories.",
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
    const values = (await request.json()) as CategoryFormValues;
    const category = await createAdminCategory(values);

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to create category.",
      },
      { status: 400 },
    );
  }
}
