import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin/admin-api-guard";
import { upsertStoreContentPage } from "@/lib/settings/store-settings-service";
import type { StoreContentPageFormValues } from "@/types/store-settings";

export async function POST(request: Request) {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  try {
    const values = (await request.json()) as StoreContentPageFormValues;
    const contentPage = await upsertStoreContentPage(values);

    return NextResponse.json({ contentPage });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to save store content.",
      },
      { status: 400 },
    );
  }
}
