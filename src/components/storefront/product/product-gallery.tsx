"use client";

import { useState } from "react";
import { cn } from "@/helpers/cn";
import type { ProductImage } from "@/types/catalog";

type ProductGalleryProps = {
  images: ProductImage[];
  productName: string;
};

export function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const galleryImages =
    images.length > 0
      ? images
      : [
          {
            id: "placeholder",
            url: "",
            alt: `${productName} placeholder`,
          },
        ];
  const [activeImageId, setActiveImageId] = useState(galleryImages[0].id);
  const activeImage =
    galleryImages.find((image) => image.id === activeImageId) ?? galleryImages[0];

  return (
    <div className="space-y-4">
      <div className="editorial-panel overflow-hidden p-4 sm:p-5">
        <div className="relative overflow-hidden rounded-[2.1rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.82),transparent_30%),linear-gradient(180deg,#f8f4ee,#ece4db)]">
          {activeImage.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={activeImage.alt}
              className="aspect-square w-full object-cover"
              src={activeImage.url}
            />
          ) : (
            <div className="aspect-square bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.76),transparent_28%),linear-gradient(180deg,#d8ebf6,#f5ede2)]" />
          )}

          <div className="headline-marquee pointer-events-none absolute inset-x-0 bottom-2 text-center">
            {productName}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
        {galleryImages.map((image) => {
          const isActive = image.id === activeImage.id;

          return (
            <button
              key={image.id}
              className={cn(
                "overflow-hidden rounded-[1.4rem] border bg-white/75 p-1.5 shadow-[0_10px_24px_rgba(20,21,26,0.05)] transition",
                isActive
                  ? "border-primary shadow-[0_0_0_4px_rgba(37,99,235,0.12)]"
                  : "border-white/80",
              )}
              onClick={() => setActiveImageId(image.id)}
              type="button"
            >
              {image.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={image.alt}
                  className="aspect-square w-full rounded-2xl object-cover"
                  src={image.url}
                />
              ) : (
                <div className="aspect-square rounded-2xl bg-[linear-gradient(180deg,#eff6ff,#f9fafb)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
