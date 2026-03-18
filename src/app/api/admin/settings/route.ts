import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin/admin-api-guard";
import { upsertStoreSettings } from "@/lib/settings/store-settings-service";
import type { StoreSettingsFormValues } from "@/types/store-settings";

export async function POST(request: Request) {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  try {
    const values = (await request.json()) as StoreSettingsFormValues;
    const settings = await upsertStoreSettings(values);

    return NextResponse.json({ settings });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to save store settings.",
      },
      { status: 400 },
    );
  }
}
