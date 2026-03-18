"use client";

import { cloudinaryConfig } from "@/lib/cloudinary/config";
import type { AdminProductFormImage } from "@/types/admin-product";

type CloudinaryUploadResponse = {
  error?: {
    message?: string;
  };
  original_filename?: string;
  public_id: string;
  secure_url: string;
};

export function canUploadToCloudinary() {
  return Boolean(cloudinaryConfig.cloudName && cloudinaryConfig.uploadPreset);
}

export async function deleteCloudinaryImageByPublicId(publicId: string) {
  const response = await fetch("/api/admin/cloudinary/assets", {
    body: JSON.stringify({ publicId }),
    headers: { "Content-Type": "application/json" },
    method: "DELETE",
  });
  const payload = (await response.json()) as { message?: string };

  if (!response.ok) {
    throw new Error(payload.message ?? "Failed to delete image.");
  }
}

export async function uploadProductImageToCloudinary(
  file: File,
): Promise<AdminProductFormImage> {
  if (!canUploadToCloudinary()) {
    throw new Error("Cloudinary upload is not configured.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryConfig.uploadPreset);
  if (cloudinaryConfig.folder) {
    formData.append("folder", cloudinaryConfig.folder);
  }

  let response: Response;
  try {
    response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        body: formData,
        method: "POST",
      },
    );
  } catch {
    throw new Error(
      "Cloudinary upload request failed. Check your network and that your upload preset allows unsigned browser uploads.",
    );
  }

  let payload: Partial<CloudinaryUploadResponse> = {};
  try {
    payload = (await response.json()) as CloudinaryUploadResponse;
  } catch {
    payload = {};
  }

  if (!response.ok || !payload.secure_url || !payload.public_id) {
    throw new Error(
      payload.error?.message ??
        "Failed to upload image. Ensure your Cloudinary upload preset is unsigned and available to this environment.",
    );
  }

  const publicId = payload.public_id;
  const secureUrl = payload.secure_url;

  return {
    alt: payload.original_filename ?? file.name,
    id: publicId,
    isPrimary: false,
    publicId,
    url: secureUrl,
  };
}
