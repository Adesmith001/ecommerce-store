import { cloudinaryConfig } from "@/lib/cloudinary/config";

export function resolveCatalogAssetUrl(asset: string) {
  if (!asset) {
    return "";
  }

  if (asset.startsWith("http://") || asset.startsWith("https://")) {
    return asset;
  }

  if (!cloudinaryConfig.cloudName) {
    return asset;
  }

  return `https://res.cloudinary.com/${cloudinaryConfig.cloudName}/image/upload/${asset}`;
}
