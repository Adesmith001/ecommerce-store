import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin/admin-api-guard";
import {
  createAdminBanner,
  listAdminBanners,
} from "@/lib/admin/admin-merchandising-service";
import type { BannerFormValues } from "@/types/admin-merchandising";

export async function GET() {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  try {
    const banners = await listAdminBanners();

    return NextResponse.json({ banners });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to load banners.",
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
    const values = (await request.json()) as BannerFormValues;
    const banner = await createAdminBanner(values);

    return NextResponse.json({ banner }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to create banner.",
      },
      { status: 400 },
    );
  }
}
