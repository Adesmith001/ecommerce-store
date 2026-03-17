import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin/admin-api-guard";
import {
  archiveAdminCategory,
  getAdminCategoryById,
  updateAdminCategory,
} from "@/lib/admin/admin-merchandising-service";
import type { CategoryFormValues } from "@/types/admin-merchandising";

type CategoryRouteContext = {
  params: Promise<{ categoryId: string }>;
};

export async function GET(_request: Request, context: CategoryRouteContext) {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  const { categoryId } = await context.params;

  try {
    const category = await getAdminCategoryById(categoryId);

    if (!category) {
      return NextResponse.json({ message: "Category not found." }, { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to load category.",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: CategoryRouteContext) {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  const { categoryId } = await context.params;

  try {
    const values = (await request.json()) as CategoryFormValues;
    const category = await updateAdminCategory(categoryId, values);

    return NextResponse.json({ category });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to update category.",
      },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, context: CategoryRouteContext) {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  const { categoryId } = await context.params;

  try {
    const category = await archiveAdminCategory(categoryId);

    return NextResponse.json({ category });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to archive category.",
      },
      { status: 400 },
    );
  }
}
