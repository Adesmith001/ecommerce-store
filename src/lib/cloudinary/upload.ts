"use client";

import { cloudinaryConfig } from "@/lib/cloudinary/config";
import type { AdminProductFormImage } from "@/types/admin-product";

type CloudinaryUploadResponse = {
  original_filename?: string;
  public_id: string;
  secure_url: string;
};

export function canUploadToCloudinary() {
  return Boolean(cloudinaryConfig.cloudName && cloudinaryConfig.uploadPreset);
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
  formData.append("folder", cloudinaryConfig.folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
    {
      body: formData,
      method: "POST",
    },
  );

  const payload = (await response.json()) as CloudinaryUploadResponse & {
    error?: { message?: string };
  };

  if (!response.ok || !payload.secure_url) {
    throw new Error(payload.error?.message ?? "Failed to upload image.");
  }

  return {
    alt: payload.original_filename ?? file.name,
    id: payload.public_id,
    isPrimary: false,
    publicId: payload.public_id,
    url: payload.secure_url,
  };
}
