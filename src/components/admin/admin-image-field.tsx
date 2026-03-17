"use client";

import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  canUploadToCloudinary,
  uploadProductImageToCloudinary,
} from "@/lib/cloudinary/upload";
import type { ProductImage } from "@/types/catalog";

type AdminImageFieldProps = {
  image: ProductImage | null;
  label: string;
  onChange: (image: ProductImage | null) => void;
  helperText?: string;
};

export function AdminImageField({
  image,
  label,
  onChange,
  helperText,
}: AdminImageFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const cloudinaryReady = useMemo(() => canUploadToCloudinary(), []);

  const updateImage = (nextImage: Partial<ProductImage>) => {
    onChange({
      alt: image?.alt ?? "",
      id: image?.id ?? nextImage.publicId ?? `image-${Date.now()}`,
      isPrimary: image?.isPrimary ?? true,
      publicId: image?.publicId,
      url: image?.url ?? "",
      ...nextImage,
    });
  };

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const uploadedImage = await uploadProductImageToCloudinary(file);
      onChange(uploadedImage);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload image.",
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="space-y-4 rounded-[1.5rem] border border-white/80 bg-white/72 p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <label className="text-sm font-medium">{label}</label>
          {helperText ? (
            <p className="mt-1 text-sm text-muted-foreground">{helperText}</p>
          ) : null}
        </div>
        {image ? (
          <Button onClick={() => onChange(null)} type="button" variant="danger">
            Remove
          </Button>
        ) : null}
      </div>

      <div className="grid gap-4 lg:grid-cols-[160px_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-[1.3rem] bg-surface">
          {image?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={image.alt || label}
              className="aspect-square w-full object-cover"
              src={image.url}
            />
          ) : (
            <div className="aspect-square" />
          )}
        </div>

        <div className="space-y-3">
          {cloudinaryReady ? (
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload with Cloudinary</label>
              <input
                accept="image/*"
                className="block w-full text-sm"
                onChange={(event) => void handleUpload(event)}
                type="file"
              />
              {isUploading ? (
                <p className="text-sm text-muted-foreground">Uploading image...</p>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Cloudinary upload is not configured yet. Paste an image URL instead.
            </p>
          )}

          <Input
            onChange={(event) => updateImage({ url: event.target.value })}
            placeholder="Image URL"
            value={image?.url ?? ""}
          />
          <Input
            onChange={(event) => updateImage({ alt: event.target.value })}
            placeholder="Alt text"
            value={image?.alt ?? ""}
          />
          <Input
            onChange={(event) => updateImage({ publicId: event.target.value })}
            placeholder="Cloudinary public ID (optional)"
            value={image?.publicId ?? ""}
          />

          {uploadError ? <p className="text-sm text-danger">{uploadError}</p> : null}
        </div>
      </div>
    </div>
  );
}
