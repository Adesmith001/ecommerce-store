import { NextResponse } from "next/server";
import { requireAdminApiAccess } from "@/lib/admin/admin-api-guard";
import { deleteCloudinaryImage } from "@/lib/cloudinary/server";

export async function DELETE(request: Request) {
  const access = await requireAdminApiAccess();

  if (access.errorResponse) {
    return access.errorResponse;
  }

  try {
    const payload = (await request.json()) as { publicId?: string };

    if (!payload.publicId?.trim()) {
      return NextResponse.json(
        { message: "Cloudinary public ID is required." },
        { status: 400 },
      );
    }

    await deleteCloudinaryImage(payload.publicId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete Cloudinary image.",
      },
      { status: 400 },
    );
  }
}
