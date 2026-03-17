"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AdminArchiveRecordButton } from "@/components/admin/admin-archive-record-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import type { AdminBannerRecord } from "@/types/admin-merchandising";

type AdminBannersListProps = {
  banners: AdminBannerRecord[];
};

export function AdminBannersList({ banners }: AdminBannersListProps) {
  const [query, setQuery] = useState("");

  const filteredBanners = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return banners;
    }

    return banners.filter((banner) =>
      [banner.title, banner.subtitle, banner.ctaText, banner.ctaLink]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [banners, query]);

  if (banners.length === 0) {
    return (
      <EmptyState
        action={
          <Link href={`${ROUTES.admin.banners}/new`}>
            <Button>Create your first banner</Button>
          </Link>
        }
        description="Banners power your homepage campaign slot and future merchandising moments."
        title="No banners yet"
      />
    );
  }

  return (
    <div className="space-y-5">
      <Card className="space-y-4 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Banner manager
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-[-0.05em]">
              Homepage campaign banners
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by title or CTA..."
              value={query}
            />
            <Link href={`${ROUTES.admin.banners}/new`}>
              <Button>Create banner</Button>
            </Link>
          </div>
        </div>
      </Card>

      {filteredBanners.length === 0 ? (
        <EmptyState description="Try another search term." title="No banners match this view" />
      ) : (
        <div className="space-y-4">
          {filteredBanners.map((banner) => (
            <Card key={banner.id} className="space-y-4 p-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div className="grid gap-4 lg:grid-cols-[140px_minmax(0,1fr)]">
                  <div className="overflow-hidden rounded-[1.3rem] bg-surface">
                    {banner.image?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt={banner.image.alt || banner.title}
                        className="aspect-square w-full object-cover"
                        src={banner.image.url}
                      />
                    ) : (
                      <div className="aspect-square" />
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={
                          banner.active
                            ? "rounded-full border border-success/15 bg-success/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-success"
                            : "rounded-full border border-border bg-white/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                        }
                      >
                        {banner.active ? "Active" : "Inactive"}
                      </span>
                      <span className="rounded-full border border-white/80 bg-white/72 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Sort {banner.sortOrder}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-semibold tracking-[-0.05em]">
                        {banner.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">{banner.subtitle}</p>
                    </div>
                    <p className="text-sm leading-7 text-muted-foreground">
                      CTA: {banner.ctaText} to {banner.ctaLink}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link href={`${ROUTES.admin.banners}/${banner.id}/edit`}>
                    <Button variant="outline">Edit</Button>
                  </Link>
                  {banner.active ? (
                    <AdminArchiveRecordButton
                      actionLabel="Deactivate banner"
                      confirmMessage="Deactivate this banner? It will stop appearing on the homepage but remain editable in admin."
                      endpoint={`/api/admin/banners/${banner.id}`}
                      label="Banner"
                    />
                  ) : null}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
