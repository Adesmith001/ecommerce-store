import "server-only";

import { createHash } from "node:crypto";

type CloudinaryDestroyResponse = {
  error?: {
    message?: string;
  };
  result?: string;
};

function getCloudinaryServerConfig() {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
  const apiKey =
    process.env.CLOUDINARY_API_KEY ?? process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ?? "";
  const apiSecret = process.env.CLOUDINARY_API_SECRET ?? "";

  return {
    apiKey,
    apiSecret,
    cloudName,
  };
}

export function canDeleteFromCloudinaryServer() {
  const config = getCloudinaryServerConfig();
  return Boolean(config.cloudName && config.apiKey && config.apiSecret);
}

export async function deleteCloudinaryImage(publicId: string) {
  const normalizedPublicId = publicId.trim();

  if (!normalizedPublicId) {
    throw new Error("Cloudinary public ID is required.");
  }

  if (!canDeleteFromCloudinaryServer()) {
    throw new Error("Cloudinary delete is not configured.");
  }

  const { apiKey, apiSecret, cloudName } = getCloudinaryServerConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = createHash("sha1")
    .update(`invalidate=true&public_id=${normalizedPublicId}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  const formData = new FormData();
  formData.append("public_id", normalizedPublicId);
  formData.append("timestamp", String(timestamp));
  formData.append("api_key", apiKey);
  formData.append("invalidate", "true");
  formData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
    {
      body: formData,
      cache: "no-store",
      method: "POST",
    },
  );

  const payload = (await response.json()) as CloudinaryDestroyResponse;

  if (!response.ok) {
    throw new Error(payload.error?.message ?? "Failed to delete Cloudinary image.");
  }

  if (payload.result !== "ok" && payload.result !== "not found") {
    throw new Error(payload.error?.message ?? "Cloudinary did not confirm deletion.");
  }

  return payload.result;
}
