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
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_88px]">
      <div className="overflow-hidden rounded-[2rem] border border-border bg-[#ece8e1]">
        {activeImage.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt={activeImage.alt}
            className="aspect-[4/5] w-full object-cover"
            src={activeImage.url}
          />
        ) : (
          <div className="aspect-[4/5] bg-[linear-gradient(180deg,#ebe6de,#dcd5ca)]" />
        )}
      </div>

      <div className="grid grid-cols-5 gap-3 lg:grid-cols-1">
        {galleryImages.map((image) => {
          const isActive = image.id === activeImage.id;

          return (
            <button
              key={image.id}
              className={cn(
                "overflow-hidden rounded-[1.2rem] border bg-[#ece8e1] p-1 transition",
                isActive ? "border-foreground" : "border-border",
              )}
              onClick={() => setActiveImageId(image.id)}
              type="button"
            >
              {image.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  alt={image.alt}
                  className="aspect-square w-full rounded-[1rem] object-cover"
                  src={image.url}
                />
              ) : (
                <div className="aspect-square rounded-[1rem] bg-[linear-gradient(180deg,#ebe6de,#dcd5ca)]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
